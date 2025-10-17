import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, Upload } from "lucide-react";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiUpload } from "@/lib/queryClient";

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
  onImageUpload?: (id: string, imageUrl: string) => void;
}

export default function QuestionCard({ question, onRegenerate, onImageUpload }: QuestionCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiUpload('/api/upload-image', formData);
      return await response.json();
    },
    onSuccess: (data) => {
      if (onImageUpload) {
        onImageUpload(question.id, data.imageUrl);
      }
      toast({
        title: "Success!",
        description: "Image uploaded successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  return (
    <Card className="overflow-hidden" data-testid={`card-question-${question.id}`}>
      <div className="aspect-square bg-muted relative">
        {question.isGenerating || uploadMutation.isPending ? (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {uploadMutation.isPending ? 'Uploading image...' : 'Generating image...'}
              </p>
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
          
          <div className="flex gap-2">
            {onImageUpload && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleUploadClick}
                  disabled={uploadMutation.isPending}
                  data-testid={`button-upload-${question.id}`}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </Button>
              </>
            )}
            
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
      </div>
    </Card>
  );
}
