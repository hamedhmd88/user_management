
const SZ = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };

export default function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div
      role="status"
      aria-label="در حال بارگذاری"
      className={`animate-spin rounded-full border-2 border-custom-border border-t-custom-accent ${SZ[size]}`}
    />
  );
}