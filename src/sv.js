import { defaultOptions } from './options.js';
import { percentages, fixValues } from './sv-values.js';

// Beitrag = Beitragsgrundlage x Beitragssatz
// Beitragsgrundlage = Einkommen lt. EStB des jeweiligen Jahres, zuzügl. Hinzurrechnungsbeträge
// Hinzurrechnungsbeträge = Vorrauszahlungen (+ geleistete Nachzahlungen in dem Jahr?)
export function SVbeitrag(profit, options = {}) {
  if(!profit) { return {toPay: 0}; }
  options = Object.assign({}, defaultOptions, options);

  const year = options.year; // current year
  let months = options.foundingYear === year ? 13-options.foundingMonth : 12;

  // Wenn Sie weniger als 5.710,32 € Gewinn pro Jahr selbstständig erzielen, können Sie
  // sich bei der SVA von der Kranken- und Pensionsversicherung ausnehmen lassen.
  // Sie bezahlen dann für Ihre Selbstständigkeit nur mehr die Unfallversicherung.
  if(profit < 5710.32) {
    options.tipps.add('EXCLUDE_KV_PV');
    return {toPay: fixValues[year].uv * months};
  }

  let SVbeitragsgrundlage = (profit + options.paidSv) / months;
  let firstOrSecondYear = options.foundingYear === year || (options.foundingYear+1) === year;

  let kvGrundlage = fixValues[year].kvMinBeitragsgrundlage;
  let svsGrundlage = fixValues[year].svsMinBeitragsgrundlage;
  let pvGrundlage = fixValues[year].pvMinBeitragsgrundlage;

  let _kvGrundlage = Math.max(fixValues[year].kvMinBeitragsgrundlage, SVbeitragsgrundlage);
  _kvGrundlage = Math.min(fixValues[year].maxBeitragsgrundlage, _kvGrundlage);
  let _svsGrundlage = Math.max(fixValues[year].svsMinBeitragsgrundlage, SVbeitragsgrundlage);
  _svsGrundlage = Math.min(fixValues[year].maxBeitragsgrundlage, _svsGrundlage);
  let _pvGrundlage = Math.max(fixValues[year].pvMinBeitragsgrundlage, SVbeitragsgrundlage);
  _pvGrundlage = Math.min(fixValues[year].maxBeitragsgrundlage, _pvGrundlage);

  if(!firstOrSecondYear) {
    kvGrundlage = _kvGrundlage;
    svsGrundlage = _svsGrundlage;
    pvGrundlage = _pvGrundlage; // TODO add 'Nachzahlung'
  } else if(_kvGrundlage > kvGrundlage) {
    options.tipps.add('INCREASE_SV');
  }
  // TODO add tipp when to increase SVBeitrag (if you can input your paid SVbeitrag)
  // options.tipps.add('INCREASE_SV');

  const kv = kvGrundlage * percentages[year].kv;
  const pv = pvGrundlage * percentages[year].pv;
  const uv = fixValues[year].uv;
  const svs = svsGrundlage * percentages.vorsorge;
  // console.log('Werte pro Monat -->', 'kv:', kv, 'pv:', pv, 'uv:', uv, 'svs:', svs);

  return {
    toPay: (kv+pv+uv+svs) * months,
    additionalPayment: firstOrSecondYear ? (_pvGrundlage * percentages[year].pv - pv) * months : 0
  };
};