import { einkommensteuer, freibetragValues, investGewinnfreibetrag } from "../src/est";

test('should return 0 for 0-11693 income', () => {
  expect(einkommensteuer(0, 2024)).toBe(0);
  expect(einkommensteuer(11693, 2024)).toBe(0);
  expect(einkommensteuer(11694, 2024)).not.toBe(0);
});

test('should return correct ESt for all levels in 2024', () => {
  const limits = [11693, 19134, 32075, 62080, 93120, 1000000];
  const percentages = [0, 0.2, 0.3, 0.4, 0.48, 0.5, 0.55];
  const levels = limits.map((limit, index) => {
    return {
      limit,
      est: (limit - (index > 0 ? limits[index-1] : 0)) * percentages[index]
    };
  });
  levels.forEach((level, i) => { level.est += (levels[i-1] ? levels[i-1].est : 0); });
  levels.forEach((level) => {
    expect(einkommensteuer(level.limit, 2024)).toBe(level.est);
  });
});

test('should return correct ESt for all levels in 2023', () => {
  const limits = [11693, 19134, 32075, 62080, 93120, 1000000];
  const percentages = [0, 0.2, 0.3, 0.41, 0.48, 0.5, 0.55];
  const levels = limits.map((limit, index) => {
    return {
      limit,
      est: (limit - (index > 0 ? limits[index-1] : 0)) * percentages[index]
    };
  });
  levels.forEach((level, i) => { level.est += (levels[i-1] ? levels[i-1].est : 0); });
  levels.forEach((level) => {
    expect(einkommensteuer(level.limit, 2023)).toBe(level.est);
  });
});

test('should return correct ESt for all levels in 2022', () => {
  const limits = [11000, 18000, 31000, 60000, 90000, 1000000];
  const percentages = [0, 0.2, 0.325, 0.42, 0.48, 0.5, 0.55];;
  const levels = limits.map((limit, index) => {
    return {
      limit,
      est: (limit - (index > 0 ? limits[index-1] : 0)) * percentages[index]
    };
  });
  levels.forEach((level, i) => { level.est += (levels[i-1] ? levels[i-1].est : 0); });
  levels.forEach((level) => {
    expect(einkommensteuer(level.limit, 2022)).toBe(level.est);
  });
});

// Maximalausmaß von 46.400 EUR
// @see https://www.wko.at/steuern/der-gewinnfreibetrag
test('should return correct investGewinnfreibetrag for 2024', () => {
  const profit = 633000;
  const { grundfreibetrag } = freibetragValues(2024);
  expect(investGewinnfreibetrag(profit, 2024)).toBe(46400 - grundfreibetrag);
});

test('should return correct maxInvestFreibetrag for 2023', () => {
  const profit = 633000;
  const { grundfreibetrag } = freibetragValues(2023);
  expect(investGewinnfreibetrag(profit, 2023)).toBe(45950 - grundfreibetrag);
});