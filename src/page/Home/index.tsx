import { useEffect, useState } from "react";
import { CircleCheck } from "lucide-react";

import Calculator from "./Calculator";
// import InvestmentIdeas from "./InvestmentIdeas";
// import Pilar from "./Pilar";
// import ReviewMutualFund from "./ReviewMutualFund";
import TaskList from "./TaskList";
import { useCalculator } from "./Calculator/context/calculatorContext";

export default function Home() {
  const {
    personalinflation,
    annualExpense,
    annualSaving,
    investmentPercentage,
  } = useCalculator();

  const [summaryData, setSummaryData] = useState([
    { name: "Annual Expense", value: "--" },
    { name: "Inflation Rate", value: "--" },
    { name: "Annual Saving", value: "--" },
    { name: "Investment on Saving", value: "--" },
  ]);

  useEffect(() => {
    const updatedData = [
      {
        name: "Annual Expense",
        value: annualExpense !== null ? `${annualExpense}` : "--",
      },
      {
        name: "Inflation Rate",
        value: personalinflation !== null ? `${personalinflation} %` : "--",
      },
      {
        name: "Annual Saving",
        value: annualSaving !== null ? `${annualSaving}` : "--",
      },
      {
        name: "Investment on Saving",
        value:
          investmentPercentage !== null ? ` ${investmentPercentage} %` : "--",
      },
    ];
    setSummaryData(updatedData);
  }, [personalinflation, annualExpense, annualSaving, investmentPercentage]);

  return (
    <div className="min-h-screen h-full  w-full  mx-auto  bg-black-primary flex text-white flex-col px-[5vw]">
      {/* <SwipableCarousel
        enableIndicator={false}
        slides={[
          'Discovering your Profit Margin can supercharge your budgeting skills!',
          'Discovering your Profit Margin can supercharge your budgeting skills!',
        ].map((text) => {
          return (
            <div className='w-full min-h-24 md:min-h-[8.313rem] bg-[#407BFF] bg-opacity-25  rounded-2xl my-5 md:mx-auto md:max-w-[1050px] flex justify-center items-center gap-[10%] md:gap-[5%]  p-3'>
              {' '}
              <img src='/RWlogo.png' alt='logo' className='aspect-ratio: 16/9 w-[3rem] md:w-[4rem]' />
              <text className='text-white text-sm font-normal md:text-xl md:font-medium'>{text}</text>
            </div>
          )
        })}
      /> */}
      <div className="flex flex-col md:hidden justify-center w-full  h-full  md:gap-5 md:mx-auto md:max-w-[1050px] mb-4">
        <text className="text-xs font-normal text-[#C4C4C4] mb-1">
          <span className="font-semibold"></span> reload to reset
        </text>
        {/* <ProgressIndicator
          total={4}
          filled={1}
          ActiveColor="bg-[#A0B5E4]"
          InactiveColor="bg-[#404040]"
          height="h-3"
        /> */}
      </div>
      <div className="flex flex-wrap w-full my-5  gap-3 mx-auto items-center justify-center md:mx-auto md:max-w-[1050px]">
        {summaryData.map((item, index) => (
          <div
            onClick={() => {
              console.log("Summary item clicked:", annualExpense);
            }}
            key={index}
            className="w-full text-xs max-w-[48%] flex flex-col items-start justify-between px-2 py-[9px] border-[1px] border-[#4C4C4C4D] bg-[#181C2266] rounded-md gap-2"
          >
            <div className="flex w-full justify-between items-center">
              <p className="font-light">{item.name}</p>
              <CircleCheck className="aspect-square max-w-4 text-teal" />
            </div>
            <p className="text-base font-medium">
              <span className="pr-3">
                {item.value !== "--" &&
                item.name !== "Inflation Rate" &&
                item.name !== "Investment on Saving"
                  ? "₹"
                  : ""}
              </span>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center w-full  h-full  md:gap-5 md:mx-auto md:max-w-[1293px]">
        <Calculator />

        <TaskList />
      </div>
      {/* <InvestmentIdeas /> */}
      {/* <ReviewMutualFund /> */}
      {/* <Pilar /> */}
    </div>
  );
}
