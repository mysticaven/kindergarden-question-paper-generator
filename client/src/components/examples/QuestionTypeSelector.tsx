import { useState } from 'react';
import QuestionTypeSelector from '../QuestionTypeSelector';

export default function QuestionTypeSelectorExample() {
  const [selected, setSelected] = useState(['counting', 'comparison']);
  return <QuestionTypeSelector selected={selected} onChange={setSelected} />;
}
