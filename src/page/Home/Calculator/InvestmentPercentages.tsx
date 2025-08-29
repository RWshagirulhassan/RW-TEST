import { useEffect, useState } from "react";
import { ArrowUp, ChevronDown, Info } from "lucide-react";
import TemplateResult from "./components/Result";
import {
  CalculatorEnum,
  Category,
  InvestmentAllocation,
  useCalculator,
} from "./context/calculatorContext";
import { useModal } from "../../../context/model";

import CalculatorPopUp from "./components/CalculatorPopUp";
import Button from "../../../component/Button";

export function TemplateAccordion({
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
    "In Rupees"?: number | null;
    input?: number | null;
    input2?: number | null;
    input3?: number | null;
    input4?: number | null;
  }>;
  setCategories: React.Dispatch<
    React.SetStateAction<
      Array<{
        title: string;
        "In Rupees"?: number | null;
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
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleExpand = (rowTitle: string) => {
    setExpandedRow((prevExpandedRow) =>
      prevExpandedRow === rowTitle ? null : rowTitle
    );
  };

  // const { setAnnualInvestment, setAllocationPercent } = useCalculator()

  const handleInputChange = (
    title: string,
    field: string,
    value: number | null
  ) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.title === title ? { ...category, [field]: value } : category
      )
    );
  };
  const totalValue = Categories.reduce((sum, category) => {
    return (
      sum +
      Object.keys(category).reduce((innerSum, key) => {
        if (key !== "title") {
          const val = category[key as keyof typeof category];
          return (
            innerSum + (val !== null && val !== undefined ? Number(val) : 0)
          );
        }
        return innerSum;
      }, 0)
    );
  }, 0);

  return (
    <div className="flex flex-col justify-center items-center h-full w-full px-[1.5rem] md:px-[9rem] py-[0.5rem] md:py-[1.75rem] gap-5 md:gap-9 ">
      <h2 className="text-base md:text-2xl font-semibold text-center">
        {Componenttitle}
      </h2>
      <div className="h-fit w-full flex flex-col justify-center items-center ">
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
                    {/* <ArrowUp size={20} className='' /> */}
                    {/* {inflationExpenseList.find((item) => item.title === category.title)
                      ? calculatePercentageOutOfTotal(
                         
                        )
                      : '--'} */}
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
        <p className="font-medium text-base md:text-lg">₹ {totalValue}</p>
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

export default function InvestmentPercentage() {
  const {
    setAllocationPercent,
    calculateInvestmentPercentage,
    investmentPercentage,
    resetInvestmentPercentageCalculation,
    setActiveCalculatorState,
    setAnnualInvestment,
    annualSaving,
  } = useCalculator();
  const [investmentList, setInvestmentList] = useState<Category[]>([
    { title: "Equity", "In Rupees": null },
    { title: "Debt", "In Rupees": null },
    { title: "Gold", "In Rupees": null },
  ]);

  const [activeScreen, setActiveScreen] = useState<string>("step1");
  const [shouldCalculate, setShouldCalculate] = useState(false);
  const { showModal, hideModal } = useModal();

  const handleNext = () => {
    if (activeScreen === "step1") {
      // 1️⃣ Calculate total investment
      const totalInvestment = investmentList.reduce(
        (sum, category) => sum + (category["In Rupees"] ?? 0),
        0
      );
      setAnnualInvestment(totalInvestment);

      if (annualSaving && totalInvestment > annualSaving) {
        showModal(
          <CalculatorPopUp
            title="Your annual investment is more than your annual saving."
            firstAction="Edit Your Saving"
            onFirstAction={() => {
              hideModal();

              setActiveCalculatorState({
                calculator: CalculatorEnum.ProfitMargin,
                stage: 0,
              });
            }}
            secondAction="Edit Your Investment"
            onSecondAction={() => {
              hideModal();
            }}
          />
        );
        // 2️⃣ Update annualInvestment in context
      } else {
        calculateInvestmentPercentage();

        // 3️⃣ Calculate allocation percentages
        const allocationData: InvestmentAllocation = {
          Equity:
            ((investmentList.find((c) => c.title === "Equity")?.["In Rupees"] ??
              0) /
              totalInvestment) *
            100,
          Debt:
            ((investmentList.find((c) => c.title === "Debt")?.["In Rupees"] ??
              0) /
              totalInvestment) *
            100,
          Gold:
            ((investmentList.find((c) => c.title === "Gold")?.["In Rupees"] ??
              0) /
              totalInvestment) *
            100,
        };

        // 4️⃣ Update allocationPercent in context
        setAllocationPercent(allocationData);

        // 5️⃣ Move to next step
        setActiveScreen("step2");
        setActiveCalculatorState({
          calculator: CalculatorEnum.InvestmentPercentage,
          stage: 1,
        });
      }
    }
  };

  // useEffect(() => {
  //   if (shouldCalculate) {
  //     calculateInvestmentPercentage()
  //     setShouldCalculate(false)
  //   }
  // }, [shouldCalculate])
  useEffect(() => {
    const totalInvestment = investmentList.reduce(
      (sum, cat) => sum + (cat["In Rupees"] ?? 0),
      0
    );
    setAnnualInvestment(totalInvestment);

    if (totalInvestment > 0) {
      const allocationData: InvestmentAllocation = {
        Equity:
          ((investmentList.find((c) => c.title === "Equity")?.["In Rupees"] ??
            0) /
            totalInvestment) *
          100,
        Debt:
          ((investmentList.find((c) => c.title === "Debt")?.["In Rupees"] ??
            0) /
            totalInvestment) *
          100,
        Gold:
          ((investmentList.find((c) => c.title === "Gold")?.["In Rupees"] ??
            0) /
            totalInvestment) *
          100,
      };
      setAllocationPercent(allocationData);
    }
  }, [investmentList, setAnnualInvestment, setAllocationPercent]);

  useEffect(() => {
    if (investmentPercentage !== null && activeScreen === "step1") {
      setActiveScreen("step2");
      setActiveCalculatorState({
        calculator: CalculatorEnum.InvestmentPercentage,
        stage: 1,
      });
    } else if (investmentPercentage === null && activeScreen === "step2") {
      setActiveScreen("step1");
      setActiveCalculatorState({
        calculator: CalculatorEnum.InvestmentPercentage,
        stage: 0,
      });
    }
  }, [investmentPercentage]);

  const handleRecalculate = () => {
    // resetInvestmentPercentageCalculation()

    setActiveScreen("step1");
    setActiveCalculatorState({
      calculator: CalculatorEnum.InvestmentPercentage,
      stage: 0,
    });
  };

  return (
    <div className="h-full w-full">
      {activeScreen === "step1" && (
        <TemplateAccordion
          TotalTitle="Total Investment per year :"
          setCategories={setInvestmentList}
          Componenttitle="Investment Percentage"
          Categories={investmentList}
          handleLogData={() => {}}
          handleNext={handleNext}
        />
      )}
      {activeScreen === "step2" && (
        <TemplateResult
          heading="Your Investment Percentage is"
          subheading={`${
            investmentPercentage !== null ? `${investmentPercentage} %` : "N/A"
          }`}
          handleRecalculate={handleRecalculate}
          handleNext={() => {
            // setActiveCalculator('Retire on your terms') // Navigate to the next calculator
            setActiveCalculatorState({
              calculator: CalculatorEnum.Inflation,
              stage: 0,
            });
          }}
        />
      )}
      {/* Add more cases for additional steps as needed */}
    </div>
  );
}
