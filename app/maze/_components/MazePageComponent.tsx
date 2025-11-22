'use client';

import { useEffect, useState, useRef } from 'react';
import * as Phaser from 'phaser';
import MazeHeader from './MazeHeader';
import dynamic from 'next/dynamic';
import type { FC } from 'react';

interface MazePageProps {
  MazeScene: any;
  Quiz: any;
  lessonNumber: number;
  lessonTitle: string;
  themeColor: string;
  themeColorDark: string;
  backgroundGradient: string;
}

const MazePageComponent: FC<MazePageProps> = ({
  MazeScene,
  Quiz,
  lessonNumber,
  lessonTitle,
  themeColor,
  themeColorDark,
  backgroundGradient,
}) => {
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [maxMoves, setMaxMoves] = useState(0);
  const [showQuizOverlay, setShowQuizOverlay] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [scale, setScale] = useState(1);
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleQuizComplete = (finalScore: number) => {
    setMaxMoves(finalScore);
    setQuizComplete(true);
    // fade out the overlay, then unmount it
    setOverlayVisible(false);
    setTimeout(() => setShowQuizOverlay(false), 300);
    // Add moves to the existing scene instead of reloading
    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene('MazeScene') as any;
      if (scene && scene.addMoreMovesToScene) {
        scene.addMoreMovesToScene(finalScore);
      }
    }
  };

  const handleNoMoves = () => {
    setShowQuizOverlay(true);
    // mount then fade in
    setTimeout(() => setOverlayVisible(true), 20);
  };

  const handleWin = () => {
    setGameWon(true);
  };

  // Calculate scale to fit content to screen
  useEffect(() => {
    const calculateScale = () => {
      const baseWidth = 1200; // Reference width
      const baseHeight = 800; // Reference height
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const scaleByWidth = windowWidth / baseWidth;
      const scaleByHeight = windowHeight / baseHeight;

      const newScale = Math.min(scaleByWidth, scaleByHeight);
      setScale(Math.max(newScale, 0.5)); // Minimum 50% scale
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // Initialize the Phaser game on mount so the maze is visible behind the quiz.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 504,
      height: 720,
      backgroundColor: '#228B22',
      scene: MazeScene,
      parent: 'game',
      physics: { default: 'arcade', arcade: { debug: false } },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;
    // Set initial registry values and callbacks
    game.registry.set('maxMoves', maxMoves);
    game.registry.set('onNoMoves', handleNoMoves);
    game.registry.set('onWin', handleWin);

    // When the scene has been created, show the quiz overlay after 0.5s
    // so the maze is visible briefly before the quiz fades in.
    const tryShowOverlay = () => {
      // Wait 500ms showing the maze, then mount the overlay and fade it in
      setTimeout(() => {
        setShowQuizOverlay(true);
        // next tick: trigger CSS fade-in
        setTimeout(() => setOverlayVisible(true), 20);
      }, 500);
    };

    // If the scene is available, listen for its 'create' event; otherwise fall back to a short delay.
    try {
      const scene = game.scene.getScene('MazeScene') as any;
      if (scene && scene.events && typeof scene.events.once === 'function') {
        scene.events.once('create', tryShowOverlay);
      } else {
        tryShowOverlay();
      }
    } catch (e) {
      tryShowOverlay();
    }

    return () => {
      // Clean up game on unmount or when the component is torn down
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep registry's maxMoves in sync when it changes (useful if scene reads it).
  useEffect(() => {
    if (gameRef.current) {
      try {
        gameRef.current.registry.set('maxMoves', maxMoves);
      } catch (e) {
        // ignore
      }
    }
  }, [maxMoves]);

  if (gameWon) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
          backgroundColor: '#f0f0f0',
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            display: 'flex',
            flexDirection: 'column',
            width: '1200px',
            height: '800px',
          }}
        >
          <MazeHeader score={score} />
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              flexDirection: 'column',
              background: backgroundGradient,
            }}
          >
            <div
              style={{
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                padding: '50px 40px',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                border: `3px solid ${themeColor}`,
                maxWidth: '500px',
              }}
            >
              <h1
                style={{
                  fontSize: '48px',
                  color: themeColor,
                  margin: '0 0 20px 0',
                }}
              >
                🎉 Congratulations! 🎉
              </h1>
              <p style={{ fontSize: '20px', color: '#333', margin: '10px 0' }}>
                You successfully completed the maze!
              </p>
              <p
                style={{
                  fontSize: '16px',
                  color: '#666',
                  margin: '20px 0 30px 0',
                }}
              >
                Great job navigating through the challenges. You're making
                excellent progress in mastering English!
              </p>
              <a
                href="/maze"
                style={{
                  display: 'inline-block',
                  padding: '15px 40px',
                  backgroundColor: themeColor,
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.backgroundColor = themeColorDark;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 16px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.backgroundColor = themeColor;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
              >
                Return to Map
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        backgroundColor: '#f0f0f0',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '800px',
          position: 'relative',
        }}
      >
        <MazeHeader score={score} />

        <div style={{ flex: 1, position: 'relative' }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <div id="game"></div>
          </div>

          {/* Quiz Overlay */}
          {showQuizOverlay && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '20px',
                backdropFilter: 'blur(4px)',
                // Fade via opacity transition controlled by overlayVisible
                opacity: overlayVisible ? 1 : 0,
                transition: 'opacity 300ms ease',
                pointerEvents: overlayVisible ? 'auto' : 'none',
              }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '35px',
                  borderRadius: '16px',
                  maxWidth: '520px',
                  maxHeight: '85vh',
                  overflowY: 'auto',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                  border: `3px solid ${themeColor}`,
                }}
              >
                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: '10px',
                    color: themeColor,
                    fontSize: '28px',
                    fontWeight: 'bold',
                  }}
                >
                  Complete the Quiz
                </h2>
                <p
                  style={{
                    color: '#666',
                    marginBottom: '25px',
                    fontSize: '15px',
                    lineHeight: '1.5',
                  }}
                >
                  Answer 5 questions correctly to earn more moves and continue
                  Lesson {lessonNumber}.
                </p>
                <Quiz
                  onComplete={handleQuizComplete}
                  primaryColor={themeColor}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MazePageComponent), {
  ssr: false,
});
