import React, { useState } from "react";

import InflationRate from "./InflationRate";
import InvestmentPercentage from "./InvestmentPercentages";
import ProfitMargin from "./ProfitMargin";
import RetireOnYourTerms from "./RetireOnYourTerm";
import { CalculatorEnum, useCalculator } from "./context/calculatorContext";

const Calculator: React.FC = function () {
  const { activeCalculator, setActiveCalculatorState } = useCalculator();

  const titleToEnumMap: Record<string, CalculatorEnum> = {
    "Profit Margin": CalculatorEnum.ProfitMargin,
    "Investment Percentage": CalculatorEnum.InvestmentPercentage,
    "Inflation Rate": CalculatorEnum.Inflation,
    "Retire On Your Terms": CalculatorEnum.RetireOn,
    // Add more mappings if you have more calculators
  };

  const handleButtonClick = (title: string) => {
    setActiveCalculatorState({
      calculator: titleToEnumMap[title] || null,
      stage: 0,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center md:w-[55%] h-full w-full text-white">
      <div className="flex item-center justify-center md:min-h-[29.37rem] w-full bg-[#16161b] rounded-tr-2xl rounded-tl-2xl md:rounded-tr-2xl md:rounded-tl-2xl mb-[0.25rem] md:mb-[1rem]">
        <div
          style={{
            display:
              activeCalculator.calculator === CalculatorEnum.ProfitMargin
                ? "block"
                : "none",
            width: "100%",
          }}
        >
          <ProfitMargin />
        </div>
        <div
          style={{
            display:
              activeCalculator.calculator === CalculatorEnum.Inflation
                ? "block"
                : "none",
            width: "100%",
          }}
        >
          <InflationRate />
        </div>
        <div
          style={{
            display:
              activeCalculator.calculator ===
              CalculatorEnum.InvestmentPercentage
                ? "block"
                : "none",
            width: "100%",
          }}
        >
          <InvestmentPercentage />
        </div>
        <div
          style={{
            display:
              activeCalculator.calculator === CalculatorEnum.RetireOn
                ? "block"
                : "none",
            width: "100%",
          }}
        >
          <RetireOnYourTerms />
        </div>
        {/* Add other calculators here similarly */}
      </div>
      <div className="flex justify-evenly min-h-[2.77rem] md:h-[5rem] text-sm w-full gap-1 md:gap-[3%]">
        {Object.keys(titleToEnumMap).map((title) => (
          <button
            type="button"
            key={title}
            onClick={() => handleButtonClick(title)}
            className={`flex items-center text-[0.65rem]  leading-3 py-[0.65rem] md:py-[1.5rem] font-medium md:text-base md:font-medium justify-center text-center w-full bg-[#16161b] rounded-br-xl rounded-bl-xl ${
              activeCalculator.calculator === titleToEnumMap[title]
                ? "text-[#26D1D4] border-t-2 border-t-[#26D1D4]"
                : "text-white-primary"
            }`}
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
