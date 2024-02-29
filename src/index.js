import { defaultOptions } from './options.js';
import { einkommensteuer, freibetragValues, investGewinnfreibetrag } from './est.js';
import { SVbeitrag } from './sv.js';


// Einkommen laut Einkommensteuerbescheid
function profitOnEStBescheid(income, outgo, options) {
  const freiBetragLimit = freibetragValues(options.year).limit;
  let value = income - outgo - options.paidSv;

  // Übersteigt der Gewinn 33.000 EUR kann zusätzlich zum Grundfreibetrag
  // ein investitionsbedingter Gewinnfreibetrag geltend gemacht werden.
  if(options.useInvestFreibetrag && value <= freiBetragLimit) {
    options.useInvestFreibetrag = false;
  }

  // Wird der Gewinn mittels einer Pauschalierung ermittelt, wird der Grundfreibetrag automatisch angerechnet.
  // Die Geltendmachung des investitionsbedingten Gewinnfreibetrages ist jedoch nicht zulässig.
  if(!options.useInvestFreibetrag) {
    const pauschalierung = Math.min(income * 0.12, 26400);
    if(pauschalierung > outgo) {
      // -12% Basispauschalierung (wenn Ausgaben nicht höher)
      value = income - pauschalierung - options.paidSv;
      options.tipps.add('USE_PAUSCHALIERUNG');
    }
    if(value > freiBetragLimit) {
      options.tipps.add('USE_INVESTFREIBETRAG');
    }
  }

  value -= (Math.min(value, freiBetragLimit) * freibetragValues(options.year).percentage); // - 15% Grundfreibetrag
  if(options.useInvestFreibetrag && options.investFreibetrag) {
    value -= options.investFreibetrag; // - 15% Investitionsbedingter Gewinnfreibetrag
  }
  return value;
}


function calculate(income, outgo, options = {}) {
  options = Object.assign({}, defaultOptions, options);
  options.tipps = new Set();
  options.paidSv = options.paidSv || 0;

  let profit = profitOnEStBescheid(income, outgo, options);
  const sv = SVbeitrag(profit, options);

  // if no user input, calculate profit based on SV estimate
  if(!options.paidSv) {
    options.paidSv = sv.toPay;
    profit = profitOnEStBescheid(income, outgo, options);
  }
  const est = einkommensteuer(profit, options.year);
  let netto = Math.round(income - outgo - est - options.paidSv);

  if(options.useInvestFreibetrag) {
    netto -= options.investFreibetrag;
  }

  return {
    est: Math.round(est),
    sv: Math.round(sv.toPay),
    svAdditional: Math.round(sv.additionalPayment || 0),
    profit,
    maxInvestFreibetrag: investGewinnfreibetrag(profit, options.year),
    netto,
    tipps: [...options.tipps]
  };
}

export default { calculate, profitOnEStBescheid };

// set to global window, used for DEMO
if(typeof window !== "undefined") {
  window.hundert11 = { calculate: calculate };
}