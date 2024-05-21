import { useEffect, useState } from "react";

import { shuffle } from "./shared/lib/utils";
import { Finish } from "./finish";
import { Layout } from "./shared/ui/layout";
import { Header } from "./shared/ui/header";
import { Spinner } from "./shared/ui/spinner";
import { Button } from "./shared/ui/button";
import { Quiz, QuizStatus } from "./enitites/quiz/model";

interface Question {
  id: string;
  correctOption: number;
  options: string[];
  points: number;
  question: string;
}

function getTotalPoints(questions: Question[]) {
  return questions.reduce((acc, question) => acc + question.points, 0);
}

export function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [status, setStatus] = useState<QuizStatus>(Quiz.LOADING);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  useEffect(() => {
    async function fetchQuestions() {
      const response = await fetch("http://localhost:3000/questions");

      const data = (await response.json()) as Question[];

      setQuestions(shuffle(data));
      setTotalPoints(getTotalPoints(data));
      setSecondsLeft(data.length * 30);
      setStatus(Quiz.STARTING);
    }

    fetchQuestions();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (secondsLeft > 0 && status === Quiz.ACTIVE) {
        setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);

        return;
      }

      if (status === Quiz.ACTIVE) {
        setStatus(Quiz.FINISHED);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft, status]);

  function handleAnswer(index: number) {
    setSelectedIdx(index);

    if (index === questions[currentQuestionIdx].correctOption) {
      setCurrentPoints(
        (prevPoints) => prevPoints + questions[currentQuestionIdx].points,
      );
    }
  }

  function handleNext() {
    const nextIdx = currentQuestionIdx + 1;

    if (nextIdx >= questions.length) {
      setStatus(Quiz.FINISHED);
    } else {
      setCurrentQuestionIdx(nextIdx);
    }

    setSelectedIdx(null);
  }

  function handleRestart() {
    setCurrentQuestionIdx(0);
    setStatus(Quiz.STARTING);
    setCurrentQuestionIdx(0);
    setQuestions((prevQuestions) => shuffle(prevQuestions));
    setCurrentQuestionIdx(0);
    setCurrentPoints(0);
    setSecondsLeft(questions.length * 30);
  }

  return (
    <Layout>
      <Header />
      <div className="max-w-xl mt-10 w-full mx-auto">
        {status === Quiz.STARTING && (
          <div className="flex flex-col gap-10 items-center text-center">
            <h2 className="text-4xl font-bold">
              Welcome to the React Quiz! 👋
            </h2>
            <h3 className="text-3xl">
              <strong>{questions.length}</strong> questions to test your React
              knowledge
            </h3>
            <Button onClick={() => setStatus(Quiz.ACTIVE)}>
              Let's start 🔥
            </Button>
          </div>
        )}
        {status === Quiz.ACTIVE && (
          <>
            <progress
              className="w-full rounded-full"
              max={questions.length}
              value={currentQuestionIdx + 1}
            />
            <div className="flex justify-between">
              <p>
                Question <strong>{currentQuestionIdx + 1}</strong> /{" "}
                {questions.length}
              </p>
              <p>
                <strong>{currentPoints}</strong> / {totalPoints}
              </p>
            </div>
            <p className="text-2xl text-center font-bold my-10">
              {questions[currentQuestionIdx].question}
            </p>
            <div className="flex flex-col gap-4 mt-4">
              {questions[currentQuestionIdx].options.map((option, i) => {
                const answered = selectedIdx !== null;
                const { correctOption } = questions[currentQuestionIdx];

                let bg: string;

                if (answered && i === correctOption) {
                  bg = "bg-blue-700";
                } else if (i !== correctOption && i === selectedIdx) {
                  bg = "bg-pink-700";
                } else {
                  bg = "bg-gray-700";
                }

                return (
                  <button
                    className={`rounded-full py-4 px-6 text-lg ${bg}`}
                    onClick={() => handleAnswer(i)}
                    type="button"
                    disabled={selectedIdx !== null}
                    key={i}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-10">
              <div className="text-lg p-4 rounded-full border-2 border-gray-700">
                {minutes.toString().padStart(2, "0")} :{" "}
                {seconds.toString().padStart(2, "0")}
              </div>

              {selectedIdx !== null && (
                <Button onClick={handleNext}>
                  <strong>
                    {currentQuestionIdx === questions.length - 1
                      ? "Finish 🎉"
                      : "Next"}
                  </strong>
                </Button>
              )}
            </div>
          </>
        )}
        {status === Quiz.FINISHED && (
          <Finish
            points={currentPoints}
            totalPoints={totalPoints}
            onRestart={handleRestart}
          />
        )}
      </div>
      {status === Quiz.FINISHED && <Spinner />}
    </Layout>
  );
}
