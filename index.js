import { defaultOptions } from './src/options.js';
import { einkommensteuer } from './src/est.js';
import { SVbeitrag } from './src/sv.js';

// Einkommen laut Einkommensteuerbescheid
function profitOnEStBescheid(income, outgo, options) {
  const pauschalierung = Math.min(income * 0.12, 26400);
  if(pauschalierung > outgo) {
    options.tipps.add('USE_PAUSCHALIERUNG');
  }
  let value = income - Math.max(outgo, pauschalierung) - options.paidSv; // -12% Basispauschalierung (wenn Ausgaben nicht höher)
  value -= Math.min(value * 0.13, 3900); // - 13% Grundfreibetrag
  return value;
}

export function calculate(income, outgo, options = {}) {
  options = Object.assign({}, defaultOptions, options);
  options.tipps = new Set();

  let profit = profitOnEStBescheid(income, outgo, options);
  const sv = SVbeitrag(profit, options);
  options.paidSv = sv;
  profit = profitOnEStBescheid(income, outgo, options);
  const est = einkommensteuer(profit, options.year);
  const netto = Math.round(income - outgo - est - sv);

  return {
    est: Math.round(est),
    sv: Math.round(sv),
    netto,
    tipps: [...options.tipps]
  };
};

// set to global window, used for DEMO
if(typeof window !== "undefined") {
  window.hundert11 = { calculate: calculate };
}