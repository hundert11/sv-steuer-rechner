import hundert11 from '../src/index.js';
import { fixValues } from '../src/sv-values.js';
import { freibetragValues } from '../src/est.js';

// Wenn man weniger als 5.710,32 € Gewinn pro Jahr erzielt, kann man
// sich bei der SVA von der KV+PV ausnehmen lassen. Man bezahlt dann nur die UV.
test('should return taxfree income if small profit', () => {
  let income = 100;
  let uv = Math.round(fixValues[(new Date().getFullYear())].uv * 12);

  const { est, netto, sv, tipps } = hundert11.calculate(income, 0);
  expect({ est, netto, sv, tipps }).toStrictEqual({
    est: 0,
    netto: income - uv,
    sv: uv,
    tipps: ['USE_PAUSCHALIERUNG', 'EXCLUDE_KV_PV']
  });
});

test('should return zero ESt because of 11.000 limit', () => {
  let income = 20000;
  let outgo = 9000;
  expect(hundert11.calculate(income, outgo).est).toBe(0);
});

test('should return the correct SV-Beitrag for 10.000€ (older founding year)', () => {
  const year = 2024;
  const options = { year, foundingYear: 2020 };
  let income = 10000;
  let outgo = 1200;
  /**
   * 2497 would be the value from WKO & haude Rechner, but they are
   * NOT using 'Einkommen lt. EStB', therefore missing the substraction of Grundfreibetrag.
   * I now expect the value from https://www.ea-tabelle.at/?from=2548 which is 2143.
   */
  const eaTabelleSvValue = 2143;
  expect(hundert11.calculate(income, outgo, options).sv).toBe(eaTabelleSvValue);

  income = 10000;
  outgo = 0; // testing -12% Basispauschalierung
  expect(hundert11.calculate(income, outgo, options).sv).toBe(eaTabelleSvValue);
});

test('should return the correct SV-Nachzahlung for 10.000€ (year = founding year)', () => {
  const year = 2024;
  const options = { year, foundingYear: year };
  let income = 10000;
  let outgo = 1200;
  let { sv, svAdditional } = hundert11.calculate(income, outgo, options);
  const haudeSvValues = [1805, 429]; // values from WKO & haude Rechner
  // both values from https://www.ea-tabelle.at/?from=2548
  expect(sv).toBe(haudeSvValues[0]);
  // expect(svAdditional).toBe(haudeSvValues[1]);
});

test('should add tipp to exclude KV/PV if profit is smaller than 5.710,32', () => {
  let income = 20000;
  let outgo = income - 1000;
  expect(hundert11.calculate(income, outgo).tipps.includes('EXCLUDE_KV_PV')).toBe(true);
});

test('should add tipp to use Pauschalierung when outgo is less than 12%', () => {
  let income = 20000;
  let outgo = income * 0.12 - 1000;
  expect(hundert11.calculate(income, outgo).tipps.includes('USE_PAUSCHALIERUNG')).toBe(true);
});

test('should NOT add tipp to use Pauschalierung when outgo is more than 12%', () => {
  let income = 20000;
  let outgo = income * 0.12 + 1000;
  expect(hundert11.calculate(income, outgo).tipps.includes('USE_PAUSCHALIERUNG')).toBe(false);
});

test('should add tipp to increase SV-Beitrag in the founding year, if expected income is big', () => {
  let income = 35000;
  let outgo = income * 0.6;
  expect(hundert11.calculate(income, outgo).tipps.includes('INCREASE_SV')).toBe(true);
});

test('should NOT add tipp to increase SV-Beitrag in the founding year, if expected income is small', () => {
  let income = 10000;
  let outgo = income * 0.6;
  expect(hundert11.calculate(income, outgo).tipps.includes('INCREASE_SV')).toBe(false);
});

test('should return zero maxInvestFreibetrag because of 33.000 limit', () => {
  let income = 40000;
  let outgo = 7000;
  expect(hundert11.calculate(income, outgo).maxInvestFreibetrag).toBe(0);
});

// Maximalausmaß von 46.400 EUR
// @see https://www.wko.at/steuern/der-gewinnfreibetrag
test('should return correct maxInvestFreibetrag for 2024', () => {
  let income = 833000;
  let outgo = 200000;
  const { grundfreibetrag } = freibetragValues(2024); // = 4950
  expect(grundfreibetrag).toBe(4950);
  expect(hundert11.calculate(income, outgo).maxInvestFreibetrag).toBe(46400 - grundfreibetrag);
});

test('should return correct maxInvestFreibetrag for 2023', () => {
  let income = 833000;
  let outgo = 200000;
  const { grundfreibetrag } = freibetragValues(2023); // = 4500
  expect(grundfreibetrag).toBe(4500);
  expect(hundert11.calculate(income, outgo, {year: 2023}).maxInvestFreibetrag).toBe(45950 - grundfreibetrag);
});