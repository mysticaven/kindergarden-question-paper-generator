import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

interface GenerationProgressProps {
  current: number;
  total: number;
}

export default function GenerationProgress({ current, total }: GenerationProgressProps) {
  const progress = (current / total) * 100;

  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-6 rounded-xl bg-card border border-card-border">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Generating Questions</h3>
          <p className="text-sm text-muted-foreground">
            {current} of {total} complete
          </p>
        </div>
      </div>
      
      <Progress value={progress} className="h-2" data-testid="progress-generation" />
    </div>
  );
}
