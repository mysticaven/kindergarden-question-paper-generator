import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

export interface Question {
  id: string;
  type: string;
  question: string;
  imageUrl?: string;
  isGenerating?: boolean;
}

interface QuestionCardProps {
  question: Question;
  onRegenerate?: (id: string) => void;
}

export default function QuestionCard({ question, onRegenerate }: QuestionCardProps) {
  return (
    <Card className="overflow-hidden" data-testid={`card-question-${question.id}`}>
      <div className="aspect-square bg-muted relative">
        {question.isGenerating ? (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Generating image...</p>
            </div>
          </div>
        ) : question.imageUrl ? (
          <img 
            src={question.imageUrl} 
            alt={question.question}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No image</p>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <p className="font-display text-lg leading-relaxed" data-testid={`text-question-${question.id}`}>
          {question.question}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-md">
            {question.type}
          </span>
          
          {onRegenerate && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRegenerate(question.id)}
              data-testid={`button-regenerate-${question.id}`}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Regenerate
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
