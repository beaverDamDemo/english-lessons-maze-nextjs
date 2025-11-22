// app/maze/lesson8/Quiz.tsx
'use client';

import { useState } from 'react';

const questions = [
  {
    q: 'What is a clause?',
    options: [
      'a word',
      'a group of words with subject and verb',
      'a letter',
      'a sound',
    ],
    answer: 1,
  },
  {
    q: 'Which is an independent clause?',
    options: [
      'Although it rained',
      'The sun is bright',
      'While I sleep',
      'Because she left',
    ],
    answer: 1,
  },
  {
    q: 'What is a dependent clause?',
    options: ['a complete sentence', 'a word', 'cannot stand alone', 'a noun'],
    answer: 2,
  },
  {
    q: 'Choose the dependent clause:',
    options: [
      'I like cookies',
      'When I wake up',
      'The sky is blue',
      'He runs fast',
    ],
    answer: 1,
  },
  {
    q: 'What does a relative clause modify?',
    options: ['verb', 'noun', 'adjective', 'adverb'],
    answer: 1,
  },
  {
    q: 'Identify the relative clause: "The book that I read was good".',
    options: ['The book', 'that I read', 'was good', 'I read'],
    answer: 1,
  },
  {
    q: 'Which pronoun introduces a relative clause?',
    options: ['and', 'but', 'who', 'or'],
    answer: 2,
  },
  {
    q: 'What type of clause does "because" introduce?',
    options: ['relative', 'adverbial', 'noun', 'adjective'],
    answer: 1,
  },
  {
    q: 'Choose: "I went home _____ I was tired".',
    options: ['although', 'because', 'which', 'that'],
    answer: 1,
  },
  {
    q: 'What is a conditional clause?',
    options: ['shows time', 'shows condition', 'shows reason', 'shows result'],
    answer: 1,
  },
  {
    q: 'Identify the conditional: "If it rains, we stay inside".',
    options: ['we stay inside', 'If it rains', 'it rains', 'rains'],
    answer: 1,
  },
  {
    q: 'What introduces a noun clause?',
    options: ['that', 'which', 'where', 'when'],
    answer: 0,
  },
  {
    q: 'Choose the noun clause: "What you said was wrong".',
    options: ['What you said', 'was wrong', 'you', 'said'],
    answer: 0,
  },
  {
    q: 'Which clause can replace a noun?',
    options: ['relative', 'noun', 'adverbial', 'temporal'],
    answer: 1,
  },
  {
    q: 'What adverbial clause shows time?',
    options: [
      'If he comes',
      'When the sun rises',
      'So that we know',
      'Although it is late',
    ],
    answer: 1,
  },
  {
    q: 'Identify the type: "Although she was tired".',
    options: ['relative', 'concessive', 'conditional', 'causal'],
    answer: 1,
  },
  {
    q: 'What is a causal clause?',
    options: ['shows time', 'shows reason', 'shows contrast', 'shows result'],
    answer: 1,
  },
  {
    q: 'Choose: "He studied hard _____ he passed".',
    options: ['although', 'so that', 'while', 'if'],
    answer: 1,
  },
  {
    q: 'Which word introduces a purpose clause?',
    options: ['because', 'so that', 'unless', 'if'],
    answer: 1,
  },
  {
    q: 'What connects two independent clauses properly?',
    options: ['comma', 'semicolon or conjunction', 'period', 'nothing'],
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
