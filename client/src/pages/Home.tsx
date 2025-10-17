import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import CurriculumInput from "@/components/CurriculumInput";
import QuestionTypeSelector from "@/components/QuestionTypeSelector";
import QuestionCountSelector from "@/components/QuestionCountSelector";
import ExamDetailsForm from "@/components/ExamDetailsForm";
import QuestionCard from "@/components/QuestionCard";
import type { Question } from "@/components/QuestionCard";
import GenerationProgress from "@/components/GenerationProgress";
import PDFPreview from "@/components/PDFPreview";
import ThemeToggle from "@/components/ThemeToggle";
import { Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import type { ExamDetails } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [curriculum, setCurriculum] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["counting", "comparison"]);
  const [questionCount, setQuestionCount] = useState(10);
  const [examDetails, setExamDetails] = useState<ExamDetails>({
    schoolName: "",
    examTitle: "Monthly Examination",
    includeStudentName: true,
    includeDate: true,
    includeSchool: false,
    includeTeacher: false,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate-questions", {
        curriculum,
        questionTypes: selectedTypes,
        questionCount,
        examDetails,
      });
      return await response.json();
    },
    onSuccess: (data: any) => {
      setQuestions(data.paper.questions);
      setShowPreview(true);
      toast({
        title: "Success!",
        description: `Generated ${data.paper.questions.length} questions successfully.`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to generate questions. Please try again.";
      
      // Check if it's a quota error
      if (error.message?.includes("quota") || error.message?.includes("429")) {
        toast({
          title: "OpenAI Quota Exceeded",
          description: "Your OpenAI API key has insufficient quota. Please add credits to your OpenAI account or check your billing settings.",
          variant: "destructive",
          duration: 10000,
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate();
  };

  const handleRegenerate = (id: string) => {
    console.log('Regenerating question:', id);
    toast({
      title: "Feature coming soon",
      description: "Individual question regeneration will be available soon.",
    });
  };

  const handleImageUpload = (id: string, imageUrl: string) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => 
        q.id === id ? { ...q, imageUrl } : q
      )
    );
  };

  const canProceedToStep2 = curriculum.trim().length > 10 && selectedTypes.length > 0 && questionCount > 0;
  const canGenerate = canProceedToStep2 && examDetails.schoolName.trim().length > 0 && examDetails.examTitle.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <h2 className="font-display text-xl font-bold">QuestionMaker</h2>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <Hero />

        {!showPreview ? (
          <>
            {/* Progress Steps */}
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className={`flex items-center gap-2 ${step === 1 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    1
                  </div>
                  <span className="hidden sm:inline">Curriculum & Questions</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                <div className={`flex items-center gap-2 ${step === 2 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    2
                  </div>
                  <span className="hidden sm:inline">Exam Details</span>
                </div>
              </div>
            </div>

            {step === 1 ? (
              <section className="max-w-4xl mx-auto space-y-8">
                <CurriculumInput value={curriculum} onChange={setCurriculum} />
                
                <QuestionTypeSelector 
                  selected={selectedTypes} 
                  onChange={setSelectedTypes} 
                />
                
                <QuestionCountSelector 
                  count={questionCount} 
                  onChange={setQuestionCount} 
                />

                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    className="px-8 py-4 text-lg rounded-full"
                    data-testid="button-next-step"
                  >
                    Next: Exam Details
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </section>
            ) : (
              <section className="max-w-4xl mx-auto space-y-8">
                <ExamDetailsForm details={examDetails} onChange={setExamDetails} />

                <div className="flex justify-center gap-4 pt-4">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="px-8 py-4 text-lg rounded-full"
                    data-testid="button-back-step"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleGenerate}
                    disabled={!canGenerate || generateMutation.isPending}
                    className="px-8 py-4 text-lg rounded-full shadow-xl"
                    data-testid="button-generate-paper"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {generateMutation.isPending ? 'Generating...' : 'Generate Question Paper'}
                  </Button>
                </div>
              </section>
            )}

            {generateMutation.isPending && (
              <div className="max-w-4xl mx-auto py-8">
                <GenerationProgress current={5} total={questionCount} />
                <p className="text-center text-sm text-muted-foreground mt-4">
                  AI is creating questions and generating images... This may take a minute.
                </p>
              </div>
            )}
          </>
        ) : (
          <section className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(false)}
                data-testid="button-back-to-edit"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Edit
              </Button>
              
              {questions.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {questions.length} questions generated
                </div>
              )}
            </div>

            {questions.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {questions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      onRegenerate={handleRegenerate}
                      onImageUpload={handleImageUpload}
                    />
                  ))}
                </div>

                <PDFPreview questions={questions} examDetails={examDetails} />
              </>
            )}
          </section>
        )}
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
          <p>Create engaging kindergarten question papers with AI-powered generation</p>
        </div>
      </footer>
    </div>
  );
}
