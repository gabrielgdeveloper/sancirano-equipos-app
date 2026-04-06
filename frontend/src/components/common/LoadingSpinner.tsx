import clsx from "clsx";

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
}

export function LoadingSpinner({ className, label = "Cargando..." }: LoadingSpinnerProps) {
  return (
    <div className={clsx("flex flex-col items-center justify-center gap-3 py-16", className)}>
      <div className="w-10 h-10 border-4 border-surface-500 border-t-brand-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
