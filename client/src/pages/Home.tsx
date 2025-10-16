import { useState } from "react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import CurriculumInput from "@/components/CurriculumInput";
import QuestionTypeSelector from "@/components/QuestionTypeSelector";
import QuestionCountSelector from "@/components/QuestionCountSelector";
import QuestionCard from "@/components/QuestionCard";
import type { Question } from "@/components/QuestionCard";
import GenerationProgress from "@/components/GenerationProgress";
import PDFPreview from "@/components/PDFPreview";
import ThemeToggle from "@/components/ThemeToggle";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [curriculum, setCurriculum] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["counting", "comparison"]);
  const [questionCount, setQuestionCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  //todo: remove mock functionality
  const mockQuestions: Question[] = [
    {
      id: '1',
      type: 'counting',
      question: 'How many mangoes can you count in this picture?',
      imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      type: 'comparison',
      question: 'Which apple is bigger? Circle the bigger one.',
      imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop'
    },
    {
      id: '3',
      type: 'shapes',
      question: 'How many circles can you find in this picture?',
      imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=400&fit=crop'
    },
    {
      id: '4',
      type: 'counting',
      question: 'Count the bananas and write the number.',
      imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop'
    },
    {
      id: '5',
      type: 'comparison',
      question: 'Which tree is taller? Point to the taller tree.',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop'
    },
    {
      id: '6',
      type: 'colors',
      question: 'What color are these strawberries?',
      imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop'
    },
    {
      id: '7',
      type: 'counting',
      question: 'How many flowers do you see?',
      imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop'
    },
    {
      id: '8',
      type: 'comparison',
      question: 'Which ball is smaller?',
      imageUrl: 'https://images.unsplash.com/photo-1511067007398-9e756e4d1b71?w=400&h=400&fit=crop'
    },
    {
      id: '9',
      type: 'shapes',
      question: 'Circle all the triangular shapes you can find.',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=400&fit=crop'
    },
    {
      id: '10',
      type: 'counting',
      question: 'Count the butterflies in the garden.',
      imageUrl: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=400&fit=crop'
    }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setShowPreview(false);
    
    // Simulate generation progress
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= questionCount) {
          clearInterval(interval);
          setIsGenerating(false);
          setQuestions(mockQuestions.slice(0, questionCount));
          return questionCount;
        }
        return prev + 1;
      });
    }, 500);
  };

  const handleRegenerate = (id: string) => {
    console.log('Regenerating question:', id);
    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.id === id ? { ...q, isGenerating: true } : q
      )
    );
    
    setTimeout(() => {
      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q.id === id ? { ...q, isGenerating: false } : q
        )
      );
    }, 2000);
  };

  const canGenerate = curriculum.trim().length > 0 && selectedTypes.length > 0 && questionCount > 0;

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
                  onClick={handleGenerate}
                  disabled={!canGenerate || isGenerating}
                  className="px-8 py-6 text-lg rounded-full shadow-xl"
                  data-testid="button-generate-paper"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Question Paper'}
                </Button>
              </div>
            </section>

            {isGenerating && (
              <div className="max-w-4xl mx-auto py-8">
                <GenerationProgress current={generationProgress} total={questionCount} />
              </div>
            )}

            {questions.length > 0 && !isGenerating && (
              <section className="space-y-6">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                  <h2 className="text-2xl font-display font-bold">Generated Questions</h2>
                  <Button 
                    onClick={() => setShowPreview(true)}
                    data-testid="button-view-preview"
                  >
                    View PDF Preview
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {questions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      onRegenerate={handleRegenerate}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(false)}
                data-testid="button-back-to-edit"
              >
                ← Back to Edit
              </Button>
            </div>
            <PDFPreview questions={questions} />
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
