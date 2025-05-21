export default function Button({
  variant = "solid",
  placeholder,
  onClick,
  disabled = false,
  className = "",
  type = "submit",
}: {
  variant?: "solid" | "outlined";
  placeholder: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`w-full flex items-center justify-center rounded-lg md:h-10 font-medium py-4 disabled:bg-[#404040] ${className} ${
        variant === "solid"
          ? "bg-[#26D1D4] text-[#202222] "
          : "text-white/40 bg-[#202222] "
      }`}
    >
      {placeholder}
    </button>
  );
}
