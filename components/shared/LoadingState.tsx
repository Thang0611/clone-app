import { Spinner } from "../ui/Spinner";

interface LoadingStateProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({ text = "Đang tải...", size = "lg" }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner size={size} text={text} />
    </div>
  );
}
