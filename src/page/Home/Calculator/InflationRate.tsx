import { useEffect, useState } from "react";
import TemplateAccordion from "./components/Accordion";
import { CalculatorEnum, useCalculator } from "./context/calculatorContext";
import { useModal } from "../../../context/model";
import Button from "../../../component/Button";

interface TemplateResultProps {
  heading: string;
  subheading: string;
  handleRecalculate: () => void;
  handleNext?: () => void;
}

function TemplateResult({
  heading,
  subheading,
  handleRecalculate,
  handleNext,
}: TemplateResultProps) {
  return (
    <div className="flex w-full h-full   flex-col items-center justify-between md:gap-[5rem] gap-12  p-[2rem] md:p-0 md:px-[5.44rem] md:py-[4.25rem]">
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-base font-semibold md:text-lg md:font-semibold ">
          {heading}
        </h2>
        <h1 className="text-4xl font-medium  md:text-6xl md:font-semibold ">
          {subheading}
        </h1>
      </div>
      <div className="flex flex-col w-full gap-6 items-center">
        <p className="text-white/50 text-sm md:text-lg">
          {"Consumer Price Index (CPI) : 7.7 %"}
        </p>
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
      </div>
    </div>
  );
}

export default function InflationRate() {
  const {
    inflationExpenseList,
    setInflationExpenseList,
    calculateInflationRate,
    personalinflation,
    resetPersonalInflationCalculation,
    setActiveCalculatorState,
  } = useCalculator();

  const { isModalOpen } = useModal(); // <-- assuming your modal context exposes this

  const [shouldCalculate, setShouldCalculate] = useState(false);
  const [activeScreen, setActiveScreen] = useState<"step1" | "step2">("step1");
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (shouldCalculate) {
      setIsCalculating(true);
      (async () => {
        await calculateInflationRate();
        setShouldCalculate(false);
      })();
    }
  }, [shouldCalculate]);

  useEffect(() => {
    if (personalinflation !== null) {
      setIsCalculating(false);
      setActiveScreen("step2");
    }
  }, [personalinflation]);

  // 🛠 Reset calculation state when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setIsCalculating(false);
      setShouldCalculate(false);
      resetPersonalInflationCalculation();
      setActiveScreen("step1");
    }
  }, [isModalOpen]);

  const handleLogData = () => {};

  const handleRecalculate = () => {
    resetPersonalInflationCalculation();
    setActiveScreen("step1");
  };

  const handleNext = () => {
    setShouldCalculate(true);
  };

  if (isCalculating) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl animate-pulse">Calculating...</p>
      </div>
    );
  }

  return activeScreen === "step1" ? (
    <TemplateAccordion
      TotalTitle="Total Expenses this year :"
      setCategories={setInflationExpenseList}
      Componenttitle="Inflation Rate"
      Categories={inflationExpenseList}
      handleLogData={handleLogData}
      handleNext={handleNext}
    />
  ) : (
    <TemplateResult
      heading="Your Current Inflation Rate is"
      handleRecalculate={handleRecalculate}
      subheading={`${
        personalinflation !== null ? `${personalinflation} %` : "N/A"
      }`}
      handleNext={() => {
        setActiveCalculatorState({
          calculator: CalculatorEnum.RetireOn,
          stage: 0,
        }); // Navigate to the next calculator
      }}
    />
  );
}
