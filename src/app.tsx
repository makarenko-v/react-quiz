import { useEffect, useState } from "react";
import { Layout } from "./layout";

import reactLogo from "/react.png";
import { shuffle } from "../utils";
import { Finish } from "./finish";

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

type QuizStatus = "active" | "finished" | "starting";

export function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [status, setStatus] = useState<QuizStatus>("starting");

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/questions");

      const data = (await response.json()) as Question[];

      setQuestions(shuffle(data));
      setIsLoading(false);
      setTotalPoints(getTotalPoints(data));
      setSecondsLeft(data.length);
      setStatus("starting");
    }

    fetchQuestions();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (secondsLeft > 0 && status === "active") {
        setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);

        return;
      }

      if (status === "active") {
        setStatus("finished");
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
      setStatus("finished");
    } else {
      setCurrentQuestionIdx(nextIdx);
    }

    setSelectedIdx(null);
  }

  function handleRestart() {
    setCurrentQuestionIdx(0);
    setStatus("starting");
    setCurrentQuestionIdx(0);
    setQuestions((prevQuestions) => shuffle(prevQuestions));
  }

  return (
    <Layout>
      <header className="flex items-center justify-center">
        <img className="w-36 h-30" src={reactLogo} alt="React" />
        <h1 className="uppercase font-bold text-6xl ml-8 bg-gradient-to-r from-blue-500 to-pink-500 text-transparent bg-clip-text">
          The React Quiz
        </h1>
      </header>
      <div className="max-w-xl mt-10 w-full mx-auto">
        {status === "starting" && (
          <div className="flex flex-col gap-10 items-center text-center">
            <h2 className="text-4xl font-bold">
              Welcome to the React Quiz! 👋
            </h2>
            <h3 className="text-3xl">
              <strong>{questions.length}</strong> questions to test your React
              knowledge
            </h3>
            <button
              className="text-lg py-4 px-8 rounded-full border-2 border-gray-700 hover:bg-gray-700"
              type="button"
              onClick={() => setStatus("active")}
            >
              Let's start 🔥
            </button>
          </div>
        )}
        {status === "active" && (
          <>
            <progress
              className="w-full rounded-full"
              max={questions.length}
              value={currentQuestionIdx + 1}
            />
            <div className="flex justify-between">
              <p>
                Question <strong>{currentQuestionIdx + 1}</strong> /
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

                const correct =
                  answered && i === correctOption ? "bg-blue-700" : "";

                const wrong =
                  i !== correctOption && i === selectedIdx ? "bg-pink-700" : "";

                return (
                  <button
                    className={`bg-gray-700 rounded-full py-4 px-6 text-lg ${correct} ${wrong}`}
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
                <button
                  className="text-lg py-4 px-8 rounded-full border-2 border-gray-700 hover:bg-gray-700"
                  onClick={handleNext}
                  type="button"
                >
                  <strong>
                    {currentQuestionIdx === questions.length - 1
                      ? "Finish 🎉"
                      : "Next"}
                  </strong>
                </button>
              )}
            </div>
          </>
        )}
        {status === "finished" && (
          <Finish
            points={currentPoints}
            totalPoints={totalPoints}
            onRestart={handleRestart}
          />
        )}
      </div>
      <div className="flex flex-col gap-4">
        {isLoading && <p>loading...</p>}
      </div>
    </Layout>
  );
}
