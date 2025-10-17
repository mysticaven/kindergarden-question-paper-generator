import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExamDetails } from "@shared/schema";

interface ExamDetailsFormProps {
  details: ExamDetails;
  onChange: (details: ExamDetails) => void;
}

export default function ExamDetailsForm({ details, onChange }: ExamDetailsFormProps) {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...details, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onChange({ ...details, logoUrl: undefined });
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Exam Paper Details</h3>
        <p className="text-sm text-muted-foreground">
          Customize your exam paper header and student information fields
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="schoolName">School Name *</Label>
          <Input
            id="schoolName"
            placeholder="e.g., Happy Kindergarten School"
            value={details.schoolName}
            onChange={(e) => onChange({ ...details, schoolName: e.target.value })}
            data-testid="input-school-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolAddress">School Address</Label>
          <Input
            id="schoolAddress"
            placeholder="e.g., 123 Main Street, City"
            value={details.schoolAddress || ""}
            onChange={(e) => onChange({ ...details, schoolAddress: e.target.value })}
            data-testid="input-school-address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="academicSession">Academic Session</Label>
          <Input
            id="academicSession"
            placeholder="e.g., 2024-2025"
            value={details.academicSession || ""}
            onChange={(e) => onChange({ ...details, academicSession: e.target.value })}
            data-testid="input-academic-session"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="examTitle">Exam/Worksheet Title *</Label>
          <Input
            id="examTitle"
            placeholder="e.g., Monthly Examination, English Revision Worksheet"
            value={details.examTitle}
            onChange={(e) => onChange({ ...details, examTitle: e.target.value })}
            data-testid="input-exam-title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Grade/Class</Label>
          <Input
            id="grade"
            placeholder="e.g., Kindergarten, KG-1"
            value={details.grade || ""}
            onChange={(e) => onChange({ ...details, grade: e.target.value })}
            data-testid="input-grade"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="classDiv">Class/Division</Label>
          <Input
            id="classDiv"
            placeholder="e.g., KG-1/Div.A, SR KG"
            value={details.classDiv || ""}
            onChange={(e) => onChange({ ...details, classDiv: e.target.value })}
            data-testid="input-class-div"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="e.g., Mathematics, English, General Knowledge"
            value={details.subject || ""}
            onChange={(e) => onChange({ ...details, subject: e.target.value })}
            data-testid="input-subject"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            placeholder="e.g., Revision, Numbers, Shapes & Colors"
            value={details.topic || ""}
            onChange={(e) => onChange({ ...details, topic: e.target.value })}
            data-testid="input-topic"
          />
        </div>

        <div className="space-y-2">
          <Label>School Logo</Label>
          <div className="flex gap-3">
            {details.logoUrl ? (
              <div className="relative">
                <img 
                  src={details.logoUrl} 
                  alt="School logo" 
                  className="w-20 h-20 object-contain border rounded-md"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeLogo}
                  data-testid="button-remove-logo"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-20 h-20 border-2 border-dashed rounded-md cursor-pointer hover-elevate active-elevate-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  data-testid="input-logo-upload"
                />
                <Upload className="w-6 h-6 text-muted-foreground" />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t">
        <Label className="text-base font-semibold mb-3 block">Student Information Fields</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Select which fields to include on the exam paper
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeStudentName"
              checked={details.includeStudentName}
              onCheckedChange={(checked) => 
                onChange({ ...details, includeStudentName: checked as boolean })
              }
              data-testid="checkbox-student-name"
            />
            <Label htmlFor="includeStudentName" className="font-normal cursor-pointer">
              Student Name
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeDate"
              checked={details.includeDate}
              onCheckedChange={(checked) => 
                onChange({ ...details, includeDate: checked as boolean })
              }
              data-testid="checkbox-date"
            />
            <Label htmlFor="includeDate" className="font-normal cursor-pointer">
              Date
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeSchool"
              checked={details.includeSchool}
              onCheckedChange={(checked) => 
                onChange({ ...details, includeSchool: checked as boolean })
              }
              data-testid="checkbox-school"
            />
            <Label htmlFor="includeSchool" className="font-normal cursor-pointer">
              School
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeTeacher"
              checked={details.includeTeacher}
              onCheckedChange={(checked) => 
                onChange({ ...details, includeTeacher: checked as boolean })
              }
              data-testid="checkbox-teacher"
            />
            <Label htmlFor="includeTeacher" className="font-normal cursor-pointer">
              Teacher
            </Label>
          </div>
        </div>
      </div>
    </Card>
  );
}
