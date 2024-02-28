// Einkommensteuertarif
// @see https://www.usp.gv.at/steuern-finanzen/einkommensteuer/tarifstufen.html

export function einkommensteuer(value, year) {
  if(year >= 2024) {
    return (value<=11000 ? 0 : (value<=18000 ? (value-11000)*0.2 : (value<=31000 ? (value-18000)*0.30+1400 : (value<=60000 ? (value-31000)*0.4+5300 : (value<=90000 ? (value-60000)*0.48+16900 : (value<=1000000 ? (value-90000)*0.5+31300 : (value-1000000)*0.55+486300))))));
  }
  if(year === 2023) {
    return (value<=11000 ? 0 : (value<=18000 ? (value-11000)*0.2 : (value<=31000 ? (value-18000)*0.30+1400 : (value<=60000 ? (value-31000)*0.41+5300 : (value<=90000 ? (value-60000)*0.48+17109 : (value<=1000000 ? (value-90000)*0.5+31509 : (value-1000000)*0.55+486509))))));
  }
  if(year === 2022) {
    return (value<=11000 ? 0 : (value<=18000 ? (value-11000)*0.2 : (value<=31000 ? (value-18000)*0.325+1400 : (value<=60000 ? (value-31000)*0.42+5625 : (value<=90000 ? (value-60000)*0.48+17805 : (value<=1000000 ? (value-90000)*0.5+32205 : (value-1000000)*0.55+487530))))));
  }
  if(year >= 2020) { // 2021 + 2020
    return (value<=11000 ? 0 : (value<=18000 ? (value-11000)*0.2 : (value<=31000 ? (value-18000)*0.35+1400 : (value<=60000 ? (value-31000)*0.42+5950 : (value<=90000 ? (value-60000)*0.48+18130 : (value<=1000000 ? (value-90000)*0.5+32530 : (value-1000000)*0.55+487530))))));
  }
  return (value<=11000 ? 0 : (value<=18000 ? (value-11000)*0.25 : (value<=31000 ? (value-18000)*0.35+1750 : (value<=60000 ? (value-31000)*0.42+6300 : (value<=90000 ? (value-60000)*0.48+18480 : (value<=1000000 ? (value-90000)*0.5+32880 : (value-1000000)*0.55+487880))))));
}

// Gewinnfreibetrag
// @see https://www.wko.at/steuern/der-gewinnfreibetrag
// @see https://www.usp.gv.at/steuern-finanzen/betriebseinnahmen-und-ausgaben/gewinnfreibetrag.html

export function freibetragValues(year) {
  return {
    // Bis zur Veranlagung 2023 stand der Grundfreibetrag für Gewinne bis 30.000 €
    limit: year <= 2023 ? 30000 : 33000,
    // höchstens jedoch 13% bzw. ab 2022 15% des Betriebsgewinnes
    percentage: year < 2022 ? 0.13 : 0.15,
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
  let rest = parseInt(value) - limit; // - 33.000 € Grundfreibetrag

  for(const limitAndPct of investLimitsAndPcts) {
    if (rest <= limitAndPct.limit) {
      break;
    }
    freibetrag += parseInt(Math.min(rest, limitAndPct.limit) * limitAndPct.pct);
    rest -= limitAndPct.limit;
  }
  return freibetrag;
}