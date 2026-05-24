import { db } from "../../sheet";
import {
    ReferentielItem,
    TransactionTotal,
    DividendeTotal,
    ResumeTimeSeriesValues
} from "Shared/RouteType/Response";

/** Ligne Referentiel telle que lue depuis la feuille (colonnes plates). */
type ReferentielItemRaw = {
    id: string;
    name: string;
    isin: string;
    management_fee: number;
    price: number;
    estimated_j_1: number;
    estimated_j_7: number;
    estimated_1_mois: number;
    estimated_6_mois: number;
    estimated_1_an: number;
    _line: number;
};

/** Ligne TransactionTotal telle que lue depuis la feuille (colonnes plates). */
type TransactionTotalRaw = {
    id: string;
    price: number;
    nb: number;
    nb_j_1: number;
    nb_j_7: number;
    nb_1_mois: number;
    nb_6_mois: number;
    nb_1_an: number;
    comission: number;
    fee: number;
    pru: number;
    total_invested: number;
    invested_j_1: number;
    invested_j_7: number;
    invested_1_mois: number;
    invested_6_mois: number;
    invested_1_an: number;
    estimated: number;
    estimated_j_1: number;
    estimated_j_7: number;
    estimated_1_mois: number;
    estimated_6_mois: number;
    estimated_1_an: number;
};

const EMPTY_TIME_SERIES: ResumeTimeSeriesValues = {
    current: 0,
    j1: 0,
    j7: 0,
    j30: 0,
    m6: 0,
    y1: 0
};

const EMPTY_TRANSACTION_TOTAL: TransactionTotal = {
    id: "",
    price: 0,
    nb: { ...EMPTY_TIME_SERIES },
    comission: 0,
    fee: 0,
    pru: 0,
    total: {
        invest: { ...EMPTY_TIME_SERIES },
        estimated: { ...EMPTY_TIME_SERIES }
    }
};

function mapPriceSeries(raw: ReferentielItemRaw): ResumeTimeSeriesValues {
    return {
        current: raw.price,
        j1: raw.estimated_j_1,
        j7: raw.estimated_j_7,
        j30: raw.estimated_1_mois,
        m6: raw.estimated_6_mois,
        y1: raw.estimated_1_an
    };
}

function mapReferentielItem(raw: ReferentielItemRaw): Omit<ReferentielItem, "totals"> {
    return {
        id: raw.id,
        name: raw.name,
        isin: raw.isin,
        management_fee: raw.management_fee,
        price: mapPriceSeries(raw),
        _line: raw._line
    };
}

function mapNbSeries(raw: TransactionTotalRaw): ResumeTimeSeriesValues {
    return {
        current: raw.nb,
        j1: raw.nb_j_1,
        j7: raw.nb_j_7,
        j30: raw.nb_1_mois,
        m6: raw.nb_6_mois,
        y1: raw.nb_1_an
    };
}

function mapInvestSeries(raw: TransactionTotalRaw): ResumeTimeSeriesValues {
    return {
        current: raw.total_invested,
        j1: raw.invested_j_1,
        j7: raw.invested_j_7,
        j30: raw.invested_1_mois,
        m6: raw.invested_6_mois,
        y1: raw.invested_1_an
    };
}

function mapEstimatedSeries(raw: TransactionTotalRaw): ResumeTimeSeriesValues {
    return {
        current: raw.estimated,
        j1: raw.estimated_j_1,
        j7: raw.estimated_j_7,
        j30: raw.estimated_1_mois,
        m6: raw.estimated_6_mois,
        y1: raw.estimated_1_an
    };
}

function mapTransactionTotal(raw: TransactionTotalRaw): TransactionTotal {
    return {
        id: raw.id,
        price: raw.price,
        nb: mapNbSeries(raw),
        comission: raw.comission,
        fee: raw.fee,
        pru: raw.pru,
        total: {
            invest: mapInvestSeries(raw),
            estimated: mapEstimatedSeries(raw)
        }
    };
}

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

        const referentiels = (referentielRepository.getMany() as ReferentielItemRaw[]).map(mapReferentielItem);
        const transactionTotals = (transactionTotalRepository.getMany() as TransactionTotalRaw[]).map(
            mapTransactionTotal
        );
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
