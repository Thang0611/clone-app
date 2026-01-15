import { AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

interface ErrorStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({ 
  title, 
  description, 
  actionLabel = "Thử lại",
  onAction 
}: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
      {description && <p className="text-slate-600 mb-6">{description}</p>}
      {onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
