import { calculate } from "./index.js";
import { fixValues } from "./src/sv-values.js";

// Wenn man weniger als 5.710,32 € Gewinn pro Jahr erzielt, kann man
// sich bei der SVA von der KV+PV ausnehmen lassen. Man bezahlt dann nur die UV.
test('should return taxfree income if small profit', () => {
  let income = 100;
  let uv = Math.round(fixValues[(new Date().getFullYear())].uv * 12);

  expect(calculate(income, 0)).toStrictEqual({
    est: 0,
    netto: income - uv,
    sv: uv,
    tipps: ['USE_PAUSCHALIERUNG', 'EXCLUDE_KV_PV']
  });
});

test('should return zero ESt because of 11.000 limit', () => {
  let income = 20000;
  let outgo = 9000;
  expect(calculate(income, outgo).est).toBe(0);
});

test('should add tipp to exclude KV/PV if profit is smaller than 5.710,32', () => {
  let income = 20000;
  let outgo = income - 1000;
  expect(calculate(income, outgo).tipps.includes('EXCLUDE_KV_PV')).toBe(true);
});

test('should add tipp to use Pauschalierung when outgo is less than 12%', () => {
  let income = 20000;
  let outgo = income * 0.12 - 1000;
  expect(calculate(income, outgo).tipps.includes('USE_PAUSCHALIERUNG')).toBe(true);
});

test('should NOT add tipp to use Pauschalierung when outgo is more than 12%', () => {
  let income = 20000;
  let outgo = income * 0.12 + 1000;
  expect(calculate(income, outgo).tipps.includes('USE_PAUSCHALIERUNG')).toBe(false);
});

test('should add tipp to increase SV-Beitrag in the founding year, if expected income is big', () => {
  let income = 35000;
  let outgo = income * 0.6;
  expect(calculate(income, outgo).tipps.includes('INCREASE_SV')).toBe(true);
});

test('should NOT add tipp to increase SV-Beitrag in the founding year, if expected income is small', () => {
  let income = 10000;
  let outgo = income * 0.6;
  expect(calculate(income, outgo).tipps.includes('INCREASE_SV')).toBe(false);
});