'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from './Lesson1.module.css';

type Phase = 'learn' | 'practice' | 'play' | 'apply' | 'done';

type Card = {
  phrase: string;
  meaning: string;
  usage: string;
};

type Challenge = {
  prompt: string;
  options: string[];
  answer: number;
};

const BOARD_SIZE = 6;
const CANDIES = ['🍒', '🍋', '🍇', '🍉', '🍍', '🥥'];
const LESSONS_TOTAL = 8;
const STATS_KEY = 'englishPattayaStats';
const UNLOCKED_KEY = 'englishPattayaUnlockedLessons';
const PENDING_UNLOCK_KEY = 'englishPattayaPendingUnlockLesson';

const learnCards: Card[] = [
  {
    phrase: 'How much is this?',
    meaning: 'How much does this cost?',
    usage: 'Use when asking price politely.',
  },
  {
    phrase: 'Can I get a discount?',
    meaning: 'Can you reduce the price?',
    usage: 'Useful in markets and small shops.',
  },
  {
    phrase: 'I would like this one.',
    meaning: 'I choose this item.',
    usage: 'Use while pointing to an item.',
  },
  {
    phrase: 'Do you have another size?',
    meaning: 'Is a different size available?',
    usage: 'Useful for clothes and shoes.',
  },
];

const practiceChallenges: Challenge[] = [
  {
    prompt: 'You want to ask the price. What should you say?',
    options: [
      'How much is this?',
      'Where is my hotel?',
      'I am very hungry.',
      'Can I take a taxi?',
    ],
    answer: 0,
  },
  {
    prompt: 'You want to ask for cheaper price. Choose the best phrase.',
    options: [
      'I need Wi-Fi.',
      'Can I get a discount?',
      'What time is it?',
      'Where is the beach?',
    ],
    answer: 1,
  },
  {
    prompt: 'You picked the item and want to buy it. Choose the phrase.',
    options: [
      'I would like this one.',
      'Please call the police.',
      'Can you speak slowly?',
      'I forgot my phone.',
    ],
    answer: 0,
  },
];

const applyChallenges: Challenge[] = [
  {
    prompt: 'Shopkeeper: "This shirt is 500 baht." You want smaller size.',
    options: [
      'Do you have another size?',
      'Can I get a discount?',
      'How much is this?',
      'I would like this one.',
    ],
    answer: 0,
  },
  {
    prompt: 'You buy two souvenirs and want to negotiate total price.',
    options: [
      'I would like this one.',
      'How much is this?',
      'Can I get a discount?',
      'Do you have another size?',
    ],
    answer: 2,
  },
];

function randomCandy() {
  return CANDIES[Math.floor(Math.random() * CANDIES.length)];
}

function makeBoard() {
  const board: string[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => randomCandy()),
  );
  return clearAutoMatches(board).board;
}

function cloneBoard(board: string[][]) {
  return board.map((row) => [...row]);
}

function areAdjacent(a: [number, number], b: [number, number]) {
  const dr = Math.abs(a[0] - b[0]);
  const dc = Math.abs(a[1] - b[1]);
  return dr + dc === 1;
}

function detectMatches(board: string[][]): Set<string> {
  const matched = new Set<string>();

  for (let r = 0; r < BOARD_SIZE; r += 1) {
    let c = 0;
    while (c < BOARD_SIZE) {
      const value = board[r][c];
      let end = c + 1;
      while (end < BOARD_SIZE && board[r][end] === value) end += 1;
      if (value && end - c >= 3) {
        for (let k = c; k < end; k += 1) matched.add(`${r}-${k}`);
      }
      c = end;
    }
  }

  for (let c = 0; c < BOARD_SIZE; c += 1) {
    let r = 0;
    while (r < BOARD_SIZE) {
      const value = board[r][c];
      let end = r + 1;
      while (end < BOARD_SIZE && board[end][c] === value) end += 1;
      if (value && end - r >= 3) {
        for (let k = r; k < end; k += 1) matched.add(`${k}-${c}`);
      }
      r = end;
    }
  }

  return matched;
}

function clearAutoMatches(input: string[][]) {
  let board = cloneBoard(input);
  let totalCleared = 0;

  while (true) {
    const matches = detectMatches(board);
    if (matches.size === 0) return { board, cleared: totalCleared };

    totalCleared += matches.size;
    matches.forEach((key) => {
      const [r, c] = key.split('-').map(Number);
      board[r][c] = '';
    });

    for (let c = 0; c < BOARD_SIZE; c += 1) {
      const column: string[] = [];
      for (let r = BOARD_SIZE - 1; r >= 0; r -= 1) {
        if (board[r][c]) column.push(board[r][c]);
      }

      for (let r = BOARD_SIZE - 1, idx = 0; r >= 0; r -= 1, idx += 1) {
        board[r][c] = idx < column.length ? column[idx] : randomCandy();
      }
    }
  }
}

export default function PattayaLesson1Page() {
  const [phase, setPhase] = useState<Phase>('learn');
  const [learnStep, setLearnStep] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);
  const [applyStep, setApplyStep] = useState(0);
  const [feedback, setFeedback] = useState<string>('');

  const [learningCorrect, setLearningCorrect] = useState(0);
  const [learningWrong, setLearningWrong] = useState(0);

  const [board, setBoard] = useState<string[][]>(() => makeBoard());
  const [selectedTile, setSelectedTile] = useState<[number, number] | null>(
    null,
  );
  const [movesLeft, setMovesLeft] = useState(8);
  const [playPoints, setPlayPoints] = useState(0);
  const [playActionText, setPlayActionText] = useState(
    'Match 3+ candies to earn points!',
  );
  const [animatingTiles, setAnimatingTiles] = useState<Set<string>>(new Set());
  const [cascadingTiles, setCascadingTiles] = useState<Set<string>>(new Set());

  const totalLearningTasks = practiceChallenges.length + applyChallenges.length;
  const progressPercent = useMemo(() => {
    const learningUnits =
      learnStep + practiceStep + applyStep + (phase === 'done' ? 1 : 0);
    const totalUnits =
      learnCards.length + totalLearningTasks + 1 + (phase === 'done' ? 1 : 0);
    return Math.min(100, Math.round((learningUnits / totalUnits) * 100));
  }, [learnStep, practiceStep, applyStep, phase, totalLearningTasks]);

  function persistProgress() {
    const attemptsPayload = window.localStorage.getItem(STATS_KEY);
    let previous = {
      correctAnswers: 0,
      wrongAnswers: 0,
      quizAttempts: 0,
      totalMovesEarned: 0,
    };

    if (attemptsPayload) {
      try {
        previous = {
          ...previous,
          ...(JSON.parse(attemptsPayload) as Partial<typeof previous>),
        };
      } catch {
        // Ignore malformed local storage values.
      }
    }

    const earnedMoves = Math.max(1, Math.floor(playPoints / 120));
    const nextStats = {
      correctAnswers: previous.correctAnswers + learningCorrect,
      wrongAnswers: previous.wrongAnswers + learningWrong,
      quizAttempts: previous.quizAttempts + 1,
      totalMovesEarned: previous.totalMovesEarned + earnedMoves,
    };
    window.localStorage.setItem(STATS_KEY, JSON.stringify(nextStats));

    const rawUnlocked = window.localStorage.getItem(UNLOCKED_KEY);
    const unlocked = Number.parseInt(rawUnlocked ?? '1', 10);
    const safeUnlocked = Number.isFinite(unlocked)
      ? Math.min(LESSONS_TOTAL, Math.max(1, unlocked))
      : 1;

    const passed = learningCorrect >= 3;
    if (passed) {
      const nextUnlocked = Math.min(LESSONS_TOTAL, Math.max(safeUnlocked, 2));
      if (nextUnlocked > safeUnlocked) {
        window.localStorage.setItem(PENDING_UNLOCK_KEY, String(nextUnlocked));
      }
      window.localStorage.setItem(UNLOCKED_KEY, String(nextUnlocked));
    }
  }

  function handleChallengeAnswer(challenge: Challenge, pickedIndex: number) {
    const isCorrect = pickedIndex === challenge.answer;
    if (isCorrect) {
      setLearningCorrect((v) => v + 1);
      setFeedback('Nice! Correct answer.');
    } else {
      setLearningWrong((v) => v + 1);
      setFeedback(`Not quite. Correct: ${challenge.options[challenge.answer]}`);
    }

    window.setTimeout(() => {
      setFeedback('');
      if (phase === 'practice') {
        const next = practiceStep + 1;
        if (next >= practiceChallenges.length) {
          setPhase('play');
          return;
        }
        setPracticeStep(next);
        return;
      }

      if (phase === 'apply') {
        const next = applyStep + 1;
        if (next >= applyChallenges.length) {
          persistProgress();
          setPhase('done');
          return;
        }
        setApplyStep(next);
      }
    }, 700);
  }

  function attemptSwap(from: [number, number], to: [number, number]) {
    if (!areAdjacent(from, to) || movesLeft <= 0) {
      setPlayActionText('Pick neighboring candies only.');
      return;
    }

    const draft = cloneBoard(board);
    const [fr, fc] = from;
    const [tr, tc] = to;
    const temp = draft[fr][fc];
    draft[fr][fc] = draft[tr][tc];
    draft[tr][tc] = temp;

    const found = detectMatches(draft);
    if (found.size === 0) {
      setPlayActionText('No match from that move. Try a different swap.');
      setSelectedTile(null);
      return;
    }

    const resolved = clearAutoMatches(draft);
    const gained = resolved.cleared * 10;
    const nextMoves = movesLeft - 1;

    // Mark matched tiles for animation
    const matched = detectMatches(draft);
    setAnimatingTiles(matched);

    // Animate matched tiles then cascade
    window.setTimeout(() => {
      setBoard(resolved.board);
      // Mark tiles that are falling as cascading
      const cascading = new Set<string>();
      for (let c = 0; c < BOARD_SIZE; c += 1) {
        for (let r = BOARD_SIZE - 1; r >= 0; r -= 1) {
          if (resolved.board[r][c]) {
            cascading.add(`${r}-${c}`);
          }
        }
      }
      setCascadingTiles(cascading);
      setAnimatingTiles(new Set());
    }, 400);

    window.setTimeout(() => {
      setMovesLeft(nextMoves);
      setPlayPoints((v) => v + gained);
      setPlayActionText(`Great! +${gained} points. ${nextMoves} moves left.`);
      setCascadingTiles(new Set());
      setSelectedTile(null);

      if (nextMoves === 0) {
        window.setTimeout(() => {
          setPhase('apply');
        }, 450);
      }
    }, 700);
  }

  function onTileClick(r: number, c: number) {
    if (phase !== 'play') return;
    if (!selectedTile) {
      setSelectedTile([r, c]);
      setPlayActionText('Select a second tile to swap.');
      return;
    }
    attemptSwap(selectedTile, [r, c]);
  }

  const currentLearn = learnCards[learnStep];
  const currentPractice = practiceChallenges[practiceStep];
  const currentApply = applyChallenges[applyStep];
  const totalSessionScore = learningCorrect * 100 + playPoints;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Pattaya Lesson 1: Market Match</h1>
            <p className={styles.subtitle}>
              Hybrid loop: 70% learning + 30% match-3 gameplay.
            </p>
          </div>
          <Link href="/pattaya-games" className={styles.headerHomeLink}>
            <Image
              src="/assets/back.png"
              alt="Back to Map"
              width={34}
              height={34}
              className={styles.homeLinkImg}
            />
          </Link>
        </div>

        <section className={styles.panel}>
          <div className={styles.statsRow}>
            <div className={styles.stat}>Phase: {phase.toUpperCase()}</div>
            <div className={styles.stat}>
              Learning Correct: {learningCorrect}
            </div>
            <div className={styles.stat}>Learning Wrong: {learningWrong}</div>
            <div className={styles.stat}>Play Points: {playPoints}</div>
          </div>

          <div className={styles.progress}>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {phase === 'learn' && (
            <article className={styles.card}>
              <span className={styles.phaseBadge}>LEARN</span>
              <h2 className={styles.prompt}>{currentLearn.phrase}</h2>
              <p className={styles.help}>{currentLearn.meaning}</p>
              <p className={styles.help}>{currentLearn.usage}</p>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => {
                  const next = learnStep + 1;
                  if (next >= learnCards.length) {
                    setPhase('practice');
                    return;
                  }
                  setLearnStep(next);
                }}
              >
                {learnStep + 1 >= learnCards.length
                  ? 'Start Practice'
                  : 'Next Learning Card'}
              </button>
            </article>
          )}

          {phase === 'practice' && (
            <article className={styles.card}>
              <span className={styles.phaseBadge}>PRACTICE</span>
              <h2 className={styles.prompt}>{currentPractice.prompt}</h2>
              <div className={styles.optionGrid}>
                {currentPractice.options.map((option, idx) => (
                  <button
                    key={`${option}-${idx}`}
                    type="button"
                    className={styles.optionButton}
                    onClick={() => handleChallengeAnswer(currentPractice, idx)}
                    disabled={Boolean(feedback)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {feedback && (
                <p
                  className={
                    feedback.startsWith('Nice')
                      ? styles.resultGood
                      : styles.resultBad
                  }
                >
                  {feedback}
                </p>
              )}
            </article>
          )}

          {phase === 'play' && (
            <article className={styles.card}>
              <span className={styles.phaseBadge}>PLAY</span>
              <h2 className={styles.prompt}>
                Match 3+ candies in 8 moves ({movesLeft} moves left)
              </h2>
              <div className={styles.boardWrap}>
                <div className={styles.board}>
                  {board.map((row, r) =>
                    row.map((tile, c) => {
                      const isSelected =
                        selectedTile?.[0] === r && selectedTile?.[1] === c;
                      const tileKey = `${r}-${c}`;
                      const isMatched = animatingTiles.has(tileKey);
                      const isCascading = cascadingTiles.has(tileKey);
                      return (
                        <button
                          key={tileKey}
                          type="button"
                          className={`${styles.tile} ${
                            isSelected ? styles.selectedTile : ''
                          } ${isMatched ? styles.tileMatched : ''} ${
                            isCascading ? styles.tileCascade : ''
                          }`}
                          onClick={() => onTileClick(r, c)}
                          disabled={isMatched || isCascading}
                        >
                          {tile}
                        </button>
                      );
                    }),
                  )}
                </div>
                <p className={styles.swapHint}>{playActionText}</p>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    setBoard(makeBoard());
                    setSelectedTile(null);
                    setPlayActionText('Board refreshed. Keep matching.');
                  }}
                  disabled={movesLeft === 0}
                >
                  Shuffle Board
                </button>
              </div>
            </article>
          )}

          {phase === 'apply' && (
            <article className={styles.card}>
              <span className={styles.phaseBadge}>APPLY</span>
              <h2 className={styles.prompt}>{currentApply.prompt}</h2>
              <div className={styles.optionGrid}>
                {currentApply.options.map((option, idx) => (
                  <button
                    key={`${option}-${idx}`}
                    type="button"
                    className={styles.optionButton}
                    onClick={() => handleChallengeAnswer(currentApply, idx)}
                    disabled={Boolean(feedback)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {feedback && (
                <p
                  className={
                    feedback.startsWith('Nice')
                      ? styles.resultGood
                      : styles.resultBad
                  }
                >
                  {feedback}
                </p>
              )}
            </article>
          )}

          {phase === 'done' && (
            <article className={styles.card}>
              <span className={styles.phaseBadge}>COMPLETE</span>
              <h2 className={styles.prompt}>Lesson 1 Complete</h2>
              <p className={styles.help}>
                Learning accuracy: {learningCorrect}/
                {practiceChallenges.length + applyChallenges.length}
              </p>
              <p className={styles.help}>Play points: {playPoints}</p>
              <p className={styles.help}>Total score: {totalSessionScore}</p>
              <div className={styles.footerButtons}>
                <Link href="/pattaya-games" className={styles.footerLink}>
                  <Image
                    src="/assets/back.png"
                    alt="Return to Map"
                    width={28}
                    height={28}
                  />
                  Return
                </Link>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => window.location.reload()}
                >
                  Replay Lesson
                </button>
              </div>
            </article>
          )}
        </section>
      </div>
    </main>
  );
}
