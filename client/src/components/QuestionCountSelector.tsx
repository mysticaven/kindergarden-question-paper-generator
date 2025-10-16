import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

interface QuestionCountSelectorProps {
  count: number;
  onChange: (count: number) => void;
}

export default function QuestionCountSelector({ count, onChange }: QuestionCountSelectorProps) {
  const increment = () => onChange(Math.min(count + 1, 30));
  const decrement = () => onChange(Math.max(count - 1, 1));

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">Number of Questions</Label>
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="outline"
          onClick={decrement}
          disabled={count <= 1}
          data-testid="button-decrease-count"
        >
          <Minus className="w-4 h-4" />
        </Button>
        
        <div className="flex-1 max-w-xs">
          <div className="text-center">
            <span className="text-4xl font-bold font-display" data-testid="text-question-count">
              {count}
            </span>
            <p className="text-sm text-muted-foreground mt-1">questions</p>
          </div>
        </div>
        
        <Button
          size="icon"
          variant="outline"
          onClick={increment}
          disabled={count >= 30}
          data-testid="button-increase-count"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
