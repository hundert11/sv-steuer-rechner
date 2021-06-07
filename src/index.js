const { percentages, fixValues } = require('./values');

const defaultOptions = {
  year: (new Date().getFullYear()),
  foundingYear: (new Date()).getFullYear(),
  foundingMonth: 1,
  // pauschalierung: true,
  // investFreibetrag: false,
  paidSv: 0,
};
let tipps;

// Einkommen laut Einkommensteuerbescheid
function profitOnEStBescheid(income, outgo, sv = 0) {
  const pauschalierung = Math.min(income * 0.12, 26400);
  if(pauschalierung > outgo && !tipps.includes('USE_PAUSCHALIERUNG')) {
    tipps.push('USE_PAUSCHALIERUNG');
  }
  let value = income - Math.max(outgo, pauschalierung) - sv; // -12% Basispauschalierung (wenn Ausgaben nicht höher)
  value -= Math.min(value * 0.13, 3900); // - 13% Grundfreibetrag
  return value;
}
function einkommensteuer(value) {
  return (value<=11000 ? 0 : (value<=18000 ? (value-11000)*0.2 : (value<=31000 ? (value-18000)*0.35+1750 : (value<=60000 ? (value-31000)*0.42+6300 : (value<=90000 ? (value-60000)*0.48+18480 : (value<=1000000 ? (value-90000)*0.5+32880 : (value-1000000)*0.55+487880))))));
  //=IF(H15<=11000;0;IF(H15<=18000;(H15-11000)*0,2;IF(H15<=31000;(H15-18000)*0,35+1750;IF(H15<=60000;(H15-31000)*0,42+6300;IF(H15<=90000;(H15-60000)*0,48+18480;IF(H15<=1000000;(H15-90000)*0,5+32880;(H15-1000000)*0,55+487880))))))
};

// Beitrag = Beitragsgrundlage x Beitragssatz
// Beitragsgrundlage = Einkommen lt. EStB des jeweiligen Jahres, zuzügl. Hinzurrechnungsbeträge
// Hinzurrechnungsbeträge = Vorrauszahlungen (+ geleistete Nachzahlungen in dem Jahr?)
function SVbeitrag(profit, options = {}) {
  options = Object.assign({}, defaultOptions, options);

  const year = options.year; // current year
  let months = options.foundingYear === year ? 13-options.foundingMonth : 12;

  // Wenn Sie weniger als 5.710,32 € Gewinn pro Jahr selbstständig erzielen, können Sie
  // sich bei der SVA von der Kranken- und Pensionsversicherung ausnehmen lassen.
  // Sie bezahlen dann für Ihre Selbstständigkeit nur mehr die Unfallversicherung.
  if(profit < 5710.32) {
    tipps.push('EXCLUDE_KV_PV');
    return fixValues[year].uv * months;
  }

  let SVbeitragsgrundlage = (profit + options.paidSv) / months;
  let firstOrSecondYear = options.foundingYear === year || (options.foundingYear+1) === year;

  let kvGrundlage = fixValues[year].kvMinBeitragsgrundlage;
  let svsGrundlage = fixValues[year].svsMinBeitragsgrundlage;

  let _kvGrundlage = Math.max(fixValues[year].kvMinBeitragsgrundlage, SVbeitragsgrundlage);
  _kvGrundlage = Math.min(fixValues[year].maxBeitragsgrundlage, _kvGrundlage);
  let _svsGrundlage = Math.max(fixValues[year].svsMinBeitragsgrundlage, SVbeitragsgrundlage);
  _svsGrundlage = Math.min(fixValues[year].maxBeitragsgrundlage, _svsGrundlage);

  if(!firstOrSecondYear) {
    kvGrundlage = _kvGrundlage;
    svsGrundlage = _svsGrundlage;
  } else if(kvGrundlage < _kvGrundlage) {
    tipps.push('INCREASE_SV');
  }

  let pvGrundlage = Math.max(fixValues[year].pvMinBeitragsgrundlage, SVbeitragsgrundlage);
  pvGrundlage = Math.min(fixValues[year].maxBeitragsgrundlage, pvGrundlage);

  const kv = kvGrundlage * percentages[year].kv;
  const pv = pvGrundlage * percentages[year].pv;
  const uv = fixValues[year].uv;
  const svs = svsGrundlage * percentages.vorsorge;
  console.log('Werte pro Monat -->', 'kv:', kv, 'pv:', pv, 'uv:', uv, 'svs:', svs);

  return (kv+pv+uv+svs) * months;
};


function calculations(income, outgo, options = {}) {
  options = Object.assign({}, defaultOptions, options);
  tipps = [];

  let profit = profitOnEStBescheid(income, outgo);
  const sv = SVbeitrag(profit, options);
  profit = profitOnEStBescheid(income, outgo, sv);
  const est = einkommensteuer(profit);
  const netto = income - outgo - est - sv;

  return {
    est,
    sv,
    netto,
    tipps,
  };
};

module.exports = calculations