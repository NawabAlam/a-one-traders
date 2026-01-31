type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export default function Button({
  label,
  onClick,
  variant = "primary",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-lg font-medium transition
        ${variant === "primary"
          ? "bg-[color:var(--primary)] text-white"
          : "border border-[color:var(--primary)] text-[color:var(--primary)]"}
      `}
    >
      {label}
    </button>
  );
}
