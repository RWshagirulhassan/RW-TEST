import React, { ChangeEvent } from "react";
import Button from "../../../../component/Button";

interface TemplateInputProps {
  heading: string;
  subheading: string;
  placeholder1: string;
  placeholder2: string;
  input1: string;
  input2: string;
  setInput1: React.Dispatch<React.SetStateAction<string>>;
  setInput2: React.Dispatch<React.SetStateAction<string>>;
  handleNext: () => void;
}

export default function TemplateInput({
  heading,
  subheading,
  placeholder1,
  placeholder2,
  input1,
  input2,
  setInput1,
  setInput2,
  handleNext,
}: TemplateInputProps) {
  const handleInputChange1 = (e: ChangeEvent<HTMLInputElement>) => {
    setInput1(e.target.value);
  };

  const handleInputChange2 = (e: ChangeEvent<HTMLInputElement>) => {
    setInput2(e.target.value);
  };

  return (
    <div className="flex md:w-full h-full   flex-col items-center justify-center gap-[1.5rem]  md:gap-14 p-[2rem] md:px-[8rem] md:py-[2rem]   ">
      <div className="flex flex-col items-center justify-center gap-[0.938rem] md:gap-[0.87rem] ">
        <h2 className="text-base text-center md:text-lg font-semibold ">
          {heading}
        </h2>
        <p className="text-[0.625rem] md:text-sm font-normal text-center  ">
          {subheading}
        </p>
      </div>

      <input
        onChange={handleInputChange1}
        value={input1}
        placeholder={placeholder1}
        className="md:h-[2.75rem] min-h-[2rem] rounded-md md:rounded-lg px-[1.25rem] md:p-[1.15rem] text-xs md:text-base font-medium  w-full bg-[#16161b]  text-white outline-none border-solid md:border-[1.5px] border-[1px] border-[#979798]"
      />
      <input
        onChange={handleInputChange2}
        value={input2}
        placeholder={placeholder2}
        className="md:h-[2.75rem] min-h-[2rem] rounded-md md:rounded-lg px-[1.25rem] md:p-[1.15rem] text-xs md:text-base font-medium  w-full bg-[#16161b]  text-white outline-none border-solid md:border-[1.5px] border-[1px] border-[#979798]"
      />
      <Button
        disabled={input1 === "" && input2 === ""}
        placeholder="Calculate"
        className="text-xs md:text-base font-medium md:font-semibold md:w-full h-8 md:max-h-11 "
        onClick={handleNext}
      />
    </div>
  );
}
