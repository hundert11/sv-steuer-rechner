import { defaultOptions } from './options.js';
import { percentages, fixValues } from './sv-values.js';

// Beitrag = Beitragsgrundlage x Beitragssatz
// Beitragsgrundlage = Einkommen lt. EStB des jeweiligen Jahres, zuzügl. Hinzurrechnungsbeträge
// Hinzurrechnungsbeträge = Vorrauszahlungen (+ geleistete Nachzahlungen in dem Jahr?)
export function SVbeitrag(profit, options = {}) {
  if(!profit) { return {toPay: 0}; }
  options = Object.assign({}, defaultOptions, options);

  const year = options.year; // current year
  let months = options.foundingYear === year ? 13-options.foundingMonth : 12;

  // Wenn Sie weniger als 5.710,32 € (2021) Gewinn pro Jahr selbstständig erzielen, können Sie
  // sich bei der SVA von der Kranken- und Pensionsversicherung ausnehmen lassen.
  // Sie bezahlen dann für Ihre Selbstständigkeit nur mehr die Unfallversicherung.
  if(profit < fixValues[year].limit) {
    options.tipps.add('EXCLUDE_KV_PV');
    return {toPay: fixValues[year].uv * months};
  }

  let Beitragsgrundlage = (profit + options.paidSv) / months;
  let firstOrSecondYear = options.foundingYear === year || (options.foundingYear+1) === year;

  let kvGrundlage = setGrundlage('kv', year, Beitragsgrundlage);
  let pvGrundlage = setGrundlage('pv', year, Beitragsgrundlage);
  let svsGrundlage = setGrundlage('svs', year, Beitragsgrundlage);

  if(firstOrSecondYear) {
    kvGrundlage = fixValues[year].kvMinBeitragsgrundlage;
    pvGrundlage = fixValues[year].pvMinBeitragsgrundlage;
    svsGrundlage = fixValues[year].svsMinBeitragsgrundlage;
  }

  let kv = kvGrundlage * percentages[year].kv;
  let pv = pvGrundlage * percentages[year].pv;
  const uv = fixValues[year].uv;
  const svs = svsGrundlage * percentages.vorsorge;
  // console.log('Werte pro Monat -->', 'kv:', kv, 'pv:', pv, 'uv:', uv, 'svs:', svs);

  // SV Beitrag
  const toPay = (kv+pv+uv+svs) * months;
  // SV Nachzahlung
  // @see https://www.svs.at/cdscontent/?contentid=10007.816635&portal=svsportal
  let additionalPayment = 0;
  if (firstOrSecondYear) {
    Beitragsgrundlage = (profit - toPay) / months;
    kvGrundlage = setGrundlage('kv', year, Beitragsgrundlage);
    pvGrundlage = setGrundlage('pv', year, Beitragsgrundlage);
    kv = kvGrundlage * percentages[year].kv - kv;
    pv = pvGrundlage * percentages[year].pv - pv;
    additionalPayment = (kv+pv) * months;
  }

  if((toPay+additionalPayment) > options.paidSv) {
    options.tipps.add('INCREASE_SV');
  }

  return {
    toPay,
    additionalPayment
  };
}

function setGrundlage(ofType, year, Beitragsgrundlage) {
  let grundlage = Math.max(fixValues[year][ofType + 'MinBeitragsgrundlage'], Beitragsgrundlage);
  return Math.min(fixValues[year].maxBeitragsgrundlage, grundlage);
}