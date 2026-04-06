interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({ title = "Sin datos", message = "No hay información disponible." }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <p className="text-gray-300 font-medium">{title}</p>
      <p className="text-gray-500 text-sm max-w-xs">{message}</p>
    </div>
  );
}
