// app/maze/lesson7/Quiz.tsx
'use client';

import { useState } from 'react';

const questions = [
  {
    q: 'What is an adverb?',
    options: ['a person', 'describes an action', 'a noun', 'a place'],
    answer: 1,
  },
  {
    q: 'Which word is an adverb?',
    options: ['happy', 'quickly', 'run', 'cat'],
    answer: 1,
  },
  {
    q: 'Choose the adverb: "She sings _____".',
    options: ['beautiful', 'beautifully', 'beauty', 'beautify'],
    answer: 1,
  },
  {
    q: 'How do you form an adverb from "quick"?',
    options: ['quickily', 'quickly', 'quicky', 'quicklly'],
    answer: 1,
  },
  {
    q: 'Which adverb modifies a verb?',
    options: ['very', 'yesterday', 'slowly', 'carefully'],
    answer: 2,
  },
  {
    q: 'Complete: "He speaks English _____".',
    options: ['fluent', 'fluently', 'fluence', 'fluencies'],
    answer: 1,
  },
  {
    q: 'What type of adverb is "never"?',
    options: ['manner', 'frequency', 'place', 'time'],
    answer: 1,
  },
  {
    q: 'Choose the adverb of manner:',
    options: ['tomorrow', 'here', 'carefully', 'always'],
    answer: 2,
  },
  {
    q: 'Which adverb answers "how"?',
    options: ['yesterday', 'there', 'quickly', 'soon'],
    answer: 2,
  },
  {
    q: 'Complete: "I _____ see such beauty".',
    options: ['rarely', 'rare', 'rarity', 'rarefied'],
    answer: 0,
  },
  {
    q: 'What adverb means "not ever"?',
    options: ['often', 'seldom', 'never', 'always'],
    answer: 2,
  },
  {
    q: 'Choose: "She dances _____".',
    options: ['graceful', 'gracefully', 'grace', 'gracious'],
    answer: 1,
  },
  {
    q: 'Which is an adverb of time?',
    options: ['carefully', 'today', 'slowly', 'softly'],
    answer: 1,
  },
  {
    q: 'Complete: "He arrived _____ at the party".',
    options: ['late', 'lately', 'later', 'last'],
    answer: 0,
  },
  {
    q: 'What adverb means "in most cases"?',
    options: ['rarely', 'usually', 'seldom', 'hardly'],
    answer: 1,
  },
  {
    q: 'Choose the adverb: "The car is moving _____".',
    options: ['fast', 'fastly', 'faster', 'fastest'],
    answer: 0,
  },
  {
    q: 'Which adverb answers "where"?',
    options: ['slowly', 'yesterday', 'there', 'sometimes'],
    answer: 2,
  },
  {
    q: 'Complete: "They work together _____".',
    options: ['harmonious', 'harmoniously', 'harmony', 'harmonies'],
    answer: 1,
  },
  {
    q: 'What adverb is the opposite of "always"?',
    options: ['often', 'never', 'seldom', 'sometimes'],
    answer: 1,
  },
  {
    q: 'Choose: "She _____ laughs at jokes".',
    options: ['loud', 'loudly', 'louder', 'loudest'],
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
