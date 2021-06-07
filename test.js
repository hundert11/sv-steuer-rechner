const calculations = require('./index');
const { percentages, fixValues } = require('./values');

// Wenn man weniger als 5.710,32 € Gewinn pro Jahr erzielt, kann man
// sich bei der SVA von der KV+PV ausnehmen lassen. Man bezahlt dnan nur die UV.
test('should return taxfree income', () => {
  let income = 100;
  let uv = fixValues[(new Date().getFullYear())].uv * 12;
  expect(calculations(income, 0)).toStrictEqual({"est": 0, "netto": income - uv, "sv": uv});
});

test('should return zero ESt', () => {
  let income = 20000;
  let outgo = 9000;
  expect(calculations(income, outgo).est).toBe(0);
});