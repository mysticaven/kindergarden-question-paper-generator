import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface CurriculumInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CurriculumInput({ value, onChange }: CurriculumInputProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="curriculum" className="text-lg font-semibold">
          Curriculum Input
        </Label>
        <button
          className="flex items-center gap-2 text-sm text-muted-foreground hover-elevate active-elevate-2 px-3 py-1.5 rounded-md"
          onClick={() => console.log('Upload file clicked')}
          data-testid="button-upload-curriculum"
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </div>
      
      <Textarea
        id="curriculum"
        placeholder="Paste your curriculum here or describe the topics you want to cover...&#10;&#10;Example:&#10;- Numbers 1-10 recognition&#10;- Counting objects&#10;- Size comparison (bigger/smaller)&#10;- Shape identification&#10;- Color recognition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] font-mono text-sm resize-none"
        data-testid="textarea-curriculum"
      />
    </div>
  );
}
