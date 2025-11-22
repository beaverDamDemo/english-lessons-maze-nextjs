// app/maze/lesson1/Quiz.tsx
'use client';

import { useState } from 'react';

const questions = [
  {
    q: 'Choose the correct pronoun: ___ am happy.',
    options: ['I', 'He', 'She', 'They'],
    answer: 0,
  },
  {
    q: 'Choose the correct pronoun: ___ is tall.',
    options: ['I', 'He', 'They', 'We'],
    answer: 1,
  },
  {
    q: 'Choose the correct pronoun: ___ are friends.',
    options: ['He', 'She', 'They', 'I'],
    answer: 2,
  },
  {
    q: 'Choose the correct pronoun: ___ is my sister.',
    options: ['She', 'They', 'We', 'He'],
    answer: 0,
  },
  {
    q: 'Choose the correct pronoun: ___ am a student.',
    options: ['He', 'She', 'I', 'They'],
    answer: 2,
  },
];

export default function Quiz({
  onScore,
}: {
  onScore: (points: number) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  function handleAnswer(index: number) {
    if (index === questions[current].answer) {
      setScore(score + 1);
      onScore(1); // give one movement credit
    }
    setCurrent(current + 1);
  }

  if (current >= questions.length) {
    return <div>Lesson complete! You earned {score} points.</div>;
  }

  return (
    <div>
      <p>{questions[current].q}</p>
      {questions[current].options.map((opt, i) => (
        <button key={i} onClick={() => handleAnswer(i)}>
          {opt}
        </button>
      ))}
    </div>
  );
}
