import { createContext, useContext, useState, type ReactNode } from "react";
import { RtiQuestionList, type Option, type Question } from "./Question";

export type RTIContextType = {
  index: number;
  rtilist: Question[];
  handleSelectOption: (task: Option, optionIndex: number) => void;
  getRiskProfileResult: () => string;
  getRTIResult: () => { title: string; score: number };
  nextIndex: () => void;
  reset: () => void;
  setQuestions: (questions: Question[]) => void;
};

export const RTIContext = createContext<RTIContextType | null>(null);

export const RTIContextProvider = ({ children }: { children: ReactNode }) => {
  const [rti, setRtiList] = useState<Question[]>([]);
  const [index, setindex] = useState<number>(0);

  const handleSelectOption = (task: Option, optionIndex: number) => {
    const updatedRti = [...rti];
    const questionToUpdate = updatedRti[index];
    if (questionToUpdate) {
      questionToUpdate.selectedOption = {
        option: task,
        index: optionIndex,
      };
    }
    setRtiList(updatedRti);
  };
  const nextIndex = () => {
    if (index < rti.length - 1) {
      setindex(index + 1);
    } else {
      console.log(rti);
    }
    // console.log(index);
  };
  const setQuestions = (questions: Question[]) => {
    setRtiList(questions);
    setindex(0); // reset index
  };
  const reset = () => {
    const resetList = rti.map((q) => ({ ...q, selectedOption: undefined }));
    setRtiList(resetList);
    setindex(0);
  };
  const getRiskProfileResult = () => {
    const totalScore = rti.reduce((acc, question) => {
      if (question.selectedOption) {
        // Assume options are ordered a, b, c, d
        acc += question.selectedOption.index + 1; // index 0 => 1 point, etc.
      }
      return acc;
    }, 0);

    if (totalScore <= 4) return "Conservative";
    if (totalScore <= 8) return "Moderate";
    if (totalScore <= 12) return "Moderately Aggressive";
    return "Aggressive";
  };
  const getRTIResult = () => {
    const totalScore = rti.reduce((acc, question) => {
      if (question.selectedOption) {
        // Assume options are ordered a, b, c, d
        acc += question.selectedOption.index + 1; // index 0 => 1 point, etc.
      }
      return acc;
    }, 0);

    if (totalScore <= 10) return { title: "Emotional", score: totalScore };
    if (totalScore <= 16)
      return { title: "Emotional & Rational", score: totalScore };
    return { title: "Rational", score: totalScore };
  };

  const contextValue: RTIContextType = {
    index: index,
    rtilist: rti,
    handleSelectOption: handleSelectOption,
    nextIndex: nextIndex,
    setQuestions: setQuestions,
    getRiskProfileResult: getRiskProfileResult,
    getRTIResult: getRTIResult,
    reset: reset,
  };

  return (
    <RTIContext.Provider value={contextValue}>{children}</RTIContext.Provider>
  );
};

export function useRTIContext() {
  const RTIContextValues = useContext(RTIContext);
  if (!RTIContextValues) {
    throw new Error("useRTIContext Used Outside Of Provider");
  }
  return RTIContextValues;
}
