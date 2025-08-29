import { useEffect, useMemo, useState } from "react";

import { ChevronDown, Info } from "lucide-react";
import TemplateInput from "./components/Input";
import { CalculatorEnum, useCalculator } from "./context/calculatorContext";

import lock from "../../../assets/images/lock.png";
import { formatToIndianRupeesShort } from "../../../utils/indianRupeeFormatting";
import Button from "../../../component/Button";
import RangeSlider from "../../../component/RangeSlider";

// Expected annual returns
const EXPECTED_RETURNS = {
  Equity: 0.12, // 12% CAGR
  Debt: 0.07, // 7% CAGR
  Gold: 0.09, // 9% CAGR
};

/**
 * Calculate SIP required for target corpus
 * Formula: FV = SIP * [((1+r)^n - 1) * (1+r)] / r
 */
function calculateSIPForCorpus(
  targetCorpus: number,
  r: number,
  months: number
) {
  if (r <= 0) return targetCorpus / months;
  const factor = (((1 + r) ** months - 1) * (1 + r)) / r;
  return targetCorpus / factor;
}

export function ReverseSIPCalculator() {
  const { retirementAge, currentAge, finalCorpusRequired, allocationPercent } =
    useCalculator();

  const { totalSIP, equitySIP, debtSIP, goldSIP } = useMemo(() => {
    const years = retirementAge - currentAge;
    const months = years * 12;

    // If already surplus (no shortfall), no SIP needed
    if (finalCorpusRequired && finalCorpusRequired >= 0) {
      return { totalSIP: 0, equitySIP: 0, debtSIP: 0, goldSIP: 0 };
    }

    // Shortfall is negative → convert to positive corpus required
    const corpusRequired = Math.abs(finalCorpusRequired ?? 0);

    // Use provided allocation OR fallback to defaults
    const hasAnyAllocation =
      allocationPercent.Equity ||
      allocationPercent.Debt ||
      allocationPercent.Gold;

    const equityPercent = hasAnyAllocation ? allocationPercent.Equity ?? 0 : 70;
    const debtPercent = hasAnyAllocation ? allocationPercent.Debt ?? 0 : 30;
    const goldPercent = hasAnyAllocation ? allocationPercent.Gold ?? 0 : 0;

    const equityCorpus = (equityPercent / 100) * corpusRequired;
    const debtCorpus = (debtPercent / 100) * corpusRequired;
    const goldCorpus = (goldPercent / 100) * corpusRequired;

    const rEquity = EXPECTED_RETURNS.Equity / 12;
    const rDebt = EXPECTED_RETURNS.Debt / 12;
    const rGold = EXPECTED_RETURNS.Gold / 12;

    let equity = 0;
    let debt = 0;
    let gold = 0;
    if (equityCorpus > 0)
      equity = calculateSIPForCorpus(equityCorpus, rEquity, months);
    if (debtCorpus > 0) debt = calculateSIPForCorpus(debtCorpus, rDebt, months);
    if (goldCorpus > 0) gold = calculateSIPForCorpus(goldCorpus, rGold, months);

    return {
      totalSIP: equity + debt + gold,
      equitySIP: equity,
      debtSIP: debt,
      goldSIP: gold,
    };
  }, [retirementAge, currentAge, finalCorpusRequired, allocationPercent]);

  return (
    <div className="flex w-full h-full flex-col items-center justify-center md:gap-[3rem] gap-5 p-[2rem] md:p-0 md:px-[5.44rem] md:py-[4.25rem]">
      {/* Title + Total SIP */}
      <div className="flex flex-col items-center gap-6 min-h-[200px]">
        <h2 className="text-base font-semibold md:text-lg md:font-semibold md:max-w-[70%] text-center">
          {finalCorpusRequired && finalCorpusRequired >= 0
            ? "You already have sufficient corpus 🎉"
            : "Start a Monthly SIP of"}
        </h2>

        {finalCorpusRequired && finalCorpusRequired < 0 && (
          <div className="flex flex-col md:gap-3 items-center">
            <h1 className="text-4xl font-medium md:text-6xl md:font-semibold">
              ₹ {totalSIP.toFixed(0)}
            </h1>
            <p className="text-white/50 text-xs md:text-base">
              {`To cover shortfall of ${formatToIndianRupeesShort(
                Math.abs(finalCorpusRequired).toString()
              )} in ${retirementAge - currentAge} years`}
            </p>
          </div>
        )}
      </div>

      {/* Equity & Debt & Gold Split */}
      {finalCorpusRequired && finalCorpusRequired < 0 && (
        <div className="flex items-center w-full justify-center divide-x divide-gray-300 text-sm md:text-base">
          {equitySIP > 0 && (
            <div className="px-5">
              <p className="font-semibold">Equity</p>
              <p className="font-light">₹ {equitySIP.toFixed(0)}/ Monthly</p>
            </div>
          )}
          {debtSIP > 0 && (
            <div className="px-5">
              <p className="font-semibold">Debt</p>
              <p className="font-light">₹ {debtSIP.toFixed(0)}/ Monthly</p>
            </div>
          )}
          {goldSIP > 0 && (
            <div className="px-5">
              <p className="font-semibold">Gold</p>
              <p className="font-light">₹ {goldSIP.toFixed(0)}/ Monthly</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ReverseSIPCalculator;

export function TemplateAccordionTwo({
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
  // const { inflationExpenseList, annualExpense } = useCalculator()
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

interface TemplateResultProps {
  heading: string;
  subheading: string;
  comparsionheading: string;
  comparsionvalue: string;
  handleRecalculate: () => void;
  handleNext?: () => void;
}

function TemplateResult({
  heading,
  subheading,
  comparsionheading,
  comparsionvalue,

  handleRecalculate,
  handleNext,
}: TemplateResultProps) {
  return (
    <div className="flex w-full h-full   flex-col items-center justify-center md:gap-[5rem] gap-12  p-[2rem] md:p-0 md:px-[5.44rem] md:py-[4.25rem]">
      <h2 className="text-base font-semibold md:text-lg md:font-semibold md:max-w-[70%] text-center">
        {heading}
      </h2>
      <div className="flex flex-col md:gap-3 items-center">
        <h1 className="text-4xl font-medium  md:text-6xl md:font-semibold ">
          ₹ {subheading}
        </h1>
        <p className="text-white/50 text-xs md:text-base">
          {"(considering your Own Inflation Rate)"}
        </p>
      </div>
      <div className=" flex flex-col w-full gap-4">
        <div className="flex w-full justify-between items-center font-light text-xs md:text-base">
          <p>{comparsionheading}</p>
          <p className="font-medium text-base md:text-lg">
            ₹ {comparsionvalue}
          </p>
        </div>
        <div className="flex justify-between md:gap-8 gap-[1rem]  w-full ">
          <Button
            disabled={false}
            variant="outlined"
            placeholder="Recalculate"
            className="text-xs md:text-base font-medium md:font-semibold md:w-full h-8 md:h-10  "
            onClick={() => {
              handleRecalculate();
            }}
          />

          <Button
            disabled={false}
            placeholder="Next"
            className="text-xs md:text-base font-medium md:font-semibold md:w-full h-8 md:max-h-11 "
            onClick={handleNext}
          />
        </div>
      </div>{" "}
    </div>
  );
}

export default function RetireOnYourTerms() {
  const {
    activeCalculator,
    setActiveCalculatorState,
    annualExpense,
    setAnnualExpense,
    setPersonalinflation,
    personalinflation,
    calculateRetirementCorpus,
    retirementAge,
    retirementCorpusRequired,
    setAssetCategories,
    assetCategories,
    calculateCorpusGap,
    finalCorpusRequired,
    retirementCorpusRequiredByCPI,
    finalCorpusRequiredByCPI,
  } = useCalculator();

  const [input1, setInput1] = useState<string>(
    annualExpense != null ? annualExpense.toString() : ""
  );
  const [input2, setInput2] = useState<string>(
    personalinflation != null ? personalinflation.toString() : ""
  );

  useEffect(() => {
    if (annualExpense != null) setInput1(annualExpense.toString());
    if (personalinflation != null) setInput2(personalinflation.toString());
  }, [annualExpense, personalinflation]);

  // useEffect(() => {
  //   if (retirementCorpusRequired && assetCategories.length > 0) {
  //     calculateCorpusGap()
  //   }
  // }, [retirementCorpusRequired, assetCategories])

  const goToStage = (stage: number) => {
    setActiveCalculatorState({
      calculator: CalculatorEnum.RetireOn,
      stage,
    });
  };

  const handleNext = () => {
    switch (activeCalculator.stage) {
      case 0:
        goToStage(1);
        break;
      case 1:
        if (input1 !== "" && input2 !== "") {
          const expense = parseFloat(input1);
          const inflation = parseFloat(input2);

          setAnnualExpense(expense);
          setPersonalinflation(inflation);
          calculateRetirementCorpus();
        }
        goToStage(2);
        break;
      case 2:
        goToStage(3);
        break;
      case 3:
        goToStage(4);
        break;
      case 4:
        if (finalCorpusRequired != null && finalCorpusRequired < 0) {
          goToStage(5);
        } else {
          goToStage(0);
        }

        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full h-full relative">
      {personalinflation === null && (
        <div>
          <div className="absolute h-full min-w-full backdrop-blur-md rounded-t-2xl z-1000 md:py-[2rem]" />
          <div className="absolute flex w-full h-full flex-col items-center justify-between gap-[1.5rem] md:gap-9 px-[2.735rem] py-[1.063rem] md:px-[8rem] md:py-[4rem] my-auto z-1000">
            <div className="flex flex-col items-center justify-center gap-[0.938rem] md:gap-[0.87rem]">
              <img
                className="w-[40%] aspect-square md:w-fit ml-[8%]"
                alt="lock"
                src={lock}
              />
              <h2 className="text-base text-center md:text-lg font-semibold">
                Unlock Your Retirement Plan
              </h2>
              <p className="text-[0.625rem] md:text-sm font-normal text-center">
                Complete All 3 Calculators to open your retirement planner.
              </p>
            </div>
            <Button
              onClick={() => {
                setActiveCalculatorState({
                  calculator: CalculatorEnum.Inflation,
                  stage: 0,
                });
              }}
              placeholder="Calculate Your Inflation Rate"
              className="text-xs md:text-base font-medium md:font-semibold md:w-full h-8 md:max-h-11"
            />
          </div>
        </div>
      )}

      {activeCalculator.stage === 0 && (
        <div className="flex w-full h-full flex-col items-center justify-center gap-[1.5rem] md:gap-9 px-[2.735rem] py-[1.063rem] md:px-[8rem] md:py-[2rem] my-auto z-0">
          <div className="flex flex-col items-center justify-center gap-[0.938rem] md:gap-[0.87rem]">
            <h2 className="text-base text-center md:text-lg font-semibold">
              Know your Retirement Plan
            </h2>
            <p className="text-[0.625rem] md:text-sm font-normal text-center">
              What is Your Vesting Age ?
            </p>
          </div>
          <RangeSlider />
          <Button
            disabled={false}
            placeholder="Next"
            className="text-xs md:text-base font-medium md:font-semibold md:w-full h-8 md:max-h-11"
            onClick={handleNext}
          />
        </div>
      )}

      {activeCalculator.stage === 1 && (
        <TemplateInput
          heading="Know your Retirement Plan"
          subheading="Here is you Annual Expense and Inflation Rate calculated from previous stages"
          placeholder1="Enter Annual Expenses"
          placeholder2="Enter Inflation Rate"
          input1={input1}
          input2={input2}
          setInput1={setInput1}
          setInput2={setInput2}
          handleNext={handleNext}
        />
      )}

      {activeCalculator.stage === 2 && (
        <TemplateResult
          comparsionheading="Required Corpus as Per  (CPI) :"
          heading={`You Required Corpus at age  ${retirementAge}`}
          subheading={formatToIndianRupeesShort(retirementCorpusRequired)}
          comparsionvalue={formatToIndianRupeesShort(
            retirementCorpusRequiredByCPI
          )}
          handleRecalculate={() => goToStage(0)}
          handleNext={handleNext}
        />
      )}

      {activeCalculator.stage === 3 && (
        <TemplateAccordionTwo
          Componenttitle="Income generating assets"
          setCategories={setAssetCategories}
          Categories={assetCategories}
          handleLogData={() => goToStage(1)}
          handleNext={() => {
            handleNext();
            calculateCorpusGap();
          }}
        />
      )}

      {activeCalculator.stage === 4 && (
        <TemplateResult
          heading={`You Have ${
            Number(finalCorpusRequired) < 0 ? "Shortfall" : "Surplus"
          } of`}
          comparsionheading={`${
            Number(finalCorpusRequiredByCPI) < 0 ? "Shortfall" : "Surplus"
          } as Per  (CPI) :`}
          subheading={formatToIndianRupeesShort(
            Math.abs(Number(finalCorpusRequired)).toString()
          )}
          comparsionvalue={formatToIndianRupeesShort(
            Math.abs(Number(finalCorpusRequiredByCPI)).toString()
          )}
          handleRecalculate={() => goToStage(0)}
          handleNext={() => {
            handleNext();
          }}
        />
      )}
      {activeCalculator.stage === 5 && <ReverseSIPCalculator />}
    </div>
  );
}
