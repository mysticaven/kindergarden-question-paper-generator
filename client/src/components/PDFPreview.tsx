import { Button } from "@/components/ui/button";
import { Download, Printer, Share2, FileText } from "lucide-react";
import { useState } from "react";
import type { Question } from "./QuestionCard";
import type { ExamDetails } from "@shared/schema";

interface PDFPreviewProps {
  questions: Question[];
  examDetails: ExamDetails;
}

export default function PDFPreview({ questions, examDetails }: PDFPreviewProps) {
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);

  const handleDownloadPDF = () => {
    console.log('Download PDF clicked');
    window.print();
  };

  const handleDownloadWord = async () => {
    setIsDownloadingWord(true);
    try {
      const response = await fetch('/api/export-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examDetails,
          questions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Word document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exam-paper-${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading Word document:', error);
      alert('Failed to download Word document. Please try again.');
    } finally {
      setIsDownloadingWord(false);
    }
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
      <div className="flex items-center justify-between print:hidden">
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadWord} 
            disabled={isDownloadingWord}
            data-testid="button-download-word"
          >
            <FileText className="w-4 h-4 mr-2" />
            {isDownloadingWord ? 'Generating...' : 'Download Word'}
          </Button>
          <Button size="sm" onClick={handleDownloadPDF} data-testid="button-download-pdf">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="bg-white p-8 border-4 border-black" id="exam-paper">
        <div className="max-w-4xl mx-auto">
          {/* Header with Logo and School Info */}
          <div className="border-b-2 border-black pb-4 mb-6">
            <div className="flex items-start gap-4">
              {examDetails.logoUrl && (
                <div className="flex-shrink-0">
                  <img 
                    src={examDetails.logoUrl} 
                    alt="School logo" 
                    className="w-20 h-20 object-contain"
                  />
                </div>
              )}
              <div className="flex-1 text-center">
                <h1 className="text-2xl font-bold uppercase mb-1">
                  {examDetails.schoolName}
                </h1>
                {examDetails.schoolAddress && (
                  <p className="text-sm mb-2">{examDetails.schoolAddress}</p>
                )}
                {examDetails.academicSession && (
                  <p className="text-sm mb-2">Academic Session: {examDetails.academicSession}</p>
                )}
                <div className="mt-3">
                  {examDetails.grade && (
                    <p className="text-base font-semibold uppercase">{examDetails.grade}</p>
                  )}
                  <h2 className="text-xl font-bold uppercase mt-1">
                    {examDetails.examTitle}
                  </h2>
                  {examDetails.subject && (
                    <p className="text-base font-semibold mt-1">{examDetails.subject}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Student Information Fields */}
          <div className="space-y-3 mb-8">
            {examDetails.includeStudentName && (
              <div className="flex items-center gap-2">
                <span className="font-semibold min-w-[100px]">NAME:</span>
                <div className="flex-1 border-b-2 border-black border-dotted h-8"></div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {examDetails.classDiv && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold min-w-[100px]">CLASS:</span>
                  <span>{examDetails.classDiv}</span>
                </div>
              )}
              {examDetails.includeDate && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold min-w-[100px]">DATE:</span>
                  <div className="flex-1 border-b-2 border-black border-dotted h-8"></div>
                </div>
              )}
            </div>

            {examDetails.includeSchool && (
              <div className="flex items-center gap-2">
                <span className="font-semibold min-w-[100px]">SCHOOL:</span>
                <div className="flex-1 border-b-2 border-black border-dotted h-8"></div>
              </div>
            )}

            {examDetails.topic && (
              <div className="flex items-center gap-2">
                <span className="font-semibold min-w-[100px]">TOPIC:</span>
                <span>{examDetails.topic}</span>
              </div>
            )}

            {examDetails.includeTeacher && (
              <div className="flex items-center gap-2">
                <span className="font-semibold min-w-[100px]">TEACHER:</span>
                <div className="flex-1 border-b-2 border-black border-dotted h-8"></div>
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-3 pb-6 border-b border-gray-300 last:border-0">
                <div className="flex gap-3">
                  <span className="font-bold text-lg">{index + 1}.</span>
                  <div className="flex-1">
                    <p className="text-lg mb-4 font-medium">{question.question}</p>
                    {question.imageUrl && (
                      <div className="mt-4">
                        <img 
                          src={question.imageUrl} 
                          alt={`Question ${index + 1}`}
                          className="max-w-md w-full border-2 border-gray-300 rounded"
                        />
                      </div>
                    )}
                    
                    {/* Answer space */}
                    <div className="mt-6">
                      <div className="text-sm text-gray-600 mb-2">Answer:</div>
                      <div className="border-b-2 border-dotted border-gray-400 h-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t-2 border-black flex justify-between text-sm">
            <div>PREPARED BY: _______________</div>
            <div>CHECKED BY: _______________</div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #exam-paper, #exam-paper * {
            visibility: visible;
          }
          #exam-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
