import Button from "../../../../component/Button";
import { useModal } from "../../../../context/model";

type CalculatorPopUpProps = {
  title: string;
  firstAction?: string;
  secondAction?: string;
  onFirstAction: () => void;
  onSecondAction: () => void;
};

export default function CalculatorPopUp({
  title,
  onFirstAction,
  onSecondAction,
  firstAction,
  secondAction,
}: CalculatorPopUpProps) {
  const { hideModal } = useModal();

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full flex flex-col justify-between max-w-md bg-[#181C22] border-[1px] border-white/40 rounded-xl shadow-lg p-6 gap-8">
        <div className="min-h-32 w-full h-full flex shrink-0 items-center">
          <p className="text-center font-medium text-base text-white/70 h-full">
            {title}
          </p>
        </div>

        <div className="flex justify-center gap-2 max-h-9">
          <Button
            onClick={() => {
              onFirstAction();
              hideModal();
            }}
            className="rounded-lg"
            variant="outlined"
            placeholder={firstAction ?? "Edit Yourself"}
          />
          <Button
            onClick={() => {
              onSecondAction();
              hideModal();
            }}
            className="rounded-lg"
            placeholder={secondAction ?? "Calculate"}
          />
        </div>
      </div>
    </div>
  );
}
