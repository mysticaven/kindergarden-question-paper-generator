import { useState } from 'react';
import QuestionCountSelector from '../QuestionCountSelector';

export default function QuestionCountSelectorExample() {
  const [count, setCount] = useState(10);
  return <QuestionCountSelector count={count} onChange={setCount} />;
}
