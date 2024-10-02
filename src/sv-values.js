// Gewerbliche Sozialversicherungsbeiträge
// @see https://www.wko.at/service/arbeitsrecht-sozialrecht/Gewerbliche-Sozialversicherungsbeitraege---Ausmass.html
export const percentages = {
  2025: {
    pv: 0.185,    // 18,5% Pensionsversicherung
    kv: 0.068     // 6,80% Krankenversicherung
  },
  2024: {
    pv: 0.185,    // 18,5% Pensionsversicherung
    kv: 0.068     // 6,80% Krankenversicherung
  },
  2023: {
    pv: 0.185,    // 18,5% Pensionsversicherung
    kv: 0.068     // 6,80% Krankenversicherung
  },
  2022: {
    pv: 0.185,
    kv: 0.068
  },
  2021: {
    pv: 0.185,
    kv: 0.068
  },
  2020: {
    pv: 0.185,
    kv: 0.068
  },
  2019: {
    pv: 0.185,
    kv: 0.0765
  },
  2018: {
    pv: 0.185,
    kv: 0.0765
  },
  2017: {
    pv: 0.185,
    kv: 0.0765
  },
  2016: {
    pv: 0.185,
    kv: 0.0765
  },
  vorsorge: 0.0153,  // 1,53% Selbständigenvorsorge
};

// Beitragsrechtlichen Werte in der Sozialversicherung.
// unter D. Sozialversicherung der selbständig Erwerbstätigen
// mit und ohne Mitgliedschaft in der Wirtschaftskammer sowie der freiberuflich selbständig Erwerbstätigen (Seite 14 oder 15 oder 16)
// @see https://www.sozialversicherung.at/cdscontent/?contentid=10007.862683&portal=svportal
// Einkunftsgrenze = limit
// @see https://www.svs.at/cdscontent/?contentid=10007.846813&portal=svsportal
export const fixValues = {
  2025: {
    uv: 11.35, // TODO: check value in 2025
    kvMinBeitragsgrundlage: 551.10,
    pvMinBeitragsgrundlage: 551.10,
    svsMinBeitragsgrundlage: 551.10,
    maxBeitragsgrundlage: 7525,
    limit: 6439.03 // TODO: check value in 2025
  },
  2024: {
    uv: 11.35, // monatlich in € Unfallversicherung
    kvMinBeitragsgrundlage: 518.44,
    pvMinBeitragsgrundlage: 518.44,
    svsMinBeitragsgrundlage: 518.44,
    maxBeitragsgrundlage: 7070,
    limit: 6221.28
  },
  2023: {
    uv: 10.97, // monatlich in € Unfallversicherung
    kvMinBeitragsgrundlage: 500.91,
    pvMinBeitragsgrundlage: 500.91,
    svsMinBeitragsgrundlage: 500.91,
    maxBeitragsgrundlage: 6825,
    limit: 6010.92
  },
  2022: {
    uv: 10.64, // monatlich in € Unfallversicherung
    kvMinBeitragsgrundlage: 485.85,
    pvMinBeitragsgrundlage: 485.85,
    svsMinBeitragsgrundlage: 485.85,
    maxBeitragsgrundlage: 6615,
    limit: 5830.2
  },
  2021: {
    uv: 10.42, // monatlich in € Unfallversicherung
    kvMinBeitragsgrundlage: 475.86,
    pvMinBeitragsgrundlage: 574.36,
    svsMinBeitragsgrundlage: 475.86,
    maxBeitragsgrundlage: 6475,
    limit: 5710.32
  },
  2020: {
    uv: 10.09,
    kvMinBeitragsgrundlage: 460.66,
    pvMinBeitragsgrundlage: 574.36,
    svsMinBeitragsgrundlage: 460.66,
    maxBeitragsgrundlage: 6265,
    limit: 5527.92
  },
  2019: {
    uv: 9.79,
    kvMinBeitragsgrundlage: 446.81,
    pvMinBeitragsgrundlage: 654.25,
    svsMinBeitragsgrundlage: 446.81,
    maxBeitragsgrundlage: 6090,
    limit: 5361.72
  },
  2018: {
    uv: 9.6,
    kvMinBeitragsgrundlage: 438.05,
    pvMinBeitragsgrundlage: 654.25,
    svsMinBeitragsgrundlage: 438.05,
    maxBeitragsgrundlage: 5985
  },
  2017: {
    uv: 9.33,
    kvMinBeitragsgrundlage: 425.7,
    pvMinBeitragsgrundlage: 723.52,
    svsMinBeitragsgrundlage: 425.7,
    maxBeitragsgrundlage: 5810
  },
  2016: {
    uv: 9.11,
    kvMinBeitragsgrundlage: 415.72,
    pvMinBeitragsgrundlage: 723.52,
    svsMinBeitragsgrundlage: 415.72,
    maxBeitragsgrundlage: 5670
  }
};
