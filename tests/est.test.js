import test from 'node:test';
import assert from 'node:assert/strict';
import { einkommensteuer, freibetragValues, investGewinnfreibetrag } from '../src/est.js';

test('should return 0 for 0-13308 income', () => {
  assert.equal(einkommensteuer(0, 2025), 0);
  assert.equal(einkommensteuer(13308, 2025), 0);
  assert.notEqual(einkommensteuer(13309, 2025), 0);
});

test('should return correct ESt for all levels in 2025', () => {
  const limits = [13308, 21617, 35836, 69166, 103072, 1000000];
  const percentages = [0, 0.2, 0.3, 0.4, 0.48, 0.5, 0.55];
  const levels = limits.map((limit, index) => {
    return {
      limit,
      est: (limit - (index > 0 ? limits[index-1] : 0)) * percentages[index]
    };
  });
  levels.forEach((level, i) => { level.est += (levels[i-1] ? levels[i-1].est : 0); });
  levels.forEach((level) => {
    assert.equal(einkommensteuer(level.limit, 2025), level.est);
  });
});

test('should return correct ESt for all levels in 2024', () => {
  const limits = [12816, 20818, 34513, 66612, 99266, 1000000];
  const percentages = [0, 0.2, 0.3, 0.4, 0.48, 0.5, 0.55];
  const levels = limits.map((limit, index) => {
    return {
      limit,
      est: (limit - (index > 0 ? limits[index-1] : 0)) * percentages[index]
    };
  });
  levels.forEach((level, i) => { level.est += (levels[i-1] ? levels[i-1].est : 0); });
  levels.forEach((level) => {
    assert.equal(einkommensteuer(level.limit, 2024), level.est);
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
    assert.equal(einkommensteuer(level.limit, 2023), level.est);
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
    assert.equal(einkommensteuer(level.limit, 2022), level.est);
  });
});

test('should return correct ESt for all levels + 1€ in 2024', () => {
  const limits = [12816, 20818, 34513, 66612, 99266, 1000000];
  const percentages = [0, 0.2, 0.3, 0.4, 0.48, 0.5, 0.55];
  const levels = limits.map((limit, index) => {
    return {
      amount: limit,
      est: (limit - (index > 0 ? limits[index-1] : 0)) * percentages[index],
      pct: percentages[index]
    };
  });
  levels.forEach((level, i) => { level.est += (levels[i-1] ? levels[i-1].est : 0); });
  levels.forEach((level, i) => {
    assert.equal(Math.round(einkommensteuer(level.amount + 1, 2024)), Math.round(
      level.est + (levels[i+1] ? levels[i+1].pct : level.pct) // 1€ = next percentage
    ));
  });
});

// Maximalausmaß von 46.400 EUR
// @see https://www.wko.at/steuern/der-gewinnfreibetrag
test('should return correct investGewinnfreibetrag for 2024', () => {
  const profit = 633000;
  const { grundfreibetrag } = freibetragValues(2024);
  assert.equal(investGewinnfreibetrag(profit, 2024), 46400 - grundfreibetrag);
});

test('should return correct maxInvestFreibetrag for 2023', () => {
  const profit = 633000;
  const { grundfreibetrag } = freibetragValues(2023);
  assert.equal(investGewinnfreibetrag(profit, 2023), 45950 - grundfreibetrag);
});