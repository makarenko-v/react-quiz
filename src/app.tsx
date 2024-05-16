import { useEffect, useState } from "react";
import { Layout } from "./layout";

import reactLogo from "/react.png";

interface Question {
  id: string;
  correctOption: number;
  options: string[];
  points: number;
  question: string;
}

export function App() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    async function fetchQuestions() {
      const response = await fetch("http://localhost:3000/questions");

      const data = (await response.json()) as Question[];

      setQuestions(data);
    }

    fetchQuestions();
  }, []);

  return (
    <Layout>
      <header className="flex items-center justify-center">
        <img className="w-36 h-30" src={reactLogo} alt="React" />
        <h1 className="uppercase font-bold text-6xl ml-8 bg-gradient-to-r from-blue-500 to-pink-500 text-transparent bg-clip-text">
          The React Quiz
        </h1>
      </header>
      {questions.map(({ question, id }) => (
        <div className="p-4 bg-gray-700 rounded-full mb-4" key={id}>
          <p>{question}</p>
        </div>
      ))}
    </Layout>
  );
}
