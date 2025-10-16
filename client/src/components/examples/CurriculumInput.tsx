import { useState } from 'react';
import CurriculumInput from '../CurriculumInput';

export default function CurriculumInputExample() {
  const [value, setValue] = useState('');
  return <CurriculumInput value={value} onChange={setValue} />;
}
