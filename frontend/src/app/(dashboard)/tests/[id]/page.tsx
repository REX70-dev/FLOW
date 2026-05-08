"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export default function TestsViewerPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock data from the LLM Test Generation API
  const questions = [
    {
      id: 1,
      type: "MCQ",
      content: "Where do the light-dependent reactions of photosynthesis take place?",
      options: ["Stroma", "Thylakoid membrane", "Mitochondria", "Nucleus"],
      correct_answer: "Thylakoid membrane"
    },
    {
      id: 2,
      type: "MCQ",
      content: "What is the primary pigment involved in photosynthesis?",
      options: ["Chlorophyll b", "Carotenoids", "Chlorophyll a", "Xanthophyll"],
      correct_answer: "Chlorophyll a"
    }
  ];

  const q = questions[currentQuestion];

  const handleSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Assessment: Photosynthesis</h1>
        <span className="text-gray-500 font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <Card className="w-full shadow-lg border-2 border-gray-100 dark:border-gray-800">
        <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b pb-6">
          <CardTitle className="text-2xl leading-relaxed">
            {q.content}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {q.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === q.correct_answer;
              
              let style = "border-gray-200 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-blue-900/20";
              
              if (isSubmitted) {
                if (isCorrect) style = "border-green-500 bg-green-50 dark:bg-green-900/20";
                else if (isSelected && !isCorrect) style = "border-red-500 bg-red-50 dark:bg-red-900/20";
                else style = "opacity-50 border-gray-200 dark:border-gray-800";
              } else if (isSelected) {
                style = "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-900";
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(option)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${style}`}
                >
                  <span className="text-lg font-medium">{option}</span>
                  {isSubmitted && isCorrect && <CheckCircle2 className="text-green-500 w-6 h-6" />}
                  {isSubmitted && isSelected && !isCorrect && <XCircle className="text-red-500 w-6 h-6" />}
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50/50 dark:bg-gray-900/50 border-t p-6 flex justify-end">
          {!isSubmitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedOption}
              className="px-8 text-lg"
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              disabled={currentQuestion === questions.length - 1}
              className="px-8 text-lg gap-2"
            >
              Next Question <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
