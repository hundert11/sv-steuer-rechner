import test from 'node:test';
import assert from 'node:assert/strict';
import { SVbeitrag } from '../src/sv.js';
import { fixValues, percentages } from '../src/sv-values.js';

// Wenn Sie weniger als 6.221,28 € Gewinn pro Jahr selbstständig erzielen, können Sie
// sich bei der SVA von der Kranken- und Pensionsversicherung ausnehmen lassen.
// Sie bezahlen dann für Ihre Selbstständigkeit nur mehr die Unfallversicherung.
test('should return minimum SV-Beitrag if profit is smaller than the current year limit', () => {
  const year = 2024;
  const options = { year, tipps: new Set() };
  assert.equal(SVbeitrag(fixValues[year].limit - 1, options).toPay, fixValues[year].uv * 12); // 12 months Unfallversicherung
  assert.equal(options.tipps.has('EXCLUDE_KV_PV'), true);
});

test('should return SV-Beitrag for the founding year', () => {
  const year = 2024;
  const months = 10;
  const options = { year, foundingYear: year, foundingMonth: 3, tipps: new Set() };
  const { limit, uv, kvMinBeitragsgrundlage, pvMinBeitragsgrundlage, svsMinBeitragsgrundlage } = fixValues[year];
  const profitOnEStBescheid = limit;

  assert.ok(Math.abs(SVbeitrag(profitOnEStBescheid, options).toPay - (
    uv +
    kvMinBeitragsgrundlage * percentages(year).kv +
    pvMinBeitragsgrundlage * percentages(year).pv +
    svsMinBeitragsgrundlage * percentages(year).vorsorge
  ) * months) < 0.005);
});

test('should return the correct SV-Beitrag for 10.000€ (older founding year)', () => {
  const year = 2024;
  const options = { year, foundingYear: 2020, tipps: new Set() };
  const profit = 10000; // Gewinn vor SV-Beiträgen
  // Der WKO/haude Rechner liefert 2819 (Beitragsgrundlage = 10.000 / 12 ohne Abzug von UV und Selbständigenvorsorge).
  // Beitragsgrundlage = Einkünfte lt. EStB + Hinzurechnung KV/PV = Gewinn vor SV - UV - Selbständigenvorsorge
  const { uv } = fixValues[year];
  const svs = (profit / 12) * percentages(year).vorsorge;
  const grundlage = (profit - (uv + svs) * 12) / 12;
  const expected = (grundlage * (percentages(year).kv + percentages(year).pv) + uv + svs) * 12;
  assert.equal(Math.round(SVbeitrag(profit, options).toPay), Math.round(expected)); // 2746
});

// https://blog.hellerconsult.com/wie-wird-die-sva-berechnet-und-mit-welchen-nachzahlungen-muss-ich-rechnen/
test('should return the correct SV-Nachzahlung for 10.000€ (year = founding year)', () => {
  const year = 2024;
  const options = { year, foundingYear: year, tipps: new Set() };
  const profit = 10000; // Gewinn vor SV-Beiträgen
  const { toPay, additionalPayment } = SVbeitrag(profit, options);
  assert.equal(Math.round(toPay), 1805); // value from WKO & haude Rechner
  // In den ersten beiden Jahren wird nur die PV nachbemessen (KV-Mindestbeitragsgrundlage ist endgültig).
  // Endgültige Beitragsgrundlage = Einkünfte lt. EStB (Gewinn - SV) + Hinzurechnung der KV- und PV-Beiträge
  const { uv, pvMinBeitragsgrundlage, svsMinBeitragsgrundlage } = fixValues[year];
  const grundlage = (profit - (uv + svsMinBeitragsgrundlage * percentages(year).vorsorge) * 12) / 12;
  const expected = (grundlage - pvMinBeitragsgrundlage) * percentages(year).pv * 12;
  assert.ok(Math.abs(additionalPayment - expected) < 0.005);
});

// Vergleich mit dem WKO-Rechner (https://svrechner.wko.at/), Stand 2026:
// Gründung Januar 2026, Gewerbetreibender, Umsatz 30.000 €, Aufwände 5.000 €
// -> Gewinn vor Steuern 19.609 €, SV-Beitrag 1.930 €, SV-Nachzahlung 2.714 €
test('should match the WKO-Rechner SV-Beitrag and SV-Nachzahlung for a founding year 2026', () => {
  const year = 2026;
  const options = { year, foundingYear: year, tipps: new Set() };
  const profit = 19609.5 + 1929.72; // Einkünfte lt. EStB + SV-Beitrag = Gewinn vor SV
  const { toPay, additionalPayment } = SVbeitrag(profit, options);
  assert.equal(Math.round(toPay), 1930);
  assert.equal(Math.round(additionalPayment), 2714);
});

test('should reduce the SV-Nachzahlung by a voluntarily increased SV-Beitrag', () => {
  const year = 2026;
  const withoutExtra = SVbeitrag(21539, { year, foundingYear: year, tipps: new Set() });
  const options = { year, foundingYear: year, paidSv: withoutExtra.toPay + 1000, tipps: new Set() };
  const withExtra = SVbeitrag(21539 - options.paidSv, options); // profit ist um paidSv reduziert
  assert.ok(withExtra.additionalPayment < withoutExtra.additionalPayment);
  assert.ok(Math.abs(withExtra.additionalPayment - (withoutExtra.additionalPayment - 1000)) < 0.005);
});

test('should NOT add tipp to exclude KV/PV if the Umsatz is above the Umsatzgrenze', () => {
  const year = 2026;
  const options = { year, foundingYear: 2020, income: fixValues[year].umsatzgrenze + 1, tipps: new Set() };
  const { toPay } = SVbeitrag(fixValues[year].limit - 1, options);
  assert.equal(options.tipps.has('EXCLUDE_KV_PV'), false);
  assert.ok(toPay > fixValues[year].uv * 12); // Mindestbeiträge für KV und PV
});

test('should use the values of the latest known year for future years', () => {
  const year = Math.max(...Object.keys(fixValues).map(Number)) + 1;
  const options = { year, foundingYear: 2020, tipps: new Set() };
  const latest = { year: year - 1, foundingYear: 2020, tipps: new Set() };
  assert.equal(SVbeitrag(30000, options).toPay, SVbeitrag(30000, latest).toPay);
});
