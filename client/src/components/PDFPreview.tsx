import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Printer, Share2 } from "lucide-react";
import type { Question } from "./QuestionCard";

interface PDFPreviewProps {
  questions: Question[];
}

export default function PDFPreview({ questions }: PDFPreviewProps) {
  const handleDownload = () => {
    console.log('Download PDF clicked');
  };

  const handlePrint = () => {
    console.log('Print clicked');
    window.print();
  };

  const handleShare = () => {
    console.log('Share clicked');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">Preview & Export</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} data-testid="button-share">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} data-testid="button-print">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button size="sm" onClick={handleDownload} data-testid="button-download-pdf">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="p-8 bg-white dark:bg-card">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Kindergarten Question Paper
            </h1>
            <p className="text-muted-foreground">
              Name: _________________ Date: _________________
            </p>
          </div>

          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <div className="flex gap-3">
                  <span className="font-semibold text-lg">{index + 1}.</span>
                  <div className="flex-1">
                    <p className="font-display text-lg mb-4">{question.question}</p>
                    {question.imageUrl && (
                      <div className="w-full max-w-md">
                        <img 
                          src={question.imageUrl} 
                          alt={`Question ${index + 1}`}
                          className="w-full rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
