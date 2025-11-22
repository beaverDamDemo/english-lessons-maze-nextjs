// app/maze/lesson2/Quiz.tsx
'use client';

import { useState } from 'react';

const questions = [
  {
    q: 'Which verb form is correct: "She _____ to the store every day"?',
    options: ['go', 'goes', 'going', 'gone'],
    answer: 1,
  },
  {
    q: 'Choose the correct option: "They _____ been here for 3 hours".',
    options: ['has', 'have', 'had', 'having'],
    answer: 1,
  },
  {
    q: 'What is the past tense of "eat"?',
    options: ['eats', 'eating', 'ate', 'eaten'],
    answer: 2,
  },
  {
    q: 'Complete: "I _____ my homework yesterday".',
    options: ['do', 'does', 'did', 'done'],
    answer: 2,
  },
  {
    q: 'Which is correct: "He _____ to work every morning"?',
    options: ['walk', 'walks', 'walking', 'walked'],
    answer: 1,
  },
  {
    q: 'Select the right form: "We _____ never seen that movie".',
    options: ['has', 'have', 'had', 'do'],
    answer: 1,
  },
  {
    q: 'What is the present continuous form of "read"?',
    options: ['read', 'reads', 'reading', 'readed'],
    answer: 2,
  },
  {
    q: 'Choose correctly: "She _____ studying for the exam".',
    options: ['are', 'is', 'am', 'be'],
    answer: 1,
  },
  {
    q: 'Which verb tense is used: "I _____ worked here for 5 years"?',
    options: ['have', 'has', 'am', 'is'],
    answer: 0,
  },
  {
    q: 'Complete: "They _____ arrive tomorrow afternoon".',
    options: ['will', 'would', 'are', 'have'],
    answer: 0,
  },
  {
    q: 'What is the past participle of "break"?',
    options: ['broke', 'breaking', 'broken', 'breaks'],
    answer: 2,
  },
  {
    q: 'Select the correct form: "He _____ been absent all week".',
    options: ['has', 'have', 'is', 'are'],
    answer: 0,
  },
  {
    q: 'Which is grammatically correct: "The children _____ playing"?',
    options: ['is', 'are', 'am', 'be'],
    answer: 1,
  },
  {
    q: 'Complete: "I _____ my keys this morning".',
    options: ['lose', 'lost', 'losing', 'loses'],
    answer: 1,
  },
  {
    q: 'Choose the right form: "She _____ write three letters today".',
    options: ['will', 'would', 'is', 'shall'],
    answer: 0,
  },
  {
    q: 'What does "He has gone to the store" indicate?',
    options: ['Present', 'Past', 'Present Perfect', 'Future'],
    answer: 2,
  },
  {
    q: 'Select correctly: "They _____ been working since morning".',
    options: ['has', 'have', 'is', 'are'],
    answer: 1,
  },
  {
    q: 'Which form is correct: "You _____ understand this lesson"?',
    options: ['will', 'would', 'shall', 'should'],
    answer: 3,
  },
  {
    q: 'Complete: "We _____ seen that movie twice".',
    options: ['have', 'has', 'had', 'do'],
    answer: 0,
  },
  {
    q: 'What is the gerund form of "teach"?',
    options: ['taught', 'teaching', 'teaches', 'teach'],
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
  // Select only 5 random questions from the full question bank
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
