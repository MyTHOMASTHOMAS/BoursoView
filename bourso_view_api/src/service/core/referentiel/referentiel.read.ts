import { db } from "../../sheet";
import { ReferentielItem, TransactionTotal, DividendeTotal } from "Shared/RouteType/Response";

const EMPTY_TRANSACTION_TOTAL: TransactionTotal = {
    id: "",
    price: 0,
    nb: 0,
    comission: 0,
    fee: 0,
    pru: 0,
    total_invested: 0,
    estimated: 0,
    estimated_j_1: 0,
    estimated_j_7: 0,
    estimated_1_mois: 0
};

const EMPTY_DIVIDENDE_TOTAL: DividendeTotal = {
    id: 0,
    amount_brut: 0,
    taxe: 0,
    commission: 0,
    amount_net: 0
};

export default {
    getAll() {
        const referentielRepository = db.getRepository("referentiel");
        const transactionTotalRepository = db.getRepository("transactionTotal");
        const dividendeTotalRepository = db.getRepository("dividendeTotal");
        const lastRow = referentielRepository.getLastRow();

        // Pas de lignes de donnees (startPos est ligne 2 -> index 1)
        if (lastRow < 1) {
            return [] as ReferentielItem[];
        }

        const referentiels = referentielRepository.getMany() as Array<Omit<ReferentielItem, "totals">>;
        const transactionTotals = transactionTotalRepository.getMany() as TransactionTotal[];
        const dividendeTotals = dividendeTotalRepository.getMany() as DividendeTotal[];

        return referentiels.map((referentiel) => {
            const transactionTotal =
                transactionTotals.find((item) => item.id === referentiel.id) ?? {
                    ...EMPTY_TRANSACTION_TOTAL,
                    id: referentiel.id
                };

            const dividendeTotal =
                dividendeTotals.find((item) => String(item.id) === String(referentiel.id)) ?? EMPTY_DIVIDENDE_TOTAL;

            return {
                ...referentiel,
                totals: {
                    transaction: transactionTotal,
                    dividende: dividendeTotal
                }
            };
        });
    }
};