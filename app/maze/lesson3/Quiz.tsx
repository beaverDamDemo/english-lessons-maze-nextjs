// app/maze/lesson3/Quiz.tsx
'use client';

import { useState } from 'react';

const questions = [
  {
    q: 'What is the opposite of "big"?',
    options: ['huge', 'small', 'large', 'tiny'],
    answer: 1,
  },
  {
    q: 'Which adjective describes a cold day?',
    options: ['warm', 'hot', 'cold', 'freezing'],
    answer: 2,
  },
  {
    q: 'Choose the correct adjective: "That is a _____ idea".',
    options: ['terrible', 'badly', 'terribly', 'worse'],
    answer: 0,
  },
  {
    q: 'What adjective means "very happy"?',
    options: ['sad', 'delighted', 'angry', 'upset'],
    answer: 1,
  },
  {
    q: 'Complete: "The water is too _____".',
    options: ['warm', 'dirty', 'slow', 'quick'],
    answer: 0,
  },
  {
    q: 'Which is an adjective describing speed?',
    options: ['run', 'fast', 'running', 'runs'],
    answer: 1,
  },
  {
    q: 'What word means "not dark"?',
    options: ['dim', 'bright', 'light', 'shadow'],
    answer: 1,
  },
  {
    q: 'Choose the correct adjective: "She wore a _____ dress".',
    options: ['beauty', 'beautiful', 'beauty', 'beautify'],
    answer: 1,
  },
  {
    q: 'Which adjective is opposite to "expensive"?',
    options: ['cheap', 'costly', 'valuable', 'rare'],
    answer: 0,
  },
  {
    q: 'What describes something made of iron?',
    options: ['wooden', 'metallic', 'iron', 'strong'],
    answer: 1,
  },
  {
    q: 'Choose the adjective: "The _____ building is very old".',
    options: ['build', 'building', 'built', 'builds'],
    answer: 1,
  },
  {
    q: 'Which adjective means "without noise"?',
    options: ['loud', 'quiet', 'noisy', 'silent'],
    answer: 2,
  },
  {
    q: 'Complete: "The puzzle is too _____".',
    options: ['easy', 'difficulty', 'difficult', 'difficulties'],
    answer: 2,
  },
  {
    q: 'What adjective describes a soft texture?',
    options: ['hard', 'rough', 'smooth', 'bumpy'],
    answer: 2,
  },
  {
    q: 'Choose correctly: "This is a _____ movie".',
    options: ['bored', 'boring', 'bore', 'bores'],
    answer: 1,
  },
  {
    q: 'Which adjective means "not new"?',
    options: ['ancient', 'young', 'old', 'fresh'],
    answer: 2,
  },
  {
    q: 'What describes something very important?',
    options: ['minor', 'significant', 'small', 'tiny'],
    answer: 1,
  },
  {
    q: 'Complete: "The sky is _____".',
    options: ['dark', 'blue', 'bright', 'clear'],
    answer: 1,
  },
  {
    q: 'Which adjective describes sweetness?',
    options: ['bitter', 'salty', 'sweet', 'sour'],
    answer: 2,
  },
  {
    q: 'What does "elegant" mean?',
    options: ['simple', 'graceful', 'common', 'basic'],
    answer: 1,
  },
];

export default function Quiz({
  onComplete,
  primaryColor = '#4CAF50',
}: {
  onComplete: (score: number) => void;
  primaryColor?: string;
}) {
  const [selectedQuestions] = useState(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  function handleAnswer(index: number) {
    let newScore = score;
    if (index === selectedQuestions[current].answer) {
      newScore = score + 1;
      setScore(newScore);
    }
    const nextQuestion = current + 1;

    if (nextQuestion >= selectedQuestions.length) {
      setFinished(true);
      onComplete(newScore);
    } else {
      setCurrent(nextQuestion);
    }
  }

  if (finished) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2
          style={{
            color: primaryColor,
            fontSize: '24px',
            margin: '0 0 15px 0',
          }}
        >
          Quiz Complete!
        </h2>
        <p style={{ fontSize: '16px', color: '#333', margin: '10px 0' }}>
          You got {score} out of {selectedQuestions.length} correct answers.
        </p>
        <p
          style={{
            fontSize: '16px',
            color: primaryColor,
            margin: '10px 0',
            fontWeight: 'bold',
          }}
        >
          You will have {score} move{score !== 1 ? 's' : ''} to continue the
          maze!
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#666',
            }}
          >
            Question {current + 1} of {selectedQuestions.length}
          </p>
          <div
            style={{
              height: '8px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              width: '100px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: primaryColor,
                width: `${((current + 1) / selectedQuestions.length) * 100}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
        <p
          style={{
            margin: '15px 0',
            fontSize: '16px',
            fontWeight: '500',
            color: '#333',
          }}
        >
          {selectedQuestions[current].q}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        {selectedQuestions[current].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            style={{
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: primaryColor,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.filter = 'brightness(0.9)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
