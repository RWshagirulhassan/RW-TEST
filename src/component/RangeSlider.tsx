import { Slider } from "@mui/material";
import { useState } from "react";
import { useCalculator } from "../page/Home/Calculator/context/calculatorContext";
import { MARKS_FOR_RANGE_SLIDER } from "../../constants";

export default function RangeSlider() {
  const {
    setCurrentAge,
    setRetirementAge,
    currentAge,
    retirementAge,
    personalinflation,
  } = useCalculator();
  const minDistance = 10;

  const [sliderValues, setSliderValues] = useState<number[]>([20, 37]);
  // const [currentAge, setCurrentAge] = useState<number>(sliderValues[0])
  // const [retirementAge, setRetirementAge] = useState<number>(sliderValues[1])

  const handleChange1 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setSliderValues([
        Math.min(newValue[0], sliderValues[1] - minDistance),
        sliderValues[1],
      ]);
      setCurrentAge(Math.min(newValue[0], sliderValues[1] - minDistance));
    } else {
      setSliderValues([
        sliderValues[0],
        Math.max(newValue[1], sliderValues[0] + minDistance),
      ]);
      setRetirementAge(Math.max(newValue[1], sliderValues[0] + minDistance));
    }
  };
  const handleCurrentAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setCurrentAge(isNaN(value) ? 0 : value);
    setSliderValues([isNaN(value) ? 0 : value, retirementAge]);
  };

  const handleRetirementAgeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    setRetirementAge(isNaN(value) ? 0 : value);
    setSliderValues([currentAge, isNaN(value) ? 0 : value]);
  };
  return (
    <div
      className={`flex flex-col justify-center items-center gap-[1.125rem] md:gap-9 relative ${
        personalinflation == null && "-z-10"
      }`}
    >
      <div className="flex w-full justify-between gap-4 md:gap-10 ">
        <div className="flex flex-col justify-center items-start  md:items-center  md:gap-6 gap-1">
          <text className="text-xs font-medium md:text-center md:text-base">
            Current Age
          </text>
          <input
            id="currentAge"
            value={currentAge}
            onChange={handleCurrentAgeChange}
            className="md:h-[2.75rem] min-h-[2rem] rounded-md md:rounded-lg px-[1.25rem] md:p-[1.15rem] text-xs md:text-base font-medium  w-full bg-[#16161b]  text-white outline-none border-solid md:border-[1.5px] border-[1px] border-[#979798]"
          />
        </div>
        <div className="flex flex-col justify-center items-start md:items-center  md:gap-6 gap-1">
          <text className="text-xs font-medium md:text-center md:text-base">
            Retirement Age
          </text>
          <input
            id="retirementAge"
            value={retirementAge}
            onChange={handleRetirementAgeChange}
            className="md:h-[2.75rem] min-h-[2rem] rounded-md md:rounded-lg px-[1.25rem] md:p-[1.15rem] text-xs md:text-base font-medium  w-full bg-[#16161b]  text-white outline-none border-solid md:border-[1.5px] border-[1px] border-[#979798]"
          />
        </div>
      </div>
      <Slider
        sx={{
          height: 2,
          padding: "15px 0",
          color: "#26D1D4",
          "& .MuiSlider-thumb": {
            height: 15,
            width: 15,
            backgroundColor: "#26D1D4",
          },
          "& .MuiSlider-valueLabel": {
            display: "none",
          },
          "& .MuiSlider-track": {
            border: "none",
          },
          "& .MuiSlider-rail": {
            opacity: 0.5,
            backgroundColor: "#bfbfbf",
          },
          "& .MuiSlider-mark": {
            backgroundColor: "#bfbfbf",
            height: 7,
            width: 0.005,
            "&.MuiSlider-markActive": {
              opacity: 1,
              backgroundColor: "#bfbfbf",
              color: "#26D1D4",
            },
          },
        }}
        onChange={handleChange1}
        value={sliderValues}
        marks={MARKS_FOR_RANGE_SLIDER}
        valueLabelDisplay="on"
      />
    </div>
  );
}
