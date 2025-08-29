import React from "react";
import Button from "../../../../component/Button";

interface TemplateResultProps {
  heading: string;
  subheading: string;
  handleRecalculate: () => void;
  handleNext?: () => void;
}

export default function TemplateResult({
  heading,
  subheading,
  handleRecalculate,
  handleNext,
}: TemplateResultProps) {
  return (
    <div className="flex w-full h-full   flex-col items-center justify-center md:gap-[5rem] gap-12  p-[2rem] md:p-0 md:px-[5.44rem] md:py-[4.25rem]">
      <h2 className="text-base font-semibold md:text-lg md:font-semibold ">
        {heading}
      </h2>
      <h1 className="text-4xl font-medium  md:text-6xl md:font-semibold ">
        {subheading}
      </h1>
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
  );
}
