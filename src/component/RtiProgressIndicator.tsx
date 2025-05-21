interface RtiProgressIndicatorProps {
  currentIndex: number;
  totalQuestions: number;
}
const RtiProgressIndicator: React.FC<RtiProgressIndicatorProps> = ({
  currentIndex,
  totalQuestions,
}) => {
  return (
    <div className="flex w-full h-3 justify-between items-center gap-2 ">
      {[...Array(totalQuestions)].map((_, i) => (
        <div
          key={i}
          className={` w-full h-[50%] rounded-xl mb-[10%] ${
            i < currentIndex ? "bg-[#26D1D4]" : "bg-[#D3D3D3]"
          }`}
        />
      ))}
    </div>
  );
};

export default RtiProgressIndicator;
