import PDFPreview from '../PDFPreview';

export default function PDFPreviewExample() {
  //todo: remove mock functionality
  const mockQuestions = [
    {
      id: '1',
      type: 'counting',
      question: 'How many mangoes can you count?',
      imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      type: 'comparison',
      question: 'Which apple is bigger?',
      imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop'
    }
  ];

  const mockExamDetails = {
    schoolName: 'Happy Kindergarten School',
    examTitle: 'Monthly Examination',
    grade: 'KG (1 & 2)',
    includeStudentName: true,
    includeDate: true,
    includeSchool: false,
    includeTeacher: false,
  };

  return <PDFPreview questions={mockQuestions} examDetails={mockExamDetails} />;
}
