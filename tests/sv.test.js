import { SVbeitrag } from '../src/sv.js';
import { fixValues, percentages } from '../src/sv-values.js';

// Wenn Sie weniger als 6.221,28 € Gewinn pro Jahr selbstständig erzielen, können Sie
// sich bei der SVA von der Kranken- und Pensionsversicherung ausnehmen lassen.
// Sie bezahlen dann für Ihre Selbstständigkeit nur mehr die Unfallversicherung.
test('should return minimum SV-Beitrag if profit is smaller than the current year limit', () => {
  const year = 2024;
  const options = { year, tipps: new Set() };
  expect(SVbeitrag(fixValues[year].limit - 1, options).toPay).toBe(fixValues[year].uv * 12); // 12 months Unfallversicherung
  expect(options.tipps.has('EXCLUDE_KV_PV')).toBe(true);
});

test('should return SV-Beitrag for the founding year', () => {
  const year = 2024;
  const months = 10;
  const options = { year, foundingYear: year, foundingMonth: 3, tipps: new Set() };
  const { limit, uv, kvMinBeitragsgrundlage, pvMinBeitragsgrundlage, svsMinBeitragsgrundlage } = fixValues[year];
  const profitOnEStBescheid = limit;

  expect(SVbeitrag(profitOnEStBescheid, options).toPay).toBeCloseTo((
    uv +
    kvMinBeitragsgrundlage * percentages[year].kv +
    pvMinBeitragsgrundlage * percentages[year].pv +
    svsMinBeitragsgrundlage * percentages.vorsorge
  ) * months);
});