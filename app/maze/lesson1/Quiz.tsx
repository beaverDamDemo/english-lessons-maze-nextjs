// app/maze/lesson1/Quiz.tsx
'use client';

import { useState } from 'react';

const questions = [
  // Original 5 pronoun questions
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

  // Additional pronoun questions (5-14)
  {
    q: 'What pronoun would you use for yourself? ___ like to read.',
    options: ['He', 'We', 'I', 'She'],
    answer: 2,
  },
  {
    q: 'Choose the correct pronoun: ___ are going to the park.',
    options: ['I', 'We', 'He', 'She'],
    answer: 1,
  },
  {
    q: 'What pronoun refers to a single female? ___ runs fast.',
    options: ['He', 'She', 'They', 'I'],
    answer: 1,
  },
  {
    q: 'Choose the correct pronoun: ___ is an engineer.',
    options: ['We', 'They', 'He', 'I'],
    answer: 2,
  },
  {
    q: 'What pronoun refers to multiple people? ___ all speak English.',
    options: ['She', 'He', 'They', 'I'],
    answer: 2,
  },
  {
    q: 'Choose the correct pronoun: ___ have two dogs.',
    options: ['He', 'She', 'We', 'It'],
    answer: 2,
  },
  {
    q: 'What pronoun would you use with "you and me"? ___ are friends.',
    options: ['He', 'I', 'We', 'She'],
    answer: 2,
  },
  {
    q: 'Choose the correct pronoun: ___ plays basketball.',
    options: ['They', 'We', 'He', 'I'],
    answer: 2,
  },
  {
    q: 'What pronoun would replace "John"? ___ is tall.',
    options: ['She', 'They', 'He', 'I'],
    answer: 2,
  },
  {
    q: 'Choose the correct pronoun: ___ am going to school.',
    options: ['We', 'He', 'I', 'She'],
    answer: 2,
  },

  // Verb conjugation questions (15-24)
  {
    q: 'Choose the correct verb: I ___ to the store.',
    options: ['go', 'goes', 'going', 'gone'],
    answer: 0,
  },
  {
    q: 'Choose the correct verb: He ___ a book.',
    options: ['read', 'reads', 'reading', 'have read'],
    answer: 1,
  },
  {
    q: 'Choose the correct verb: They ___ happy.',
    options: ['am', 'is', 'are', 'be'],
    answer: 2,
  },
  {
    q: 'Choose the correct verb: She ___ a teacher.',
    options: ['are', 'be', 'is', 'being'],
    answer: 2,
  },
  {
    q: 'Choose the correct verb: We ___ to play tennis.',
    options: ['likes', 'like', 'am liking', 'likes'],
    answer: 1,
  },
  {
    q: 'Choose the correct verb: It ___ hot today.',
    options: ['are', 'is', 'am', 'being'],
    answer: 1,
  },
  {
    q: 'Choose the correct verb: I ___ a student.',
    options: ['is', 'are', 'am', 'be'],
    answer: 2,
  },
  {
    q: 'Choose the correct verb: You ___ from England.',
    options: ['am', 'is', 'are', 'be'],
    answer: 2,
  },
  {
    q: 'Choose the correct verb: They ___ to eat pizza.',
    options: ['likes', 'like', 'am liking', 'is liking'],
    answer: 1,
  },
  {
    q: 'Choose the correct verb: She ___ a beautiful dress.',
    options: ['have', 'has', 'having', 'have got'],
    answer: 1,
  },

  // Easy debug questions with obvious answers (25-45)
  {
    q: 'Lorem ipsum dolor sit amet. What is the correct answer?',
    options: ['Correct', 'Wrong', 'Wrong', 'Wrong'],
    answer: 0,
  },
  {
    q: 'Consectetur adipiscing elit. Which one is right?',
    options: ['Wrong', 'Correct', 'Wrong', 'Wrong'],
    answer: 1,
  },
  {
    q: 'Sed do eiusmod tempor. Pick the right one.',
    options: ['Wrong', 'Wrong', 'Correct', 'Wrong'],
    answer: 2,
  },
  {
    q: 'Incididunt ut labore et dolore. What should you pick?',
    options: ['Wrong', 'Wrong', 'Wrong', 'Correct'],
    answer: 3,
  },
  {
    q: 'Magna aliqua ut enim. Where is the answer?',
    options: ['Correct', 'Wrong', 'Wrong', 'Wrong'],
    answer: 0,
  },
  {
    q: 'Ad minim veniam quis. Find the correct one.',
    options: ['Wrong', 'Correct', 'Wrong', 'Wrong'],
    answer: 1,
  },
  {
    q: 'Nostrud exercitation ullamco. Pick the right choice.',
    options: ['Wrong', 'Wrong', 'Correct', 'Wrong'],
    answer: 2,
  },
  {
    q: 'Laboris nisi ut aliquip. Select the answer.',
    options: ['Wrong', 'Wrong', 'Wrong', 'Correct'],
    answer: 3,
  },
  {
    q: 'Ex ea commodo consequat. Which is correct?',
    options: ['Correct', 'Wrong', 'Wrong', 'Wrong'],
    answer: 0,
  },
  {
    q: 'Duis aute irure dolor. Pick this one.',
    options: ['Wrong', 'Correct', 'Wrong', 'Wrong'],
    answer: 1,
  },
  {
    q: 'In reprehenderit in voluptate. Choose wisely.',
    options: ['Wrong', 'Wrong', 'Correct', 'Wrong'],
    answer: 2,
  },
  {
    q: 'Velit esse cillum dolore. What is the answer?',
    options: ['Wrong', 'Wrong', 'Wrong', 'Correct'],
    answer: 3,
  },
  {
    q: 'Eu fugiat nulla pariatur. Can you find it?',
    options: ['Correct', 'Wrong', 'Wrong', 'Wrong'],
    answer: 0,
  },
  {
    q: 'Excepteur sint occaecat cupidatat non. Pick correctly.',
    options: ['Wrong', 'Correct', 'Wrong', 'Wrong'],
    answer: 1,
  },
  {
    q: 'Proident sunt in culpa qui officia. Make your choice.',
    options: ['Wrong', 'Wrong', 'Correct', 'Wrong'],
    answer: 2,
  },
  {
    q: 'Deserunt mollit anim id est laborum. What is right?',
    options: ['Wrong', 'Wrong', 'Wrong', 'Correct'],
    answer: 3,
  },
  {
    q: 'Sed ut perspiciatis unde omnis iste. Pick the answer.',
    options: ['Correct', 'Wrong', 'Wrong', 'Wrong'],
    answer: 0,
  },
  {
    q: 'Natus error sit voluptatem accusantium. Choose one.',
    options: ['Wrong', 'Correct', 'Wrong', 'Wrong'],
    answer: 1,
  },
  {
    q: 'Doloremque laudantium totam rem aperiam. Which one?',
    options: ['Wrong', 'Wrong', 'Correct', 'Wrong'],
    answer: 2,
  },
  {
    q: 'Eaque ipsa quae ab illo inventore. Pick this.',
    options: ['Wrong', 'Wrong', 'Wrong', 'Correct'],
    answer: 3,
  },
  {
    q: 'Veritatis et quasi architecto beatae vitae. Got it?',
    options: ['Correct', 'Wrong', 'Wrong', 'Wrong'],
    answer: 0,
  },
];

export default function Quiz({
  onComplete,
}: {
  onComplete: (score: number) => void;
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
        <h2>Quiz Complete!</h2>
        <p>
          You got {score} out of {selectedQuestions.length} correct answers.
        </p>
        <p>
          You will have {score} move{score !== 1 ? 's' : ''} available in the
          maze.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <p>
        <strong>
          Question {current + 1} of {selectedQuestions.length}
        </strong>
      </p>
      <p>{selectedQuestions[current].q}</p>
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        {selectedQuestions[current].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            style={{ padding: '10px' }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
