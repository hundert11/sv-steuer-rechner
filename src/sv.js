import { defaultOptions } from './options.js';
import { valuesForYear, percentages } from './sv-values.js';

// Beitrag = Beitragsgrundlage x Beitragssatz
// Beitragsgrundlage = Einkommen lt. EStB des jeweiligen Jahres, zuzügl. Hinzurrechnungsbeträge
// Hinzurrechnungsbeträge = Vorauszahlungen (+ geleistete Nachzahlungen in dem Jahr?)
export function SVbeitrag(profit, options = {}) {
  if(!profit) { return {toPay: 0}; }
  options = Object.assign({}, defaultOptions, options);

  const year = options.year; // current year
  const values = valuesForYear(year);
  let months = options.foundingYear === year ? 13-options.foundingMonth : 12;

  // Wenn die Einkünfte unter der Einkunftsgrenze (2026: 6.613,20 €) und der Umsatz unter der
  // Umsatzgrenze (2026: 55.000 € brutto) liegen, kann man sich bei der SVS von der Kranken- und
  // Pensionsversicherung ausnehmen lassen und zahlt nur mehr die Unfallversicherung.
  // @see https://www.svs.at/cdscontent/?contentid=10007.816718&portal=svsportal
  // Verglichen wird der Gewinn vor SV-Beiträgen, weil bei einer Ausnahme keine KV/PV-Beiträge anfallen würden.
  const belowUmsatzgrenze = options.income === undefined || options.income <= values.umsatzgrenze;
  if(profit + options.paidSv < values.limit && belowUmsatzgrenze) {
    options.tipps.add('EXCLUDE_KV_PV');
    return {toPay: values.uv * months};
  }

  // Beitragsgrundlage = Einkünfte lt. EStB + Hinzurechnung der vorgeschriebenen KV- und PV-Beiträge.
  // profit ist bereits um paidSv reduziert, daher wird paidSv wieder addiert und nur UV und
  // Selbständigenvorsorge abgezogen (die werden nicht hinzugerechnet).
  const uv = values.uv;
  const svsGrundlage = firstOrSecondYear(options) ? values.svsMinBeitragsgrundlage
    : setGrundlage('svs', year, (profit + options.paidSv) / months);
  const svs = svsGrundlage * percentages(year).vorsorge;
  const Beitragsgrundlage = (profit + options.paidSv - (uv + svs) * months) / months;

  let kvGrundlage = setGrundlage('kv', year, Beitragsgrundlage);
  let pvGrundlage = setGrundlage('pv', year, Beitragsgrundlage);

  // In den ersten beiden Kalenderjahren gilt die Mindestbeitragsgrundlage als vorläufige Beitragsgrundlage.
  if(firstOrSecondYear(options)) {
    kvGrundlage = values.kvMinBeitragsgrundlage;
    pvGrundlage = values.pvMinBeitragsgrundlage;
  }

  const kv = kvGrundlage * percentages(year).kv;
  const pv = pvGrundlage * percentages(year).pv;
  // console.log('Werte pro Monat -->', 'kv:', kv, 'pv:', pv, 'uv:', uv, 'svs:', svs);

  // SV Beitrag
  const toPay = (kv+pv+uv+svs) * months;

  // SV Nachzahlung
  // In den ersten beiden Kalenderjahren wird nur die Pensionsversicherung nachbemessen.
  // Die Mindestbeitragsgrundlage in der Krankenversicherung ist für Gewerbetreibende (WKO-Mitglieder) endgültig.
  // Das entspricht auch der Berechnung des WKO-Rechners (https://svrechner.wko.at/).
  // @see https://www.svs.at/cdscontent/?contentid=10007.816635&portal=svsportal
  let additionalPayment = 0;
  if (firstOrSecondYear(options)) {
    // Die endgültige Beitragsgrundlage entspricht der oben berechneten (Einkünfte + KV/PV-Hinzurechnung),
    // ohne paidSv-Eingabe ist profit noch nicht um den SV-Beitrag reduziert, was sich mit der Hinzurechnung aufhebt.
    const endgueltigeGrundlage = setGrundlage('pv', year, Beitragsgrundlage);
    const voluntaryExtra = Math.max(0, options.paidSv - toPay); // freiwillig erhöhte Vorauszahlung verringert die Nachzahlung
    additionalPayment = Math.max(0, (endgueltigeGrundlage * percentages(year).pv - pv) * months - voluntaryExtra);
  }

  if((toPay+additionalPayment) > options.paidSv) {
    options.tipps.add('INCREASE_SV');
  }

  return {
    toPay,
    additionalPayment
  };
}

function firstOrSecondYear(options) {
  return options.foundingYear === options.year || (options.foundingYear+1) === options.year;
}

function setGrundlage(ofType, year, Beitragsgrundlage) {
  const values = valuesForYear(year);
  let grundlage = Math.max(values[ofType + 'MinBeitragsgrundlage'], Beitragsgrundlage);
  return Math.min(values.maxBeitragsgrundlage, grundlage);
}