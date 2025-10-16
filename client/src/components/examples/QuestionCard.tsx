import QuestionCard from '../QuestionCard';

export default function QuestionCardExample() {
  const sampleQuestion = {
    id: '1',
    type: 'counting',
    question: 'How many mangoes can you count in this picture?',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop'
  };

  return (
    <div className="max-w-sm">
      <QuestionCard 
        question={sampleQuestion} 
        onRegenerate={(id) => console.log('Regenerate question', id)} 
      />
    </div>
  );
}
