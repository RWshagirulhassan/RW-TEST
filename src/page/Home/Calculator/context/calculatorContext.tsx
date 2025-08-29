import React, { createContext, useContext, useMemo, useState } from "react";
import { useModal } from "../../../../context/model";
import CalculatorPopUp from "../components/CalculatorPopUp";
import getRetirementCorpus, { retirementPlan } from "./utils";

export enum CalculatorEnum {
  ProfitMargin = "Profit margin",
  Inflation = "Inflation Rate",
  InvestmentPercentage = "Investment Percentage",
  RetireOn = "Retire on your terms",
}

export type ActiveCalculatorState = {
  calculator: CalculatorEnum;
  stage: number;
};
export interface InvestmentAllocation {
  Equity: number | null;
  Debt: number | null;
  Gold: number | null;
  // You can add more categories later if needed
}
export type Category = {
  title: string;
  "last year"?: number | null;
  "this year"?: number | null;
  "In Rupees"?: number | null;
  input4?: number | null;
};
type AssetCategory = {
  title: string;
  Rupees?: number | null;
  Dept?: number | null;
  Equity?: number | null;
  PPF?: number | null;
  EPF?: number | null;
  "Growth Rate"?: number | null;
};
type CalculatorContextType = {
  activeCalculator: ActiveCalculatorState;
  annualIncome: number | null;
  annualExpense: number | null;
  profitMargin: number | null;
  annualSaving: number | null;
  annualInvestment: number | null;
  investmentPercentage: number | null;
  currentAge: number;
  retirementAge: number;
  inflationExpenseList: Category[];
  personalinflation: number | null;
  retirementCorpusRequired: string;
  finalCorpusRequired: number | null;
  retirementCorpusRequiredByCPI: string;
  finalCorpusRequiredByCPI: number | null;
  allocationPercent: InvestmentAllocation; // <--- add this to context

  assetCategories: AssetCategory[];
  othersEdited: boolean;

  setActiveCalculatorState: (state: ActiveCalculatorState) => void;
  setAnnualIncome: (value: number) => void;
  setAnnualExpense: (value: number) => void;
  setAnnualSaving: (value: number) => void;
  setAnnualInvestment: (value: number) => void;
  setCurrentAge: (value: number) => void;
  setRetirementAge: (value: number) => void;
  setInflationExpenseList: React.Dispatch<React.SetStateAction<Category[]>>;
  setPersonalinflation: React.Dispatch<React.SetStateAction<number | null>>;
  calculateProfitMargin: () => void;
  calculateInflationRate: () => void;
  calculateInvestmentPercentage: () => void;
  calculateRetirementCorpus: () => void;
  calculateCorpusGap: () => void;
  setAssetCategories: React.Dispatch<React.SetStateAction<AssetCategory[]>>;
  setOthersEdited: (value: boolean) => void;
  resetProfitMarginCalculation: () => void;
  resetPersonalInflationCalculation: () => void;
  resetInvestmentPercentageCalculation: () => void;
  setAllocationPercent: React.Dispatch<
    React.SetStateAction<InvestmentAllocation>
  >;
};

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
);

export const DEFAULT_INFLATION: Record<string, number> = {
  "Rental Expenses": 0.07,
  "Traveling Expenses": 0.05,
  "Fixed Medical Expenses": 0.1,
  "Educational Expenses": 0.08,
  "Household Expenses": 0.12,
  Others: 0.07,
};

export function CalculatorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeCalculator, setActiveCalculatorState] =
    useState<ActiveCalculatorState>({
      calculator: CalculatorEnum.ProfitMargin,
      stage: 0,
    });
  const [annualIncome, setAnnualIncome] = useState<number | null>(null);
  const [annualExpense, setAnnualExpense] = useState<number | null>(null);
  const [profitMargin, setProfitMargin] = useState<number | null>(null);
  const [personalinflation, setPersonalinflation] = useState<number | null>(
    null
  );
  const [annualSaving, setAnnualSaving] = useState<number | null>(null);
  const [annualInvestment, setAnnualInvestment] = useState<number | null>(null);

  const [allocationPercent, setAllocationPercent] =
    useState<InvestmentAllocation>({
      Equity: null,
      Debt: null,
      Gold: null,
    });
  const [investmentPercentage, setInvestmentPercentage] = useState<
    number | null
  >(null);
  const [currentAge, setCurrentAge] = useState<number>(24);
  const [retirementAge, setRetirementAge] = useState<number>(42);
  const [retirementCorpusRequired, setRetirementCorpusRequired] =
    useState<string>("");
  const [retirementCorpusRequiredByCPI, setRetirementCorpusRequiredByCPI] =
    useState<string>("");
  const [finalCorpusRequired, setFinalCorpusRequired] = useState<number | null>(
    null
  );
  const [finalCorpusRequiredByCPI, setFinalCorpusRequiredByCPI] = useState<
    number | null
  >(null);
  const [othersEdited, setOthersEdited] = useState(false);

  const { showModal, hideModal } = useModal();

  const [inflationExpenseList, setInflationExpenseList] = useState<Category[]>([
    { title: "Rental Expenses", "last year": null, "this year": null },
    { title: "Traveling Expenses", "last year": null, "this year": null },
    { title: "Fixed Medical Expenses", "last year": null, "this year": null },
    { title: "Educational Expenses", "last year": null, "this year": null },
    { title: "Household Expenses", "last year": null, "this year": null },
    { title: "Others", "last year": null, "this year": null },
  ]);

  const [assetCategories, setAssetCategories] = useState<AssetCategory[]>([
    { title: "Rental Income", Rupees: null },
    { title: "PPF/EPF", PPF: null, EPF: null },
    { title: "Portfolio", Dept: null, Equity: null },
    { title: "Business Income", Rupees: null, "Growth Rate": null },
    { title: "Others", Rupees: null, "Growth Rate": null },
  ]);

  // Helper to update annualExpense and immediately recalc derived values using the new expense
  const updateAnnualExpenseAndRecalc = (newExpense: number) => {
    setAnnualExpense(newExpense);
    if (annualIncome != null) {
      const savings = annualIncome - newExpense;
      if (savings < 0) {
        setAnnualSaving(0);
      } else setAnnualSaving(savings);

      setProfitMargin(+((savings / annualIncome) * 100).toFixed(2));
    } else {
      // no income -> clear derived values
      setAnnualSaving(null);
      setProfitMargin(null);
    }
  };

  const calculateProfitMargin = () => {
    if (annualIncome != null && annualExpense != null) {
      const savings = annualIncome - annualExpense;
      if (savings < 0) {
        setAnnualSaving(0);
      } else setAnnualSaving(savings);

      setProfitMargin(+((savings / annualIncome) * 100).toFixed(2));

      // Check if personal inflation is set before updating profit margin
      if (personalinflation !== null || investmentPercentage !== null) {
        showModal(
          <CalculatorPopUp
            firstAction="Cancel"
            title="Editing Annual Expenses means you’ll need to recalculate your Investment Percentage and Inflation Rate."
            onFirstAction={() => {
              hideModal(); // Close the modal if the user doesn't want to reset the inflation
            }}
            onSecondAction={() => {
              // Reset both personal inflation and inflation expense list when user clicks 'OK'
              setPersonalinflation(null);
              setInflationExpenseList([
                {
                  title: "Rental Expenses",
                  "last year": null,
                  "this year": null,
                },
                {
                  title: "Traveling Expenses",
                  "last year": null,
                  "this year": null,
                },
                {
                  title: "Fixed Medical Expenses",
                  "last year": null,
                  "this year": null,
                },
                {
                  title: "Educational Expenses",
                  "last year": null,
                  "this year": null,
                },
                {
                  title: "Household Expenses",
                  "last year": null,
                  "this year": null,
                },
                { title: "Others", "last year": null, "this year": null },
              ]);
              setInvestmentPercentage(null);
              hideModal(); // Close the modal after resetting
            }}
          />
        );
      }
    }
  };

  // ---------- helper that performs calculation using a provided list ----------
  const calculateInflationRateWithList = (list: Category[]) => {
    let weightedInflationSum = 0;
    let totalWeight = 0;
    let totalThisYearExpense = 0;

    // total this year expense (from the list passed). Ignore categories where this year is null.
    list.forEach((category) => {
      const now = category["this year"];
      if (now != null) totalThisYearExpense += now;
    });

    // If totalThisYearExpense is 0 we cannot derive weights; fallback to null inflation
    if (totalThisYearExpense <= 0) {
      setPersonalinflation(null);
      return;
    }

    // Process each category to calculate weighted inflation using 'this year' as weight base
    list.forEach((category) => {
      const last = category["last year"];
      const now = category["this year"];

      // If this year is missing — per new requirement -> ignore this category entirely
      if (now == null) return;

      // If last year is missing but this year exists -> use fallback inflation with weight = now / totalThisYearExpense
      if (last == null) {
        const fallbackInflation =
          DEFAULT_INFLATION[category.title] ?? DEFAULT_INFLATION.Others;
        const weight = now / totalThisYearExpense;
        weightedInflationSum += weight * (fallbackInflation * 100); // convert fallback decimal to percent
        totalWeight += weight;
        return;
      }

      // Both present -> compute inflation and weight by this year
      const weight = now / totalThisYearExpense;
      const inflation = ((now - last) / last) * 100;
      weightedInflationSum += weight * inflation;
      totalWeight += weight;
    });

    if (totalWeight > 0) {
      setPersonalinflation(+weightedInflationSum.toFixed(2));
    } else {
      setPersonalinflation(null);
    }
  };

  // ---------- main calculateInflationRate that triggers popup if we need to fill "Others" ----------
  const calculateInflationRate = () => {
    // Build current total this year sum
    let totalThisYearExpense = 0;
    let othersValue: number | null = null;

    inflationExpenseList.forEach((category) => {
      if (category["this year"] != null)
        totalThisYearExpense += category["this year"]!;
      if (category.title === "Others") {
        // normalise undefined -> null
        othersValue =
          category["this year"] !== undefined ? category["this year"] : null;
      }
    });

    // If annualExpense is null *and* we have this-year input -> adopt this-year total as annualExpense
    if (annualExpense == null) {
      if (totalThisYearExpense > 0) {
        // set and recalc derived values immediately
        updateAnnualExpenseAndRecalc(totalThisYearExpense);
      }
      // continue with inflation calculation using the provided list (no modal)
      calculateInflationRateWithList(inflationExpenseList);
      return;
    }

    const othersNotFilled =
      (!othersValue || othersValue === 0) && !othersEdited;

    // Case 1: Others not filled, totalThisYearExpense < annualExpense
    // -> offer to auto-fill Others (this year) with the gap so totals match profit margin
    if (othersNotFilled && totalThisYearExpense < annualExpense) {
      const gap = annualExpense - totalThisYearExpense;
      showModal(
        <CalculatorPopUp
          title={
            "Adjusted “Other Expenses” to match the total expenses you entered in Profit Margin—keeps everything consistent."
          }
          onFirstAction={() => {
            // "Edit Yourself" — close modal and let the user edit the expense list manually
            hideModal();
          }}
          onSecondAction={() => {
            // "Fill & Continue": create updated list (add remaining to Others.this year) and continue calculation
            const updatedList = inflationExpenseList.map((cat) =>
              cat.title === "Others"
                ? { ...cat, "this year": (cat["this year"] ?? 0) + gap }
                : cat
            );

            // update state and run calculation using the updated list immediately
            setInflationExpenseList(updatedList);
            hideModal();

            // Run calculation using updated list (use the list variable to avoid setState timing issues)
            calculateInflationRateWithList(updatedList);
          }}
        />
      );

      // exit now — we'll continue when user confirms
      return;
    }

    // Case 2: Others filled (or user edited), totalThisYearExpense < annualExpense
    // -> prompt to update annualExpense to the new totalThisYearExpense
    if (!othersNotFilled && totalThisYearExpense < annualExpense) {
      showModal(
        <CalculatorPopUp
          title={
            "These current annual expenses are not matching with the total annual expenses you mentioned in profit margin. By continuing here will update your Annual Expenses."
          }
          onFirstAction={() => {
            hideModal();
          }}
          onSecondAction={() => {
            updateAnnualExpenseAndRecalc(totalThisYearExpense);
            hideModal();
          }}
        />
      );
      return;
    }

    // Case 3: totalThisYearExpense > annualExpense (regardless of others)
    // -> prompt to update annualExpense to the new totalThisYearExpense
    if (totalThisYearExpense > annualExpense) {
      showModal(
        <CalculatorPopUp
          title={
            "These current annual expenses are not matching with the total annual expenses you mentioned in profit margin. By continuing here will update your Annual Expenses."
          }
          onFirstAction={() => {
            hideModal();
          }}
          onSecondAction={() => {
            updateAnnualExpenseAndRecalc(totalThisYearExpense);
            hideModal();
          }}
        />
      );
      return;
    }

    // No mismatch -> just compute inflation
    calculateInflationRateWithList(inflationExpenseList);
  };

  const calculateInvestmentPercentage = () => {
    if (annualSaving != null && annualInvestment != null) {
      setInvestmentPercentage(
        +((annualInvestment / annualSaving) * 100).toFixed(2)
      );
    }
  };
  // const calculateInvestmentPercentage = () => {
  //   if (annualSaving != null && annualInvestment != null) {
  //     // Calculate % as before

  //     // 🔔 Show popup if annualInvestment > annualSaving
  //     if (annualInvestment > annualSaving) {
  // showModal(
  //   <CalculatorPopUp
  //     title='Your annual investment is more than your annual saving.'
  //     firstAction='Edit Your Saving'
  //     onFirstAction={() => {
  //       hideModal()

  //       setActiveCalculatorState({
  //         calculator: CalculatorEnum.ProfitMargin,
  //         stage: 0,
  //       })
  //     }}
  //     secondAction='Edit Your Investment'
  //     onSecondAction={() => {
  //       hideModal()
  //     }}
  //   />,
  // )
  //     } else {
  //       const percentage = +((annualInvestment / annualSaving) * 100).toFixed(2)
  //       setInvestmentPercentage(percentage)
  //       setActiveCalculatorState({
  //         calculator: CalculatorEnum.InvestmentPercentage,
  //         stage: 1,
  //       })
  //     }
  //   }
  // }

  function calculateRetirementCorpus(inflationRate?: number) {
    if (
      annualExpense == null ||
      (inflationRate ?? personalinflation) == null ||
      currentAge == null ||
      retirementAge == null
    ) {
      return;
    }

    const corpus = getRetirementCorpus(
      annualExpense,
      inflationRate ?? personalinflation!, // allow passing CPI
      currentAge,
      retirementAge
    );
    const corpusByCPI = getRetirementCorpus(
      annualExpense,
      7.7, // allow passing CPI
      currentAge,
      retirementAge
    );

    setRetirementCorpusRequired(corpus.toString());
    setRetirementCorpusRequiredByCPI(corpusByCPI.toString());
  }

  function calculateCorpusGap() {
    const result = retirementPlan(
      annualExpense ?? 0, // Fallback to 0 if annualExpense is null
      personalinflation ?? 0, // Fallback to 0 if personalinflation is null
      currentAge,
      retirementAge,
      85,
      assetCategories,
      true,
      annualInvestment ?? 0,
      allocationPercent
    );
    console.log("result calculateCorpusGap", result);

    setFinalCorpusRequired(result.surplusOrShortfall);
    setFinalCorpusRequiredByCPI(result.surplusOrShortfallByCPI);
  }

  const resetProfitMarginCalculation = () => {
    setProfitMargin(null);
  };
  const resetInvestmentPercentageCalculation = () => {
    setAnnualInvestment(null);
    setInvestmentPercentage(null);
  };

  const resetPersonalInflationCalculation = () => {
    setPersonalinflation(null);
  };

  const value = useMemo(
    () => ({
      activeCalculator,
      annualIncome,
      annualExpense,
      profitMargin,
      annualSaving,
      annualInvestment,
      investmentPercentage,
      currentAge,
      retirementAge,
      inflationExpenseList,
      personalinflation,
      retirementCorpusRequired,
      finalCorpusRequired,
      retirementCorpusRequiredByCPI,
      finalCorpusRequiredByCPI,
      assetCategories,
      othersEdited,
      allocationPercent,

      setActiveCalculatorState,
      setAnnualIncome,
      setAnnualExpense,
      setAnnualSaving,
      setAnnualInvestment,
      setCurrentAge,
      setRetirementAge,
      setInflationExpenseList,
      calculateProfitMargin,
      calculateInflationRate,
      setPersonalinflation,
      calculateInvestmentPercentage,
      calculateRetirementCorpus,
      calculateCorpusGap,
      setAssetCategories,
      setOthersEdited,
      resetProfitMarginCalculation,
      resetPersonalInflationCalculation,
      resetInvestmentPercentageCalculation,
      setAllocationPercent,
    }),
    [
      activeCalculator,
      annualIncome,
      annualExpense,
      profitMargin,
      annualSaving,
      annualInvestment,
      investmentPercentage,
      currentAge,
      retirementAge,
      inflationExpenseList,
      personalinflation,
      retirementCorpusRequired,
      finalCorpusRequired,
      retirementCorpusRequiredByCPI,
      finalCorpusRequiredByCPI,
      assetCategories,
      othersEdited,
      allocationPercent,
    ]
  );

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
};
