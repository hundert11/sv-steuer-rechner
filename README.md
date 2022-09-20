# SV- und Steuer-Rechner

Hilft dein wahres Jahres-Nettoeinkommen zu schätzen und gibt Tipps, wie du deinen steuerlichen Gewinn reduzieren und dadurch deinen reellen Gewinn maximieren kannst!

Dieser SV- und Steuer-Rechner ist Open-Source und für alle EinzelunternehmerInnen oder FreelancerInnen, die mir helfen wollen Klarheit in ihre Zahlen zu bringen.


## 111 vs. WKO Rechner

Der [WKO-Rechner](https://svrechner.wko.at/) ist ein fantastisches Tool um die EST (Einkommensteuer), SV-Beitrag und SV-Nachzahlung zu berechnen. Nach meinem Wissen ist der von haude entwickelte Rechner einer der besten in Österreich.
Ihr fragt euch womöglich, warum ich dann den 111-Rechner überhaupt entwickle.

**111-Funktionen:**

Im Laufe der Jahre habe ich Lust auf ein neues Tool bekommen, das meine SV-Nachzahlungen verringern soll. 

* Man kann alte Jahre “nachrechnen”
* Die Basispauschalierung wird autom. berücksichtigt, wenn die reellen Ausgaben weniger sein sollten
* Du kannst deinen jährlichen SV-Beitrag eingeben um zu sehen ob du zu wenig oder zu viel zahlst

**Die Unterschiede zum WKO-Rechner:**

1. **Open Source**  
Jeder soll sehen wie die Zahlen berechnet werden - im WKO-Rechner finde ich diese Prozentsätze nicht mit dem die Sozialversicherungsbeträge errechnet werden.

2. **Pauschalierung vs. reelle Ausgaben**  
Viele wissen nicht, dass es die [Betriebsausgabenpauschale](https://www.wko.at/service/steuern/Die_Basispauschalierung.html) gibt. Ich habe als Entwicklerin fast keine Ausgaben - ich arbeite von zu Hause aus, meine Büromaterialien beschränken sich auf Schreibtisch, Laptop und Monitor. Das heißt, wenn du sicher weißt, dass du mit deinen jährlichen Ausgaben nicht auf 12% deines Umsatzes (= pauschalierte Betriebsausgaben) kommst, kannst du es dir sparen Belege zu sammeln. Natürlich solltest du eine Vergleichsrechnung machen! Außerdem glaube ich einen [Fehler im WKO-Rechner](https://www.facebook.com/groups/amici.delle.sva/permalink/3764616033599817/) gefunden zu haben, wo es um die 12% Betriebsausgabenpauschale geht.

3. **Nettoeinkommen ohne SV-Nachzahlung**  
Ich finde, der WKO-Rechner gibt "falsche" Tipps, ein Beispiel: "In den Folgejahren ist eine Nachzahlung zur Sozialversicherung in Höhe von € 10.000 zu erwarten." Wieso nicht gleich für dieses Jahr den SV-Beitrag erhöhen, dadurch vermindert sich auch der steuerliche Gewinn und ich habe im nächsten Jahr keine große Überraschung.
**Das Problem für Neugründer:** Ihr werdet in den ersten 2 Jahren weit unten für die Krankenversicherungbeiträge eingestuft! Die endgültige Berechnung erfolgt erst im 3. Jahr, was zu hohen Nachzahlungen führen kann.


## [Demo](https://hundertelf.github.io/sv-steuer-rechner/demo/)

Hier könnt ihr den [111-Rechner](https://hundertelf.github.io/sv-steuer-rechner/demo/) ausprobieren und mit dem WKO-Rechner vergleichen.


## Installation

```bash
npm install @hundertelf/sv-steuer-rechner
```


## Usage

```js
import calculate from '@hundertelf/sv-steuer-rechner';

const options = {
  year: 2021,
  foundingYear: 2018,
  foundingMonth: 3,
  paidSv: 0
};
const income = 30000;
const outgo = 2000;

const results = calculate(income, outgo, options);
console.log(results); // { est, sv, netto, tipps };
```

---

Made with ♡ in Salzburg.

