import { Card } from "@/components/ui/card";
import { Apple, Ruler, Palette, Shapes, Hash, Brain } from "lucide-react";

interface QuestionType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const questionTypes: QuestionType[] = [
  {
    id: 'counting',
    title: 'Counting',
    description: 'Count objects like fruits, toys',
    icon: Apple
  },
  {
    id: 'comparison',
    title: 'Size Comparison',
    description: 'Identify bigger/smaller items',
    icon: Ruler
  },
  {
    id: 'colors',
    title: 'Color Recognition',
    description: 'Identify and match colors',
    icon: Palette
  },
  {
    id: 'shapes',
    title: 'Shape Recognition',
    description: 'Identify basic shapes',
    icon: Shapes
  },
  {
    id: 'numbers',
    title: 'Number Recognition',
    description: 'Recognize written numbers',
    icon: Hash
  },
  {
    id: 'patterns',
    title: 'Patterns',
    description: 'Complete simple patterns',
    icon: Brain
  }
];

interface QuestionTypeSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function QuestionTypeSelector({ selected, onChange }: QuestionTypeSelectorProps) {
  const toggleType = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(t => t !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Question Types</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {questionTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selected.includes(type.id);
          
          return (
            <Card
              key={type.id}
              className={`p-4 cursor-pointer transition-colors hover-elevate active-elevate-2 ${
                isSelected ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => toggleType(type.id)}
              data-testid={`card-question-type-${type.id}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-md ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{type.title}</h4>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
