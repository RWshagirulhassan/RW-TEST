import { Link, useNavigate } from "react-router-dom";
import RtiProgressIndicator from "../component/RtiProgressIndicator";
import { useRTIContext } from "../context/RTIcontext";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../component/Button";
import { RiskProfileQuestionList } from "../context/Question";
export function ExplainationPopUp({
  visible,
  text,
}: {
  visible: boolean;
  text: String;
}) {
  return (
    <div
      className={` ${
        !visible && "hidden"
      } w-[88%] md:w-[456px] md:h-[352px]  gap-8 bg-[#12161C] rounded-2xl border-[1px] border-[#1A3144]  md:p-0  md:px-[30px] md:py-[20px] flex flex-col justify-center items-center p-6`}
    >
      <text className="text-2xl font-medium ">Explanation</text>
      <div className="flex shrink-0 h-full w-full items-center justify-center text-center">
        <text className="text-lg font-normal text-center ">{text}</text>
      </div>
      <button
        type="button"
        className="w-[152px] h-11 rounded-[10px] bg-purple flex items-center justify-center text-black-primary "
      >
        Close{" "}
      </button>
    </div>
  );
}
export default function RiskProfileTest() {
  const navigate = useNavigate();
  const { rtilist, handleSelectOption, nextIndex, index, setQuestions } =
    useRTIContext();
  const [explainationPopUp, SetexplainationPopUp] = useState(false);

  useEffect(() => {
    // dynamically set based on any condition
    setQuestions(RiskProfileQuestionList);
  }, []);
  const isLastQuestion = index === rtilist.length - 1;
  if (rtilist.length === 0) return <div>Loading questions...</div>;
  return (
    <div className="absolute min-h-screen h-full w-full gradient-mobile md:gradient-desktop">
      <div className="h-screen   flex flex-col  md:flex-row">
        <div className=" flex items-center justify-center h-[20%]  md:h-screen  w-full   md:w-[35%] bg-[#26D1D412]  bg-opacity-[12%]  ">
          <img
            alt="carouselimg "
            className="h-full w-[80%] object-contain py-7"
            src={rtilist[index].Img}
          ></img>
        </div>
        <div className="flex  md:justify-center h-full  md:w-[65%]  ">
          <div className="flex flex-col md:max-w-[70%] text-white h-full  items-center justify-center w-full">
            <div className=" flex flex-col h-full py-[44px] w-full justify-start ">
              <div className="flex flex-col px-[7%] h-full justify-between ">
                <div className="h-full flex flex-col  ">
                  <h2 className=" text-white text-md  md:text-lg font-sans font-semi pb-[7%]">
                    {`Question ${index + 1}/${rtilist.length}`}
                  </h2>
                  <RtiProgressIndicator
                    currentIndex={index + 1}
                    totalQuestions={rtilist.length}
                  ></RtiProgressIndicator>
                  <p className="text-md md:text-lg  ">{rtilist[index].text}</p>
                </div>

                <ul className="w-full h-full flex flex-col justify-end text-[#ECFCFD]">
                  {rtilist[index].options.map((item, i) => {
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelectOption(item, i)}
                        className={`${
                          item === rtilist[index].selectedOption?.option
                            ? "text-[#1B1B1B] bg-[#ECFCFD] border-[#334259]"
                            : "text-white bg-[#7F7F7F29] bg-opacity-[16%] border-[#3f3b45]"
                        }  p-1  mb-[6%] md:mb-[5%] text-center py-[3%] w-full border rounded-lg  `}
                      >
                        {item.text}
                      </button>
                    );
                  })}

                  <div
                    onClick={() => {
                      SetexplainationPopUp(!explainationPopUp);
                    }}
                    className="flex items-center justify-center w-full gap-3 min-h-12 h-full "
                  >
                    {rtilist[index].selectedOption &&
                      rtilist[index].selectedOption.option.Des && (
                        <div className="flex items-center justify-center w-fit gap-3  cursor-pointer">
                          <BookOpen />
                          <p className="text-xl font-medium underline leading-none">
                            Explanation
                          </p>
                        </div>
                      )}
                  </div>

                  {/* <Button
                    disabled={rtilist[index]?.selectedOption == null}
                    type="button"
                    placeholder={
                      rtilist[index]?.selectedOption ? "SUBMIT" : "SELECT ONE"
                    }
                    className="w-full h-11 md:h-16 md:text-2xl md:font-medium text-base font-medium mb-6 md:mb-11 cursor-pointer "
                    onClick={nextIndex}
                    variant={
                      rtilist[index]?.selectedOption ? "solid" : "outlined"
                    }
                  /> */}
                  <Button
                    disabled={rtilist[index]?.selectedOption == null}
                    type="button"
                    placeholder={
                      rtilist[index]?.selectedOption
                        ? isLastQuestion
                          ? "VIEW RESULT"
                          : "SUBMIT"
                        : "SELECT ONE"
                    }
                    className="w-full h-11 md:h-16 md:text-2xl md:font-medium text-base font-medium mb-6 md:mb-11 cursor-pointer "
                    onClick={() => {
                      if (isLastQuestion) {
                        navigate("/RISK-APPETITE"); // Replace with your actual result route
                      } else {
                        nextIndex();
                      }
                    }}
                    variant={
                      rtilist[index]?.selectedOption ? "solid" : "outlined"
                    }
                  />
                </ul>
                {rtilist[index]?.selectedOption?.option.Des && (
                  <div
                    onClick={() => {
                      SetexplainationPopUp(!explainationPopUp);
                    }}
                    className={` ${
                      !explainationPopUp && "hidden"
                    } fixed h-screen w-screen top-0 left-0 flex flex-col items-center justify-center bg-black/70 z-[1000] `}
                  >
                    <ExplainationPopUp
                      text={rtilist[index]?.selectedOption?.option.Des ?? ""}
                      visible={explainationPopUp}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
