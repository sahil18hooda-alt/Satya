export interface ElectionEvent {
    year: number;
    type: 'Lok Sabha' | 'Vidhan Sabha' | 'Local Body' | 'By-Election';
    state: string;
    mcc_days: number;
    est_cost_per_voter: number;
    is_onoe_consolidated?: boolean; // Used for simulation
}

export const HISTORICAL_ELECTIONS: ElectionEvent[] = [
    // --- LOK SABHA (General Elections - National) ---
    { year: 1977, type: 'Lok Sabha', state: 'ALL', mcc_days: 45, est_cost_per_voter: 200 },
    { year: 1980, type: 'Lok Sabha', state: 'ALL', mcc_days: 45, est_cost_per_voter: 250 },
    { year: 1984, type: 'Lok Sabha', state: 'ALL', mcc_days: 45, est_cost_per_voter: 300 },
    { year: 1989, type: 'Lok Sabha', state: 'ALL', mcc_days: 45, est_cost_per_voter: 350 },
    { year: 1991, type: 'Lok Sabha', state: 'ALL', mcc_days: 45, est_cost_per_voter: 400 },
    { year: 1996, type: 'Lok Sabha', state: 'ALL', mcc_days: 45, est_cost_per_voter: 450 },
    { year: 1998, type: 'Lok Sabha', state: 'ALL', mcc_days: 45, est_cost_per_voter: 500 },
    { year: 1999, type: 'Lok Sabha', state: 'ALL', mcc_days: 45, est_cost_per_voter: 550 },
    { year: 2004, type: 'Lok Sabha', state: 'ALL', mcc_days: 45, est_cost_per_voter: 600 },
    { year: 2009, type: 'Lok Sabha', state: 'ALL', mcc_days: 50, est_cost_per_voter: 700 },
    { year: 2014, type: 'Lok Sabha', state: 'ALL', mcc_days: 55, est_cost_per_voter: 850 },
    { year: 2019, type: 'Lok Sabha', state: 'ALL', mcc_days: 60, est_cost_per_voter: 1000 },
    { year: 2024, type: 'Lok Sabha', state: 'ALL', mcc_days: 65, est_cost_per_voter: 1200 },

    // --- UTTAR PRADESH (Vidhan Sabha) ---
    { year: 1977, type: 'Vidhan Sabha', state: 'Uttar Pradesh', mcc_days: 40, est_cost_per_voter: 150 },
    { year: 1980, type: 'Vidhan Sabha', state: 'Uttar Pradesh', mcc_days: 40, est_cost_per_voter: 180 },
    { year: 1985, type: 'Vidhan Sabha', state: 'Uttar Pradesh', mcc_days: 40, est_cost_per_voter: 220 },
    { year: 1989, type: 'Vidhan Sabha', state: 'Uttar Pradesh', mcc_days: 40, est_cost_per_voter: 260 },
    { year: 1991, type: 'Vidhan Sabha', state: 'Uttar Pradesh', mcc_days: 40, est_cost_per_voter: 300 },
    { year: 1993, type: 'Vidhan Sabha', state: 'Uttar Pradesh', mcc_days: 40, est_cost_per_voter: 350 },
    { year: 1996, type: 'Vidhan Sabha', state: 'Uttar Pradesh', mcc_days: 40, est_cost_per_voter: 400 },
    { year: 2002, type: 'Vidhan Sabha', state: 'Uttar Pradesh', mcc_days: 45, est_cost_per_voter: 500 },
    { year: 2007, type: 'Vidhan Sabha', state: 'Uttar Pradesh', mcc_days: 45, est_cost_per_voter: 600 },
    { year: 2012, type: 'Vidhan Sabha', state: 'Uttar Pradesh', mcc_days: 45, est_cost_per_voter: 700 },
    { year: 2017, type: 'Vidhan Sabha', state: 'Uttar Pradesh', mcc_days: 50, est_cost_per_voter: 850 },
    { year: 2022, type: 'Vidhan Sabha', state: 'Uttar Pradesh', mcc_days: 55, est_cost_per_voter: 950 },

    // --- GOA (Vidhan Sabha) ---
    { year: 1977, type: 'Vidhan Sabha', state: 'Goa', mcc_days: 35, est_cost_per_voter: 120 },
    { year: 1980, type: 'Vidhan Sabha', state: 'Goa', mcc_days: 35, est_cost_per_voter: 150 },
    { year: 1984, type: 'Vidhan Sabha', state: 'Goa', mcc_days: 35, est_cost_per_voter: 180 },
    { year: 1989, type: 'Vidhan Sabha', state: 'Goa', mcc_days: 40, est_cost_per_voter: 220 },
    { year: 1994, type: 'Vidhan Sabha', state: 'Goa', mcc_days: 40, est_cost_per_voter: 280 },
    { year: 1999, type: 'Vidhan Sabha', state: 'Goa', mcc_days: 40, est_cost_per_voter: 350 },
    { year: 2002, type: 'Vidhan Sabha', state: 'Goa', mcc_days: 45, est_cost_per_voter: 400 },
    { year: 2007, type: 'Vidhan Sabha', state: 'Goa', mcc_days: 45, est_cost_per_voter: 500 },
    { year: 2012, type: 'Vidhan Sabha', state: 'Goa', mcc_days: 45, est_cost_per_voter: 650 },
    { year: 2017, type: 'Vidhan Sabha', state: 'Goa', mcc_days: 50, est_cost_per_voter: 800 },
    { year: 2022, type: 'Vidhan Sabha', state: 'Goa', mcc_days: 50, est_cost_per_voter: 900 },

    // --- MAHARASHTRA (Vidhan Sabha) ---
    { year: 1978, type: 'Vidhan Sabha', state: 'Maharashtra', mcc_days: 40, est_cost_per_voter: 160 },
    { year: 1980, type: 'Vidhan Sabha', state: 'Maharashtra', mcc_days: 40, est_cost_per_voter: 180 },
    { year: 1985, type: 'Vidhan Sabha', state: 'Maharashtra', mcc_days: 40, est_cost_per_voter: 220 },
    { year: 1990, type: 'Vidhan Sabha', state: 'Maharashtra', mcc_days: 40, est_cost_per_voter: 280 },
    { year: 1995, type: 'Vidhan Sabha', state: 'Maharashtra', mcc_days: 40, est_cost_per_voter: 350 },
    { year: 1999, type: 'Vidhan Sabha', state: 'Maharashtra', mcc_days: 45, est_cost_per_voter: 420 },
    { year: 2004, type: 'Vidhan Sabha', state: 'Maharashtra', mcc_days: 45, est_cost_per_voter: 550 },
    { year: 2009, type: 'Vidhan Sabha', state: 'Maharashtra', mcc_days: 50, est_cost_per_voter: 700 },
    { year: 2014, type: 'Vidhan Sabha', state: 'Maharashtra', mcc_days: 55, est_cost_per_voter: 850 },
    { year: 2019, type: 'Vidhan Sabha', state: 'Maharashtra', mcc_days: 60, est_cost_per_voter: 1000 },
    { year: 2024, type: 'Vidhan Sabha', state: 'Maharashtra', mcc_days: 65, est_cost_per_voter: 1200 },
];
