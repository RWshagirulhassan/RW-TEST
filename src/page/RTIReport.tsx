import { Link, useNavigate } from "react-router-dom";

import Button from "../component/Button";
import { ChevronLeft } from "lucide-react";
import { useRTIContext } from "../context/RTIcontext";

export function EDIndicator({
  One,
  Second,
}: {
  One: { [key: string]: string };
  Second: { [key: string]: string };
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="h-[12px] w-full rounded-full bg-[#FF6B6B] relative">
        <span
          style={{
            width: One.value,
          }}
          className={` absolute  h-full w-[${One}] rounded-full bg-[#407BFF]`}
        />
      </span>
      <div className="flex gap-[12px] text-xl font-semibold">
        <div className="flex items-center justify-center gap-[6px]">
          <div className="h-3 w-3  bg-[#407BFF] rounded-full" />
          <text>
            {" "}
            {One.label}: {One.value}
          </text>
        </div>
        <div className="flex items-center justify-center gap-[6px]">
          <div className="h-3 w-3  bg-[#FF6B6B] rounded-full" />
          <text>
            {" "}
            {Second.label}: {Second.value}
          </text>
        </div>
      </div>
    </div>
  );
}
export default function RTIReport() {
  const navigate = useNavigate();
  const { getRTIResult } = useRTIContext();

  const { score, title } = getRTIResult();
  const rationalPercent = Math.round((score / 17) * 100);
  const emotionalPercent = 100 - rationalPercent;
  return (
    <div className="h-screen  w-full  mx-auto  bg-black-primary flex flex-col justify-between text-white  px-5 py-[5%] gradient-mobile md:gradient-desktop">
      <div className="h-full w-full md:w-fit flex  md:items-center md:justify-start flex-col   md:max-w-[1042px] mx-auto ">
        <div className=" flex justify-between items-center  pb-7 md:pb-24 md:w-[160%]">
          <button
            onClick={() => {
              navigate(-1);
            }}
            type="button"
            className="min-h-9 min-w-9  rounded-full  flex justify-center items-center md:gap-3 "
          >
            <ChevronLeft />
            <text className="md:block hidden text-2xl font-normal">Back</text>
          </button>

          <text className="text-xl font-medium md:text-4xl md:font-bold ">
            RTI Report
          </text>
          <span className="min-h-9 min-w-9  rounded-full  flex justify-center items-center " />
        </div>
        <div className="flex flex-col md:flex-row-reverse md:gap-[92px]">
          {" "}
          <div className="flex flex-col justify-start md:justify-center w-full md:w-fit   md:h-full md:mx-auto ">
            <div className=" rounded-2xl flex flex-col md:flex-row  mb-4">
              <div className="flex flex-col md:flex-col-reverse  w-full justify-center items-center gap-6 md:gap-8 min-w-[20vw]">
                <span className="bg-purple h-[170px] w-[113px] " />
                <text className="text-sm md:text-2xl text-center font-normal leading-[18px] md:leading-[24px] ">
                  You are financially <br />
                  <span className="text-2xl md:text-4xl md:leading-[54px] font-medium text-[#BEA9E2] leading-[36px]">
                    {title}
                  </span>
                </text>
              </div>
            </div>
          </div>{" "}
          <div className="bg-[#29292980] w-full  md:max-w-[504px]  rounded-2xl flex flex-col  py-8 px-5 md:py-9 md:px-10 border-[#1A3144] border-[1px]  md:gap-7">
            <text className="text-lg lg:text-2xl font-medium pb-6">
              Your Investment decision making
            </text>
            <EDIndicator
              One={{ label: "Rational", value: `${rationalPercent}%` }}
              Second={{ label: "Emotional", value: `${emotionalPercent}%` }}
            />
            <text className=" text-sm lg:text-xl font-light pt-5">
              You are a Rational investor. You are likely to make investment
              decisions based on logical reasoning and analysis rather than
              emotional impulses.
            </text>
          </div>
        </div>
        <Button
          placeholder="Retake evaluation"
          onClick={() => {
            window.location.href = "/RTI";
          }}
          className="text-base md:text-2xl font-semibold  bg-[#1FB7AA] md:min-h-16   h-full mt-[10%] mb-[5%]"
        />
        <Link to="/">
          <text className="text-center text-base md:text-2xl font-medium pt-5 pb-7 underline leading-4">
            Back to Home
          </text>
        </Link>
      </div>
    </div>
  );
}
