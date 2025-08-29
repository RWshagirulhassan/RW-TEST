import * as XLSX from "xlsx";

export function calculateFutureValue(
  isSIP: boolean,
  payment: number,
  periods: number,
  ratePercent: number
): number {
  const r = ratePercent / 100;

  if (isSIP) {
    if (r === 0) return payment * periods;
    return payment * (((1 + r) ** periods - 1) / r) * (1 + r);
  }

  return payment * (1 + r) ** periods;
}

export default function getRetirementCorpus(
  annualExpense: number,
  inflationRatePercent: number,
  currentAge: number,
  retirementAge: number,
  lifespan = 85
): number {
  const yearsUntilRetirement = retirementAge - currentAge - 1;
  const yearsInRetirement = lifespan - retirementAge;

  // Expense at retirement (grown with inflation until retirement)
  const expenseAtRetirement = calculateFutureValue(
    false, // lump-sum FV
    annualExpense,
    yearsUntilRetirement,
    inflationRatePercent
  );

  // Total corpus required = PV of all expenses during retirement
  // We model this as an SIP (recurring annual withdrawals) starting at expenseAtRetirement
  const totalCorpus = calculateFutureValue(
    true, // SIP
    expenseAtRetirement,
    yearsInRetirement + 1, // include first year of retirement
    inflationRatePercent
  );

  return Math.round(totalCorpus);
}

// --- Utility: Calculate corpus gap ---
export function getCorpusGap(
  corpusRequired: number,
  assetCategories: Array<{
    title: string;
    Rupees?: number | null;
    Dept?: number | null;
    Equity?: number | null;
    PPF?: number | null;
    EPF?: number | null;
    "Growth Rate"?: number | null;
  }>,
  currentAge: number,
  retirementAge: number,
  lifespan = 85
): number {
  let totalAssetValue = 0;

  assetCategories.forEach((asset) => {
    switch (asset.title) {
      case "Rental Income": {
        // ******** //TODO are we summing up  the annual  income of this category with adjusted growth rate ?

        const rupees = asset.Rupees ?? 0;
        if (rupees > 0) {
          const growthRate = 7;
          const n = lifespan - currentAge; // Calculate until lifespan, not just retirement age
          const fv =
            (rupees * ((1 + growthRate / 100) ** n - 1)) / (growthRate / 100);
          totalAssetValue += fv;
        }
        break;
      }

      case "Business Income":
      case "Others": {
        // ********//TODO are we summing up  the annual  income of this category with adjusted growth rate ?
        const rupees = asset.Rupees ?? 0;
        const growthRate = asset["Growth Rate"] ?? 0;
        if (rupees > 0) {
          const n = lifespan - currentAge; // Calculate until lifespan, not just retirement age
          const fv =
            (rupees * ((1 + growthRate / 100) ** n - 1)) / (growthRate / 100);
          totalAssetValue += fv;
        }
        break;
      }

      case "PPF/EPF": {
        const ppf = asset.PPF ?? 0;
        const epf = asset.EPF ?? 0;

        // Grow PPF and EPF by 7% until retirement age
        const yearsUntilRetirement = retirementAge - currentAge;
        const growthRate = 7 / 100;

        if (ppf > 0) {
          const fvPpf = ppf * (1 + growthRate) ** yearsUntilRetirement;
          totalAssetValue += fvPpf;
        }

        if (epf > 0) {
          const fvEpf = epf * (1 + growthRate) ** yearsUntilRetirement;
          totalAssetValue += fvEpf;
        }
        break;
      }
      // TODO : remove this category
      case "Salary": {
        const salary = asset.Rupees ?? 0;
        const growthRate = 6 / 100;
        const yearsUntilRetirement = retirementAge - currentAge;

        if (salary > 0) {
          // Add the salary every year with growth
          let totalSalary = 0;
          for (let i = 0; i < yearsUntilRetirement; i += 1) {
            totalSalary += salary * (1 + growthRate) ** i;
          }
          totalAssetValue += totalSalary;
        }
        break;
      }

      case "Portfolio": {
        const debt = asset.Dept ?? 0;
        const equity = asset.Equity ?? 0;
        const debtGrowth = 7;
        const equityGrowth = 12;
        const n = lifespan - currentAge;

        if (debt > 0) {
          const fvDebt =
            (debt * ((1 + debtGrowth / 100) ** n - 1)) / (debtGrowth / 100);
          totalAssetValue += fvDebt;
        }
        if (equity > 0) {
          const fvEquity =
            (equity * ((1 + equityGrowth / 100) ** n - 1)) /
            (equityGrowth / 100);
          totalAssetValue += fvEquity;
        }
        break;
      }

      default:
        // No matching asset type
        break;
    }
  });

  const shortfall = corpusRequired - totalAssetValue;
  return Math.round(shortfall > 0 ? shortfall : 0);
}

export interface AssetCategory {
  title: string;
  Rupees?: number | null;
  "Growth Rate"?: number | null;
  PPF?: number | null;
  EPF?: number | null;
  Dept?: number | null;
  Equity?: number | null;
}

export function retirementPlan(
  annualExpense: number,
  inflationRatePercent: number,
  currentAge: number,
  retirementAge: number,
  lifespan: number,
  assetCategories: AssetCategory[],
  download = true,
  annualInvestment = 0,
  allocationPercent: {
    Equity: number | null;
    Debt: number | null;
    Gold: number | null;
  } = {
    Equity: null,
    Debt: null,
    Gold: null,
  }
): {
  data: (string | number)[][];
  surplusOrShortfall: number;
  surplusOrShortfallByCPI: number;
} {
  const rate = inflationRatePercent / 100;
  const cpiRate = 7.7 / 100;
  const totalYears = lifespan - currentAge;

  // Fixed growth rates
  const fixedGrowth: Record<string, number> = {
    "Rental Income": 0.07,
    "Business Income": 0.07,
    Others: 0.07,
    PPF: 0.07,
    EPF: 0.07,
    "Passive Equity": 0.12,
    "Passive Debt": 0.07,
    Equity: 0.12,
    Debt: 0.07,
    Gold: 0.09,
  };

  const formatForDisplay = (value: number) => value.toFixed(2);

  // Header
  const header = [
    "Year",
    "Rental Income",
    "Business Income",
    "Others",
    "PPF Growth",
    "EPF Growth",
    "Passive Equity Growth",
    "Passive Debt Growth",
    "Committed Equity",
    "Committed Debt",
    "Committed Gold",
    "Annual Expense",
    "Expense CPI",
  ];

  // Initialize asset values
  const assetValues: Record<string, number> = {
    "Rental Income": 0,
    "Business Income": 0,
    Others: 0,
    PPF: 0,
    EPF: 0,
    "Passive Equity": 0,
    "Passive Debt": 0,
    Equity: 0,
    Debt: 0,
    Gold: 0,
  };

  // Read input assets and store initial values
  assetCategories.forEach((asset) => {
    if (asset.title === "PPF/EPF") {
      assetValues.PPF = asset.PPF ?? 0;
      assetValues.EPF = asset.EPF ?? 0;
    } else if (asset.title === "Portfolio") {
      assetValues.Debt = asset.Dept ?? 0;
      assetValues.Equity = asset.Equity ?? 0;
      assetValues["Passive Equity"] = asset.Equity ?? 0;
      assetValues["Passive Debt"] = asset.Dept ?? 0;
    } else if (
      asset.title === "Rental Income" ||
      asset.title === "Business Income" ||
      asset.title === "Others"
    ) {
      const key = asset.title === "Others" ? "Others" : asset.title;
      assetValues[key] = asset.Rupees ?? 0;
    }
  });

  // Keep a copy of initial values for totals calculation
  const initialAssetValues = { ...assetValues };

  const data: (string | number)[][] = [header];

  // Initialize totals
  const totals: Record<string, number> = {};
  header.forEach((col) => {
    totals[col] = 0;
  });

  // Initialize passive totals with initial amounts
  totals["PPF Growth"] = initialAssetValues.PPF;
  totals["EPF Growth"] = initialAssetValues.EPF;
  totals["Passive Equity Growth"] = initialAssetValues["Passive Equity"];
  totals["Passive Debt Growth"] = initialAssetValues["Passive Debt"];

  let committedEquity = 0;
  let committedDebt = 0;
  let committedGold = 0;

  let currentAnnualExpense = annualExpense; // grows with personal inflation
  let currentCPIExpense = annualExpense; // grows with fixed 7.7% CPI
  // Initialize current annual investment for SIPs
  let currentAnnualInvestment = annualInvestment;

  for (let i = 0; i <= totalYears; i += 1) {
    const year = currentAge + i;
    const row: (string | number)[] = [];

    row.push(year);

    // Recurring incomes
    ["Rental Income", "Business Income", "Others"].forEach((incomeType) => {
      const base = assetValues[incomeType] ?? 0;
      const growthRate = fixedGrowth[incomeType] ?? 0;
      const incomeThisYear = i === 0 ? base : base * (1 + growthRate) ** i;
      row.push(formatForDisplay(incomeThisYear));
      totals[incomeType] += incomeThisYear;
    });

    // One-time investment assets - growth only
    const ppfGrowth = assetValues.PPF * fixedGrowth.PPF;
    row.push(formatForDisplay(ppfGrowth));
    totals["PPF Growth"] += ppfGrowth;
    assetValues.PPF += ppfGrowth;

    const epfGrowth = assetValues.EPF * fixedGrowth.EPF;
    row.push(formatForDisplay(epfGrowth));
    totals["EPF Growth"] += epfGrowth;
    assetValues.EPF += epfGrowth;

    const passiveEquityGrowth =
      assetValues["Passive Equity"] * fixedGrowth["Passive Equity"];
    row.push(formatForDisplay(passiveEquityGrowth));
    totals["Passive Equity Growth"] += passiveEquityGrowth;
    assetValues["Passive Equity"] += passiveEquityGrowth;

    const passiveDebtGrowth =
      assetValues["Passive Debt"] * fixedGrowth["Passive Debt"];
    row.push(formatForDisplay(passiveDebtGrowth));
    totals["Passive Debt Growth"] += passiveDebtGrowth;
    assetValues["Passive Debt"] += passiveDebtGrowth;

    // Committed SIP investments (updated: annual contribution grows 6% per year)
    let newEq = 0;
    let newDebt = 0;
    let newGold = 0;

    if (year < retirementAge) {
      newEq = (currentAnnualInvestment * (allocationPercent.Equity ?? 0)) / 100;
      newDebt = (currentAnnualInvestment * (allocationPercent.Debt ?? 0)) / 100;
      newGold = (currentAnnualInvestment * (allocationPercent.Gold ?? 0)) / 100;

      committedEquity += newEq;
      committedDebt += newDebt;
      committedGold += newGold;

      // Increase annual investment for next year by 6%
      currentAnnualInvestment *= 1.06;
    }

    const eqGrowth = committedEquity * fixedGrowth.Equity;
    const debtGrowth = committedDebt * fixedGrowth.Debt;
    const goldGrowth = committedGold * fixedGrowth.Gold;

    const committedEquityFlow =
      year < retirementAge ? newEq + eqGrowth : eqGrowth;
    const committedDebtFlow =
      year < retirementAge ? newDebt + debtGrowth : debtGrowth;
    const committedGoldFlow =
      year < retirementAge ? newGold + goldGrowth : goldGrowth;

    row.push(formatForDisplay(committedEquityFlow));
    row.push(formatForDisplay(committedDebtFlow));
    row.push(formatForDisplay(committedGoldFlow));

    committedEquity += eqGrowth;
    committedDebt += debtGrowth;
    committedGold += goldGrowth;

    totals["Committed Equity"] += committedEquityFlow;
    totals["Committed Debt"] += committedDebtFlow;
    totals["Committed Gold"] += committedGoldFlow;

    const expenseThisYear = year >= retirementAge ? currentAnnualExpense : 0;
    const expenseCPI = year >= retirementAge ? currentCPIExpense : 0;

    row.push(formatForDisplay(expenseThisYear)); // personal inflation
    row.push(formatForDisplay(expenseCPI)); // fixed CPI

    totals["Annual Expense"] += expenseThisYear;
    totals["Expense CPI"] += expenseCPI;

    // Inflate for next year
    currentAnnualExpense *= 1 + rate; // personal inflation
    currentCPIExpense *= 1 + cpiRate; // fixed 7.7%
    // ----------------------------

    data.push(row);
  }

  // Totals row
  const totalRow: (string | number)[] = [];
  header.forEach((col) => {
    if (col === "Year") totalRow.push("Total");
    else totalRow.push(formatForDisplay(totals[col] ?? 0));
  });
  data.push(totalRow);

  // Summary rows
  const grossExpense = totals["Annual Expense"];
  const grossExpenseByCPI = totals["Expense CPI"];
  const grossAssets = Object.keys(totals).reduce((acc, key) => {
    if (!["Year", "Annual Expense", "Expense CPI"].includes(key))
      acc += totals[key];
    return acc;
  }, 0);
  const difference = grossAssets - grossExpense;
  const differenceOfCPI = grossAssets - grossExpenseByCPI;

  data.push(["Total Expense", formatForDisplay(grossExpense)]);
  data.push(["Total Income", formatForDisplay(grossAssets)]);
  data.push([
    "Surplus / Shortfall as per personal Inflation Rate",
    formatForDisplay(difference),
  ]);
  data.push(["Surplus / Shortfall (CPI)", formatForDisplay(differenceOfCPI)]);

  // Excel download
  if (download) {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Retirement Plan");
    XLSX.writeFile(workbook, "retirement_plan.xlsx");
  }

  // return data
  return {
    data,
    surplusOrShortfall: Number(formatForDisplay(difference)),
    surplusOrShortfallByCPI: Number(formatForDisplay(differenceOfCPI)),
  };
}
