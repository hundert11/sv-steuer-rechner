// Einkommensteuertarif
// Ab dem Jahr 2023 werden - um der kalten Progression entgegenzuwirken - jährlich die Tarifstufen (außer die letzte ab 1 Million Euro) um zwei Drittel der Inflationsrate angepasst.
// @see https://www.usp.gv.at/steuern-finanzen/einkommensteuer-ueberblick/weitere-informationen-est/tarifstufen.html

export function einkommensteuer(value, year) {
  let limits = [11000, 18000, 31000, 60000, 90000, 1000000]; // 2022 and below
  let percentages = [0, 0.25, 0.35, 0.42, 0.48, 0.5, 0.55]; // 2021 and below

  // add switch for limits and percentages
  switch (year) {
    case 2022:
      percentages = [0, 0.2, 0.325, 0.42, 0.48, 0.5, 0.55];
      break;
    case 2023:
      limits = [11693, 19134, 32075, 62080, 93120, 1000000];
      percentages = [0, 0.2, 0.3, 0.41, 0.48, 0.5, 0.55];
      break;
    case 2024:
      limits = [12816, 20818, 34513, 66612, 99266, 1000000];
      percentages = [0, 0.2, 0.3, 0.4, 0.48, 0.5, 0.55]; // reduce 0.41 to 0.4 from 2023 to 2024
      break;
    // 2025: Alle Steuerstufen werden um knapp 4 Prozent angehoben.
    // @see https://www.bmf.gv.at/presse/pressemeldungen/2024/juli/brunner-entlastung-2025.html
    case 2025:
      limits = [13308, 21617, 35836, 69166, 103072, 1000000];
      percentages = [0, 0.2, 0.3, 0.4, 0.48, 0.5, 0.55];
      break;
    default:
      break;
  }

  limits = limits.filter(limit => limit < value);
  limits.push(value); // add value to the end of the array

  let est = 0;
  limits.forEach((limit, index) => {
    est += (limit - (index > 0 ? limits[index-1] : 0)) * percentages[index];
  });
  return est;
}

// Gewinnfreibetrag
// @see https://www.wko.at/steuern/der-gewinnfreibetrag
// @see https://www.usp.gv.at/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/gewinnfreibetrag.html

export function freibetragValues(year) {
  // Bis zur Veranlagung 2023 stand der Grundfreibetrag für Gewinne bis 30.000 €
  const limit = year <= 2023 ? 30000 : 33000;
    // höchstens jedoch 13% bzw. ab 2022 15% des Betriebsgewinnes
  const percentage = year < 2022 ? 0.13 : 0.15;
  return {
    limit,
    percentage,
    grundfreibetrag: limit * percentage,
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