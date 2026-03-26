// build.mjs
/**
 * @fileoverview Script de build Vite personnalisé pour Google Apps Script (GAS).
 * Gère la compilation de multiples points d'entrée, la création d'alias dynamiques
 * pour des librairies locales, et l'exposition globale des fonctions pour les triggers GAS.
 */

import { build } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// --- CONSTANTES DE CONFIGURATION ---

/** * @constant {string}
 * @description Nom du fichier de configuration principal du build.
 */
const CONFIG_FILE_NAME = 'build.config.json';

/** * @constant {string}
 * @description Nom du fichier manifeste requis par Google Apps Script.
 */
const MANIFEST_FILE_NAME = 'appsscript.json';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = 'dist';
const entryConfigPath = path.resolve(__dirname, CONFIG_FILE_NAME);
const gasManifestPath = path.resolve(__dirname, MANIFEST_FILE_NAME);


// ==========================================
// --- DÉFINITION DES TYPES (TSDoc) ---
// ==========================================

/**
 * @typedef {Object} EntryInfo
 * @property {string} path - Le chemin d'accès au fichier source.
 * @property {string} [env] - (Nouveau) Le chemin vers le fichier d'environnement spécifique.
 * @property {string[]} [external] - (Optionnel) Liste des librairies à exclure.
 * @property {Record<string, string>} [globals] - (Optionnel) Mapping des variables globales.
 */

/**
 * @typedef {Object} ExternalLib
 * @property {string} alias - Le nom de l'alias utilisé dans les imports TypeScript/JavaScript (ex: "MypkgAppsScript").
 * @property {string} path - Le chemin relatif ou absolu vers le dossier de la librairie locale.
 */

/**
 * @typedef {Object} BuildConfig
 * @property {Record<string, EntryInfo | string>} entry - Dictionnaire contenant les points d'entrée à compiler. La clé devient le nom du fichier de sortie.
 * @property {ExternalLib[]} [external_lib] - (Optionnel) Tableau déclarant les librairies locales partagées pour générer les alias Vite.
 */


// ==========================================
// --- PLUGINS ET FONCTIONS ---
// ==========================================

/**
 * Plugin Rollup/Vite pour remplacer les variables d'environnement dans le code.
 * Plante la compilation si une variable utilisée n'est pas définie dans l'environnement.
 */
const envReplacePlugin = (replacements, entryKey, envFileName) => {
    return {
        name: 'env-replace',
        transform(code, id) {
            let hasChanges = false;
            // Intercepte tous les appels à process.env.QUELQUE_CHOSE
            const regex = /process\.env\.([a-zA-Z0-9_]+)/g;

            const transformedCode = code.replace(regex, (match, varName) => {
                hasChanges = true;

                // On vérifie si la variable existe dans nos remplacements
                if (varName in replacements) {
                    return JSON.stringify(replacements[varName]);
                } else {
                    // Si elle manque, on lève une erreur fatale pour stopper le build
                    throw new Error(`\n⛔ [env-replace] Variable manquante : process.env.${varName} est utilisée dans le code mais n'est pas définie dans le fichier d'environnement "${envFileName}" (Entrée : "${entryKey}").\nFichier concerné : ${id}`);
                }
            });

            return hasChanges ? { code: transformedCode, map: null } : null;
        }
    };
};

/**
 * Plugin Rollup/Vite pour créer le Pont (Bridge) Google Apps Script.
 * Dans un format IIFE, les fonctions sont encapsulées. Ce plugin lit les exports
 * et génère des fonctions globales (ex: `function doPost() { ... }`) à la fin du fichier
 * pour que l'environnement GAS puisse y accéder.
 * * @returns {import('vite').Plugin} Le plugin Vite configuré.
 */
const gasIifeBridgePlugin = () => {
    return {
        name: 'gas-iife-bridge',
        generateBundle(options, bundle) {
            if (options.format !== 'iife') return;

            for (const fileName in bundle) {
                const chunk = bundle[fileName];
                if (chunk.type === 'chunk' && chunk.isEntry) {
                    const libName = options.name;
                    const exports = chunk.exports;

                    const bridgeCode = exports.map(exportName => {
                        return `function ${exportName}() { return ${libName}.${exportName}.apply(this, arguments); }`;
                    }).join('\n');

                    chunk.code += `\n\n/* GAS Bridge */\n${bridgeCode}`;
                }
            }
        }
    };
};

/**
 * Génère un objet de configuration Vite dynamique pour un point d'entrée spécifique.
 *
 * @param {string} entryKey - Le nom de la clé d'entrée (ex: "main"), qui sera utilisé comme nom de fichier de sortie ("main.js").
 * @param {EntryInfo | string} entryInfo - L'objet de configuration du point d'entrée, ou directement le chemin (string).
 * @param {number} index - L'index de l'itération en cours (permet de vider `dist` uniquement au premier passage).
 * @param {string} mode - Le mode de compilation en cours ('development' ou 'production').
 * @param {Record<string, string>} dynamicAliases - Le dictionnaire d'alias résolus avec des chemins absolus.
 * @param {Record<string, string>} envReplacements - Les variables d'environnement à remplacer.
 * @returns {import('vite').UserConfig} La configuration prête à être passée à la fonction `build()` de Vite.
 * @throws {Error} Si le chemin (`path`) du point d'entrée est manquant ou invalide.
 */
const createViteConfig = (entryKey, entryInfo, index, mode, dynamicAliases, envReplacements, envFileName) => {
    const isDev = mode === 'development';

    // Crée un nom de variable globale unique pour l'IIFE afin d'éviter les collisions dans GAS
    const uniqueLibName = `_entry_${entryKey.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // Extraction sécurisée
    const entryPath = typeof entryInfo === 'string' ? entryInfo : entryInfo?.path;

    if (!entryPath) {
        throw new Error(`❌ Erreur de configuration: Le chemin (path) pour l'entrée "${entryKey}" est manquant dans ${CONFIG_FILE_NAME}.`);
    }

    const externalLibs = entryInfo.external || [];
    const globalLibs = entryInfo.globals || {};

    return {
        configFile: false,
        mode: mode,
        resolve: {
            alias: dynamicAliases
        },
        build: {
            lib: {
                entry: path.resolve(__dirname, entryPath),
                formats: ['iife'],
                name: uniqueLibName,
                fileName: () => `${entryKey}.js`
            },
            minify: !isDev,
            outDir: distDir,
            emptyOutDir: index === 0, // Ne vide le dossier 'dist' qu'à la première itération
            rollupOptions: {
                external: externalLibs,
                treeshake: !isDev,
                output: {
                    inlineDynamicImports: true,
                    globals: globalLibs
                }
            }
        },
        plugins: [
            // Remplacement des variables d'environnement
            envReplacePlugin(envReplacements, entryKey, envFileName),
            // Copie appsscript.json vers /dist à chaque itération pour assurer la synchro
            viteStaticCopy({
                targets: [{ src: MANIFEST_FILE_NAME, dest: '.' }]
            }),
            gasIifeBridgePlugin()
        ]
    };
};

/**
 * Fonction d'orchestration principale.
 * Lit le fichier JSON, génère les alias, valide les données et lance la compilation
 * Vite séquentiellement pour chaque point d'entrée.
 *
 * @async
 * @returns {Promise<void>}
 */
async function runBuilds() {
    const mode = process.argv[2] || 'production';

    // --- 1. VÉRIFICATIONS DE SÉCURITÉ ---
    if (!fs.existsSync(entryConfigPath)) {
        console.error(`⛔ Fichier ${CONFIG_FILE_NAME} introuvable à la racine.`);
        process.exit(1);
    }

    if (!fs.existsSync(gasManifestPath)) {
        console.error(`⛔ Manifeste ${MANIFEST_FILE_NAME} introuvable à la racine.`);
        process.exit(1);
    }

    // --- 2. LECTURE DE LA CONFIGURATION ---
    /** @type {BuildConfig} */
    const configData = JSON.parse(fs.readFileSync(entryConfigPath, 'utf-8'));

    // --- 3. GÉNÉRATION DES ALIAS DYNAMIQUES ---
    /** @type {Record<string, string>} */
    const dynamicAliases = {};
    if (Array.isArray(configData.external_lib)) {
        configData.external_lib.forEach(lib => {
            if (lib.alias && lib.path) {
                dynamicAliases[lib.alias] = path.resolve(__dirname, lib.path);
            }
        });
    }

    // --- 4. RÉCUPÉRATION DES POINTS D'ENTRÉE ---
    const entries = configData.entry || {};
    const entryKeys = Object.keys(entries);

    if (entryKeys.length === 0) {
        console.error(`⛔ Aucune entrée définie dans l'objet "entry" de ${CONFIG_FILE_NAME}.`);
        process.exit(1);
    }

    console.log(`🚀 Démarrage du Build (Mode: ${mode}) - ${entryKeys.length} entrée(s) trouvée(s)`);

    // --- 5. BOUCLE DE COMPILATION ---
    for (const [index, key] of entryKeys.entries()) {
        const entryInfo = entries[key];

        console.log(`\n📦 [${index + 1}/${entryKeys.length}] Building: ${key}.js`);

        // --- GESTION DE L'ENVIRONNEMENT ---
        let envFileName = "None";
        let envParsed = {};

        // On vérifie si un fichier d'environnement est explicitement défini dans la config
        if (entryInfo.env) {
            envFileName = entryInfo.env;
            const envFilePath = path.resolve(__dirname, envFileName);

            // Règle 1 : Exit avec erreur si le fichier env est défini mais introuvable
            if (!fs.existsSync(envFilePath)) {
                console.error(`⛔ ERREUR CRITIQUE: Le fichier d'environnement "${envFileName}" requis pour l'entrée "${key}" est introuvable.`);
                process.exit(1);
            }

            // Chargement du fichier spécifique
            envParsed = dotenv.config({ path: envFilePath }).parsed || {};
            console.log(`  ✅ Fichier ${envFileName} chargé avec succès.`);
        } else {
            console.log(`  ℹ️ Fichier env : ${envFileName} (Aucune variable externe chargée)`);
        }

        // On injecte NODE_ENV par sécurité pour éviter que des librairies tierces
        // (comme React/Vue) ne fassent planter le build en cherchant cette variable.
        const envReplacements = {
            NODE_ENV: mode,
            ...envParsed
        };

        try {
            // Règle 2 appliquée via le plugin dans createViteConfig
            const config = createViteConfig(key, entryInfo, index, mode, dynamicAliases, envReplacements, envFileName);
            await build(config);
        } catch (error) {
            console.error(`🔥 Erreur lors du build de ${key}:`);
            throw error;
        }
    }

    console.log("✅ Build terminé avec succès !");
}

// ==========================================
// --- EXÉCUTION DU SCRIPT ---
// ==========================================
runBuilds().catch(err => {
    console.error("🔥 Erreur critique :", err.message || err);
    process.exit(1);
});