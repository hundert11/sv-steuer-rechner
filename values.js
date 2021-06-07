// https://www.wko.at/service/arbeitsrecht-sozialrecht/Gewerbliche-Sozialversicherungsbeitraege---Ausmass.html
const percentages = {
  2021: {
    pv: 0.185,        // 18,5% Pensionsversicherung
    kv: 0.068,        // 6,80% Krankenversicherung
  },
  2020: {
    pv: 0.185,
    kv: 0.068,
  },
  2019: {
    pv: 0.185,
    kv: 0.0765,
  },
  2018: {
    pv: 0.185,
    kv: 0.0765,
  },
  2017: {
    pv: 0.185,
    kv: 0.0765,
  },
  2016: {
    pv: 0.185,
    kv: 0.0765,
  },
  vorsorge: 0.0153,  // 1,53% Selbständigenvorsorge
};

const fixValues = {
  2021: {
    uv: 10.42, // monatlich in € Unfallversicherung
    kvMinBeitragsgrundlage: 475.86,
    pvMinBeitragsgrundlage: 574.36,
    svsMinBeitragsgrundlage: 475.86,
    maxBeitragsgrundlage: 6475
  },
  2020: {
    uv: 10.09,
    maxBeitragsgrundlage: 6265
  },
  2019: {
    uv: 117.49
  },
  2018: {
    uv: 115.2
  },
  2017: {
    uv: 9.33,
    kvMinBeitragsgrundlage: 425.70,
    pvMinBeitragsgrundlage: 723.52,
    svsMinBeitragsgrundlage: 425.70,
    maxBeitragsgrundlage: 5810
  },
  2016: {
    uv: 109.32
  }
};

module.exports = { percentages, fixValues };
