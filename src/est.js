// Einkommensteuertarif
// @see https://www.usp.gv.at/steuern-finanzen/einkommensteuer/tarifstufen-berechnungsformeln.html

export function einkommensteuer(value, year) {
  if(year > 2019) {
    return (value<=11000 ? 0 : (value<=18000 ? (value-11000)*0.2 : (value<=31000 ? (value-18000)*0.35+1400 : (value<=60000 ? (value-31000)*0.42+5950 : (value<=90000 ? (value-60000)*0.48+18130 : (value<=1000000 ? (value-90000)*0.5+32530 : (value-1000000)*0.55+487530))))));
  }
  return (value<=11000 ? 0 : (value<=18000 ? (value-11000)*0.25 : (value<=31000 ? (value-18000)*0.35+1750 : (value<=60000 ? (value-31000)*0.42+6300 : (value<=90000 ? (value-60000)*0.48+18480 : (value<=1000000 ? (value-90000)*0.5+32880 : (value-1000000)*0.55+487880))))));
};