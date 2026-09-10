// Einkommensteuertarif
// Ab dem Jahr 2023 werden - um der kalten Progression entgegenzuwirken - jährlich die Tarifstufen (außer die letzte ab 1 Million Euro) um zwei Drittel der Inflationsrate angepasst.
// @see https://www.usp.gv.at/themen/steuern-finanzen/einkommensteuer-ueberblick/weitere-informationen-est/tarifstufen.html

// Tarifstufen und Grenzsteuersätze je Veranlagungsjahr (Werte davor: 2022 bzw. 2021 und älter)
const tarife = {
  2022: { limits: [11000, 18000, 31000, 60000, 90000, 1000000], percentages: [0, 0.2, 0.325, 0.42, 0.48, 0.5, 0.55] },
  2023: { limits: [11693, 19134, 32075, 62080, 93120, 1000000], percentages: [0, 0.2, 0.3, 0.41, 0.48, 0.5, 0.55] },
  2024: { limits: [12816, 20818, 34513, 66612, 99266, 1000000], percentages: [0, 0.2, 0.3, 0.4, 0.48, 0.5, 0.55] }, // reduce 0.41 to 0.4 from 2023 to 2024
  2025: { limits: [13308, 21617, 35836, 69166, 103072, 1000000], percentages: [0, 0.2, 0.3, 0.4, 0.48, 0.5, 0.55] },
  2026: { limits: [13539, 21992, 36458, 70365, 104859, 1000000], percentages: [0, 0.2, 0.3, 0.4, 0.48, 0.5, 0.55] },
  // +2,27% (zwei Drittel von 3,4% Inflation), Verordnung vom September 2026, @see https://orf.at/stories/3440836/
  2027: { limits: [13846, 22491, 37285, 71960, 107236, 1000000], percentages: [0, 0.2, 0.3, 0.4, 0.48, 0.5, 0.55] }
};
export const latestTarifYear = Math.max(...Object.keys(tarife).map(Number));

// Für Jahre, für die noch kein Tarif bekannt ist (z.B. das kommende Jahr), wird der letzte bekannte Tarif verwendet.
export function tarif(year) {
  if (year <= 2021) {
    return { limits: tarife[2022].limits, percentages: [0, 0.25, 0.35, 0.42, 0.48, 0.5, 0.55] };
  }
  return tarife[Math.min(year, latestTarifYear)];
}

export function einkommensteuer(value, year) {
  let { limits, percentages } = tarif(year);

  limits = limits.filter(limit => limit < value);
  limits.push(value); // add value to the end of the array

  let est = 0;
  limits.forEach((limit, index) => {
    est += (limit - (index > 0 ? limits[index-1] : 0)) * percentages[index];
  });
  return est;
}

/**
 * Basispauschalierung
 * Für das Veranlagungsjahr 2025 wurde die Umsatzgrenze von 220.000 Euro auf 320.000 Euro angehoben
 * und das Betriebsausgabenpauschale von 12 % auf 13,5 % der Umsätze erhöht.
 * Ab dem Veranlagungsjahr 2026 gilt eine Umsatzgrenze von 420.000 Euro sowie ein Betriebsausgabenpauschale von 15 %.
 * @see https://www.wko.at/steuern/basispauschalierung
 */
export function pauschalierungValues(year) {
  const limit = year <= 2024 ? 220000 : year === 2025 ? 320000 : 420000;
  const percentage = year <= 2024 ? 0.12 : year === 2025 ? 0.135 : 0.15; // 12% bis 2024, 13,5% in 2025, 15% ab 2026
  return {
    limit,
    percentage,
    max: limit * percentage
  }
}

// Gewinnfreibetrag
// @see https://www.wko.at/steuern/der-gewinnfreibetrag
// @see https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/gewinnfreibetrag.html

export function freibetragValues(year) {
  // Bis zur Veranlagung 2023 stand der Grundfreibetrag für Gewinne bis 30.000 €
  const limit = year <= 2023 ? 30000 : 33000;
    // höchstens jedoch 13% bzw. ab 2022 15% des Betriebsgewinnes
  const percentage = year < 2022 ? 0.13 : 0.15;
  return {
    limit,
    percentage,
    grundfreibetrag: limit * percentage, // max
    investLimitsAndPcts: [{limit: 145000, pct: 0.13}, {limit: 175000, pct: 0.07}, {limit: 230000, pct: 0.045}]
  }
}

/**
 * Bei einer Bemessungsgrundlage von 33.000 EUR bis zu 178.000 EUR beträgt der investitionsbedingte Gewinnfreibetrag 13%.
 * Wird dieser Betrag überschritten, steht für die nächsten 175.000 EUR ein Freibetrag von 7% und
 * für weitere 230.000 EUR ein Freibetrag von 4,5% zu.
 * Ab einer Bemessungsgrundlage von 583.000 EUR steht kein Gewinnfreibetrag mehr zu.
 * Durch die Prozentstaffelung ergibt sich ein Maximalausmaß von 46.400 EUR.
 */
export function investGewinnfreibetrag(value, year) {
  const { limit, investLimitsAndPcts } = freibetragValues(year);
  if(value <= limit) {
    return 0;
  }
  let freibetrag = 0;
  let rest = parseInt(value) - limit; // - 33.000 € Limit des Grundfreibetrags

  for(const limitAndPct of investLimitsAndPcts) {
    if (rest <= limitAndPct.limit) {
      break;
    }
    freibetrag += parseInt(Math.min(rest, limitAndPct.limit) * limitAndPct.pct);
    rest -= limitAndPct.limit;
  }
  return freibetrag;
}
