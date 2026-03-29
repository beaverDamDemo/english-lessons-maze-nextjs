'use client';

import { useState } from 'react';
import { useThaiQuestion } from '../_components/useThaiQuestion';
import styles from '../_components/QuizButtons.module.css';

type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
};

const questions: QuizQuestion[] = [
  {
    q: 'Choose the greeting you say in the morning.',
    options: ['Good morning', 'Good night', 'Bye', 'Sorry'],
    answer: 0,
  },
  {
    q: 'Choose the correct response: "How are you?"',
    options: ['I am fine.', 'Blue.', 'Monday.', 'Ten.'],
    answer: 0,
  },
  {
    q: 'Choose the correct sentence.',
    options: [
      'My name is Ana.',
      'My name Ana is.',
      'Name is my Ana.',
      'Is Ana my name.',
    ],
    answer: 0,
  },
  {
    q: 'What is this number: 7?',
    options: ['seven', 'seventeen', 'seventy', 'six'],
    answer: 0,
  },
  {
    q: 'What is this number: 15?',
    options: ['fifty', 'five', 'fifteen', 'fourteen'],
    answer: 2,
  },
  {
    q: 'Choose the correct color word for the sky on a clear day.',
    options: ['blue', 'hot', 'run', 'chair'],
    answer: 0,
  },
  {
    q: 'Choose the opposite of "yes".',
    options: ['hello', 'no', 'name', 'book'],
    answer: 1,
  },
  {
    q: 'Complete the sentence: "I ___ a student."',
    options: ['am', 'is', 'are', 'be'],
    answer: 0,
  },
  {
    q: 'Complete the sentence: "She ___ my friend."',
    options: ['am', 'are', 'is', 'be'],
    answer: 2,
  },
  {
    q: 'Choose the day that comes after Monday.',
    options: ['Sunday', 'Tuesday', 'Friday', 'Saturday'],
    answer: 1,
  },
  {
    q: 'Choose the correct question.',
    options: [
      'What your name is?',
      'What is your name?',
      'Your name what is?',
      'Is what your name?',
    ],
    answer: 1,
  },
  {
    q: 'Choose the correct answer: "Where are you from?"',
    options: [
      'I am from Thailand.',
      'I am 10 years old.',
      'I like pizza.',
      'It is Monday.',
    ],
    answer: 0,
  },
  {
    q: '24-hour time: 14:00 is...',
    options: ['2:00 AM', '2:00 PM', '4:00 PM', '12:00 PM'],
    answer: 1,
  },
  {
    q: '24-hour time: 09:30 is...',
    options: ['9:30 AM', '9:30 PM', '7:30 AM', '10:30 AM'],
    answer: 0,
  },
  {
    q: '24-hour time: 19:45 is...',
    options: ['7:45 AM', '9:45 PM', '7:45 PM', '6:45 PM'],
    answer: 2,
  },
  {
    q: '12-hour time: 8:00 PM in 24-hour format is...',
    options: ['08:00', '18:00', '20:00', '22:00'],
    answer: 2,
  },
  {
    q: '12-hour time: 6:15 AM in 24-hour format is...',
    options: ['06:15', '16:15', '18:15', '12:15'],
    answer: 0,
  },
  {
    q: 'Which one is noon?',
    options: ['12:00 AM', '12:00 PM', '00:00', '11:00 PM'],
    answer: 1,
  },
  {
    q: 'Which one is midnight?',
    options: ['12:00 PM', '12:30 PM', '12:00 AM', '11:59 AM'],
    answer: 2,
  },
  {
    q: '24-hour time: 00:20 is...',
    options: ['12:20 AM', '12:20 PM', '10:20 AM', '2:20 PM'],
    answer: 0,
  },
  {
    q: '24-hour time: 12:10 is...',
    options: ['12:10 AM', '10:12 AM', '12:10 PM', '2:10 PM'],
    answer: 2,
  },
  {
    q: 'Choose the correct sentence about time.',
    options: [
      'I wake up at 7:00 AM.',
      'I wake up at 7:00 PM morning.',
      'I wake up in 7:00 AM.',
      'I wake up 7:00 AM is.',
    ],
    answer: 0,
  },
  {
    q: 'Choose the polite word.',
    options: ['please', 'run', 'blue', 'banana'],
    answer: 0,
  },
  {
    q: 'Complete: "Thank you." "You are ___."',
    options: ['welcome', 'yes', 'morning', 'student'],
    answer: 0,
  },
  {
    q: 'Choose the correct sentence.',
    options: [
      'He is my brother.',
      'He are my brother.',
      'He am my brother.',
      'He my brother is are.',
    ],
    answer: 0,
  },
];

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildBalancedQuestions(
  source: QuizQuestion[],
  count: number,
): QuizQuestion[] {
  const selected = shuffleArray(source).slice(0, count);

  return selected.map((question) => {
    const correctText = question.options[question.answer];
    const wrongOptions = shuffleArray(
      question.options.filter((_, optionIdx) => optionIdx !== question.answer),
    );
    const balancedOptions = [correctText, ...wrongOptions];

    return {
      ...question,
      options: balancedOptions,
      answer: 0,
    };
  });
}

export default function Quiz({
  onComplete,
  primaryColor = '#4CAF50',
}: {
  onComplete: (score: number) => void;
  primaryColor?: string;
}) {
  // Select only 5 random questions from the full question bank
  const [selectedQuestions] = useState(() => {
    return buildBalancedQuestions(questions, 5);
  });

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedbackIcon, setFeedbackIcon] = useState<'✓' | '✗' | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const thaiQuestion = useThaiQuestion(selectedQuestions[current]?.q ?? '');

  function handleAnswer(index: number) {
    if (selectedIndex !== null) return;
    let newScore = score;
    const isCorrect = index === selectedQuestions[current].answer;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }
    setFeedbackIcon(isCorrect ? '✓' : '✗');
    setSelectedIndex(index);
    const nextQuestion = current + 1;

    setTimeout(
      () => {
        setFeedbackIcon(null);
        setSelectedIndex(null);
        if (nextQuestion >= selectedQuestions.length) {
          setFinished(true);
          onComplete(newScore);
        } else {
          setCurrent(nextQuestion);
        }
      },
      isCorrect ? 300 : 800,
    );
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
    <div
      key={current}
      className={styles.questionSlide}
      style={{ padding: '0', position: 'relative' }}
    >
      {feedbackIcon && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '80px',
            fontWeight: 'bold',
            zIndex: 2000,
            animation: 'feedbackFadeOut 0.3s ease-out forwards',
            color: feedbackIcon === '✓' ? '#4CAF50' : '#F44336',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {feedbackIcon}
        </div>
      )}
      <style>{`
        @keyframes feedbackFadeOut {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }
      `}</style>
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px',
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
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{
                backgroundColor: primaryColor,
                width: `${(current / selectedQuestions.length) * 100}%`,
              }}
            />
          </div>
        </div>
        <p
          style={{
            margin: '15px 0',
            fontSize: '18px',
            fontWeight: '500',
            color: '#333',
          }}
        >
          {selectedQuestions[current].q}
        </p>
        <p
          style={{
            margin: '0',
            fontSize: '14px',
            color: '#666',
            lineHeight: 1.45,
          }}
        >
          {thaiQuestion}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        {selectedQuestions[current].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className={`${styles.quizOptionButton} ${
              selectedIndex !== null && i === selectedQuestions[current].answer
                ? styles.quizOptionCorrectFlash
                : ''
            }`}
            style={{
              backgroundColor:
                selectedIndex === null
                  ? primaryColor
                  : i === selectedQuestions[current].answer
                    ? '#4CAF50'
                    : primaryColor,
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
