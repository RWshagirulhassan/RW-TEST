import React, { useState, useMemo } from "react";
import { ArrowUp, ChevronDown, Info } from "lucide-react";
import { DEFAULT_INFLATION, useCalculator } from "../context/calculatorContext";
import Button from "../../../../component/Button";

export default function TemplateAccordion({
  Componenttitle,
  TotalTitle,
  Categories,
  setCategories,
  handleLogData,
  handleNext,
}: {
  Componenttitle: string;
  TotalTitle?: string;
  Categories: Array<{
    title: string;
    input?: number | null;
    input2?: number | null;
    input3?: number | null;
    input4?: number | null;
  }>;
  setCategories: React.Dispatch<
    React.SetStateAction<
      Array<{
        title: string;
        input?: number | null;
        input2?: number | null;
        input3?: number | null;
        input4?: number | null;
      }>
    >
  >;
  handleLogData: () => void;
  handleNext: () => void;
}) {
  const { inflationExpenseList, annualExpense } = useCalculator();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleExpand = (rowTitle: string) => {
    setExpandedRow((prevExpandedRow) =>
      prevExpandedRow === rowTitle ? null : rowTitle
    );
  };

  const handleInputChange = (
    title: string,
    field: string,
    value: number | null
  ) => {
    setCategories((prevCategories) => {
      const updatedCategories = prevCategories.map((category) =>
        category.title === title ? { ...category, [field]: value } : category
      );
      return updatedCategories;
    });
  };

  // ✅ Compute total once using useMemo so it stays stable during renders
  const totalThisYearExpense = useMemo(() => {
    return inflationExpenseList.reduce((sum, cat) => {
      return sum + (cat["this year"] ?? 0);
    }, 0);
  }, [inflationExpenseList]);
  const calculateInflationForCategory = (category: {
    title: string;
    "last year"?: number | null;
    "this year"?: number | null;
  }) => {
    const lastYearPrice = category["last year"];
    const thisYearPrice = category["this year"];

    if (thisYearPrice == null) {
      return "--";
    }

    let weightForCategory: number;
    if (annualExpense && annualExpense > 0) {
      if (annualExpense > totalThisYearExpense) {
        weightForCategory = thisYearPrice / annualExpense;
      } else {
        weightForCategory = thisYearPrice / totalThisYearExpense;
      }
    } else {
      weightForCategory = thisYearPrice / totalThisYearExpense;
    }

    // Case 2: Missing this year price → default inflation
    if (lastYearPrice == null) {
      const defaultInflation = DEFAULT_INFLATION[category.title];
      if (defaultInflation != null) {
        // const weightedInflation = weightForCategory * (defaultInflation * 100)
        const weightedInflation = defaultInflation * 100;

        return weightedInflation.toFixed(2);
      }
      return "--";
    }

    // Case 3: Both prices present → calculate inflation
    // const inflationRate = ((thisYearPrice - lastYearPrice) / lastYearPrice) * 100
    // const weightedInflation = weightForCategory * inflationRate
    // return weightedInflation.toFixed(2)
    const inflationRate =
      ((thisYearPrice - lastYearPrice) / lastYearPrice) * 100;
    // const weightedInflation = weightForCategory * inflationRate
    return inflationRate.toFixed(2);
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full px-[1.5rem] md:px-[9rem] py-[0.5rem] md:py-[1.75rem] gap-5 md:gap-9 ">
      <h2 className="text-base md:text-2xl font-semibold text-center">
        {Componenttitle}
      </h2>
      <div className="h-full w-full flex flex-col justify-center items-center ">
        {Categories.map((category, index) => (
          <div
            key={category.title}
            className={`relative w-full border-solid border-[1px] border-[#CECECE] md:border-[#ffffff] border-opacity-70 p-2 px-4  ${
              index === 0 && "rounded-tr-xl rounded-tl-xl"
            }  ${
              index === Categories.length - 1 && "rounded-br-xl rounded-bl-xl"
            }`}
          >
            <button
              type="button"
              onClick={() => handleExpand(category.title)}
              className="flex items-center justify-between cursor-pointer w-full"
            >
              <div className="text-[0.73rem] md:text-base  font-semibold md:p-[0.12rem] flex gap-2  items-center">
                {category.title}{" "}
                {expandedRow === category.title && <Info size={20} />}
                {expandedRow === category.title && (
                  <p className="pl-2 flex items-center text-[#26D1D4]">
                    <ArrowUp size={20} className="" />
                    {inflationExpenseList.find(
                      (item) => item.title === category.title
                    )
                      ? calculateInflationForCategory(
                          inflationExpenseList.find(
                            (item) => item.title === category.title
                          )!
                        )
                      : "--"}
                  </p>
                )}
              </div>
              <ChevronDown
                className={`transition-transform duration-300 ${
                  expandedRow === category.title ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedRow === category.title && (
              <div className="flex w-full text-white pt-2 md:p-[0.25rem]   gap-2">
                {Object.keys(category).map((key) => {
                  if (
                    key !== "title" &&
                    category[key as keyof typeof category] !== undefined
                  ) {
                    const value = category[key as keyof typeof category];
                    return (
                      <input
                        key={key}
                        placeholder={key}
                        className="bg-[#16161b] min-h-[32px] md:min-h-[44px] max-w-[50%] px-4 py-2 text-sm  font-medium md:font-normal md:rounded-[0.625rem] w-full rounded-md text-white outline-none border-solid border-[1px] border-[#CECECE] md:border-[#ffffff] border-opacity-70"
                        type="number"
                        value={value === null ? "" : String(value)}
                        onChange={(e) =>
                          handleInputChange(
                            category.title,
                            key,
                            e.target.value !== "" ? +e.target.value : null
                          )
                        }
                      />
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex w-full justify-between items-center font-light text-xs md:text-base md:-my-3 -my-2">
        <p>{!TotalTitle ? "Total of all category" : TotalTitle}</p>
        <p className="font-medium text-base md:text-lg">
          ₹ {totalThisYearExpense}
        </p>
      </div>
      <Button
        disabled={false}
        placeholder="Next"
        className="text-xs  md:text-base font-medium md:font-semibold md:w-full mb-3 md:mb-0 h-8 md:max-h-11 "
        onClick={() => {
          handleLogData();
          handleNext();
        }}
      />
    </div>
  );
}
