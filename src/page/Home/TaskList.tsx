import { useState } from "react";

export default function TaskList() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleExpand = (index: number) => {
    setExpandedRow((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="hidden lg:flex w-[25%] flex-col justify-start items-center  bg-[#16161b]  rounded-xl md:rounded-2xl p-7">
      <div className="flex flex-col gap-5">
        <h2 className="text-center md:text-lg font-semibold pb-2 ">
          Complete these Tasks To Earn a Badge
        </h2>
        <p className="text-sm font-normal text-center">25 % Completed</p>
        <div className="w-full h-[0.629rem] rounded-3xl bg-[#D9D9D910]  relative">
          <div className="h-full w-[25%] bg-[#42e6e9] rounded-3xl " />
        </div>{" "}
        {["TASKDESCRIPTION"].map((description, index) => (
          <button
            type="button"
            onClick={() => handleExpand(index)}
            className="bg-[#2D2D2D] bg-opacity-[75%] min-h-[44px] w-full py-3 px-4 text-start  rounded-xl cursor-pointer "
          >
            <div className="text-sm ">{`Task ${index + 1}`}</div>
            {expandedRow === index && (
              <div className="text-sm pt-3">{description}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
