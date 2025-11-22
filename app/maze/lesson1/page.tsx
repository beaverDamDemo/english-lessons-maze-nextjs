'use client';

import { useEffect, useState, useRef } from 'react';
import * as Phaser from 'phaser';
import MazeHeader from '../_components/MazeHeader';
import Quiz from './Quiz';
import dynamic from 'next/dynamic';
import type { FC } from 'react';

class MazeScene extends Phaser.Scene {
  // Declare all the fields you use
  gridX!: number;
  gridY!: number;
  goalX!: number;
  goalY!: number;
  tileSize!: number;
  walkSpeed!: number;
  movesRemaining!: number;
  maxMoves!: number;
  onNoMoves!: () => void;
  onWin!: () => void;
  addMoreMoves!: (moves: number) => void;

  maze!: number[][]; // 2D array for maze grid
  player!: Phaser.GameObjects.Sprite;
  goal!: Phaser.GameObjects.Sprite;
  winText!: Phaser.GameObjects.Text;
  movesText!: Phaser.GameObjects.Text;

  enemies!: Phaser.Physics.Arcade.Group;
  bullets!: Phaser.Physics.Arcade.Group;

  fireBtn!: Phaser.GameObjects.Text;
  upBtn!: Phaser.GameObjects.Text;
  downBtn!: Phaser.GameObjects.Text;
  leftBtn!: Phaser.GameObjects.Text;
  rightBtn!: Phaser.GameObjects.Text;

  moving!: boolean;
  playerTween!: Phaser.Tweens.Tween | null;
  lastDir!: { dx: number; dy: number };
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  wKey!: Phaser.Input.Keyboard.Key;
  aKey!: Phaser.Input.Keyboard.Key;
  sKey!: Phaser.Input.Keyboard.Key;
  dKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super('MazeScene');
  }

  preload() {
    this.load.spritesheet(
      'avatar',
      'https://labs.phaser.io/assets/sprites/dude.png',
      {
        frameWidth: 32,
        frameHeight: 48,
      },
    );
    this.load.image('goal', 'https://labs.phaser.io/assets/sprites/star.png');
    this.load.image('wall', 'https://labs.phaser.io/assets/sprites/block.png');
    this.load.image('enemy', '/assets/tinified/little-menace.png');
    this.load.image(
      'bullet',
      'https://labs.phaser.io/assets/sprites/bullet.png',
    );
  }

  create() {
    const rows = 21,
      cols = 21;
    this.tileSize = 24;
    this.walkSpeed = 70;

    // Get maxMoves from registry (set by React component)
    this.maxMoves = this.registry.get('maxMoves') || 5;
    this.movesRemaining = this.maxMoves;
    this.onNoMoves = this.registry.get('onNoMoves') || (() => {});
    this.onWin = this.registry.get('onWin') || (() => {});
    this.addMoreMoves =
      this.registry.get('addMoreMoves') || ((moves: number) => {});

    this.cameras.main.setBackgroundColor('#228B22');
    this.maze = this.generateMaze(rows, cols);

    // Walls
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (this.maze[y][x] === 1) {
          this.add
            .image(x * this.tileSize, y * this.tileSize, 'wall')
            .setOrigin(0)
            .setDisplaySize(this.tileSize, this.tileSize);
        }
      }
    }

    // Player
    this.gridX = 1;
    this.gridY = 1;
    this.goalX = cols - 2;
    this.goalY = rows - 2;
    this.player = this.add
      .sprite(
        this.gridX * this.tileSize,
        this.gridY * this.tileSize,
        'avatar',
        4,
      )
      .setOrigin(0)
      .setDisplaySize(this.tileSize, this.tileSize);

    // Goal
    this.goal = this.add
      .sprite(this.goalX * this.tileSize, this.goalY * this.tileSize, 'goal')
      .setOrigin(0)
      .setDisplaySize(this.tileSize, this.tileSize);

    this.winText = this.add
      .text(100, 200, 'YOU WIN!', { fontSize: '32px', color: '#fff' })
      .setVisible(false);

    // Display moves remaining
    this.movesText = this.add
      .text(10, 10, `Moves: ${this.movesRemaining}/${this.maxMoves}`, {
        fontSize: '18px',
        color: '#fff',
      })
      .setOrigin(0);

    // Animations
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('avatar', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('avatar', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.moving = false;
    this.playerTween = null;
    this.lastDir = { dx: 1, dy: 0 };

    // Enemies
    this.enemies = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
      let ex = Phaser.Math.Between(2, cols - 3);
      let ey = Phaser.Math.Between(2, rows - 3);
      if (this.maze[ey][ex] === 0 && !(ex === 1 && ey === 1)) {
        let enemy = this.enemies
          .create(ex * this.tileSize, ey * this.tileSize, 'enemy')
          .setOrigin(0)
          .setDisplaySize(this.tileSize, this.tileSize);
        enemy.gridX = ex;
        enemy.gridY = ey;
      }
    }

    // Bullets
    this.bullets = this.physics.add.group();
    this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
      bullet.destroy();
      enemy.destroy();
    });

    // Mobile controls
    const centerX = Number(this.sys.game.config.width) / 2;
    const baseY = Number(this.sys.game.config.height) - 120;
    this.fireBtn = this.add
      .text(centerX + 150, baseY, '🔥', { fontSize: '64px' })
      .setOrigin(0.5)
      .setInteractive();
    this.fireBtn.on('pointerdown', () => this.fireWeapon());

    this.upBtn = this.add
      .text(centerX, baseY - 70, '⬆️', { fontSize: '64px' })
      .setOrigin(0.5)
      .setInteractive();
    this.downBtn = this.add
      .text(centerX, baseY + 70, '⬇️', { fontSize: '64px' })
      .setOrigin(0.5)
      .setInteractive();
    this.leftBtn = this.add
      .text(centerX - 70, baseY, '⬅️', { fontSize: '64px' })
      .setOrigin(0.5)
      .setInteractive();
    this.rightBtn = this.add
      .text(centerX + 70, baseY, '➡️', { fontSize: '64px' })
      .setOrigin(0.5)
      .setInteractive();

    this.upBtn.on('pointerdown', () =>
      this.autoWalk({ dx: 0, dy: -1, anim: 'right' }),
    );
    this.downBtn.on('pointerdown', () =>
      this.autoWalk({ dx: 0, dy: 1, anim: 'left' }),
    );
    this.leftBtn.on('pointerdown', () =>
      this.autoWalk({ dx: -1, dy: 0, anim: 'left' }),
    );
    this.rightBtn.on('pointerdown', () =>
      this.autoWalk({ dx: 1, dy: 0, anim: 'right' }),
    );

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Optional: WASD keys
    this.wKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  update() {
    // Arrow keys
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.autoWalk({ dx: 0, dy: -1, anim: 'right' });
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.autoWalk({ dx: 0, dy: 1, anim: 'left' });
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.autoWalk({ dx: -1, dy: 0, anim: 'left' });
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.autoWalk({ dx: 1, dy: 0, anim: 'right' });
    }

    // WASD keys (optional)
    if (Phaser.Input.Keyboard.JustDown(this.wKey)) {
      this.autoWalk({ dx: 0, dy: -1, anim: 'right' });
    }
    if (Phaser.Input.Keyboard.JustDown(this.sKey)) {
      this.autoWalk({ dx: 0, dy: 1, anim: 'left' });
    }
    if (Phaser.Input.Keyboard.JustDown(this.aKey)) {
      this.autoWalk({ dx: -1, dy: 0, anim: 'left' });
    }
    if (Phaser.Input.Keyboard.JustDown(this.dKey)) {
      this.autoWalk({ dx: 1, dy: 0, anim: 'right' });
    }
  }

  fireWeapon() {
    const bullet = this.bullets
      .create(this.player.x, this.player.y, 'bullet')
      .setOrigin(0)
      .setDisplaySize(this.tileSize / 2, this.tileSize / 2);
    this.physics.velocityFromRotation(
      Phaser.Math.Angle.Between(0, 0, this.lastDir.dx, this.lastDir.dy),
      200,
      bullet.body.velocity,
    );
  }

  autoWalk(dir: { dx: number; dy: number; anim: string }) {
    if (this.moving) return;

    // Check if player has moves remaining
    if (this.movesRemaining <= 0) {
      this.onNoMoves();
      return;
    }

    this.moving = true;
    this.lastDir = dir;

    if (this.playerTween && this.playerTween.isPlaying()) {
      this.playerTween.stop();
      this.playerTween = null;
      this.player.anims.stop();
    }

    let x = this.gridX,
      y = this.gridY,
      steps = 0;
    while (true) {
      const nx = x + dir.dx,
        ny = y + dir.dy;
      if (!this.isPath(nx, ny)) break;
      if (
        this.enemies
          .getChildren()
          .some((e: any) => e.gridX === nx && e.gridY === ny)
      )
        break;

      x = nx;
      y = ny;
      steps++;
      if (x === this.goalX && y === this.goalY) break;
      if (this.degree(x, y) !== 2) break;
    }

    if (steps === 0) {
      this.moving = false;
      return;
    }

    this.player.anims.play(dir.anim, true);
    const duration = Math.max(1, this.walkSpeed * steps);

    this.playerTween = this.tweens.add({
      targets: this.player,
      x: x * this.tileSize,
      y: y * this.tileSize,
      duration,
      ease: 'Linear',
      onComplete: () => {
        this.gridX = x;
        this.gridY = y;
        this.player.setPosition(
          this.gridX * this.tileSize,
          this.gridY * this.tileSize,
        );
        this.player.anims.stop();
        this.player.setFrame(4);
        this.moving = false;
        this.playerTween = null;

        // Consume one move
        this.movesRemaining--;
        this.movesText.setText(
          `Moves: ${this.movesRemaining}/${this.maxMoves}`,
        );

        if (this.gridX === this.goalX && this.gridY === this.goalY) {
          this.winText.setVisible(true);
          this.onWin();
        }
      },
    });
  }

  isPath(x: number, y: number) {
    return (
      y >= 0 &&
      y < this.maze.length &&
      x >= 0 &&
      x < this.maze[0].length &&
      this.maze[y][x] === 0
    );
  }

  degree(x: number, y: number) {
    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
    ];
    let count = 0;
    for (const d of dirs) if (this.isPath(x + d.dx, y + d.dy)) count++;
    return count;
  }

  addMoreMovesToScene(newMoves: number) {
    this.movesRemaining += newMoves;
    this.movesText.setText(
      `Moves: ${this.movesRemaining}/${this.maxMoves + newMoves}`,
    );
    this.maxMoves += newMoves;
  }

  // Maze generator only
  generateMaze(rows: number, cols: number) {
    const maze = Array.from({ length: rows }, () => Array(cols).fill(1));
    const stack: any[] = [];
    const start = { x: 1, y: 1 };
    maze[start.y][start.x] = 0;
    stack.push(start);

    const dirs = [
      { dx: 0, dy: -2 },
      { dx: 2, dy: 0 },
      { dx: 0, dy: 2 },
      { dx: -2, dy: 0 },
    ];

    while (stack.length) {
      const cur = stack[stack.length - 1];
      Phaser.Utils.Array.Shuffle(dirs);

      const neighbors = dirs
        .map((d) => ({ x: cur.x + d.dx, y: cur.y + d.dy, dx: d.dx, dy: d.dy }))
        .filter(
          (n) =>
            n.x > 0 &&
            n.x < cols - 1 &&
            n.y > 0 &&
            n.y < rows - 1 &&
            maze[n.y][n.x] === 1,
        );

      if (neighbors.length) {
        const next = neighbors[0];
        maze[next.y][next.x] = 0;
        maze[cur.y + next.dy / 2][cur.x + next.dx / 2] = 0;
        stack.push(next);

        if (neighbors.length > 1 && Math.random() < 0.3) {
          const extra = neighbors[1];
          maze[extra.y][extra.x] = 0;
          maze[cur.y + extra.dy / 2][cur.x + extra.dx / 2] = 0;
        }
      } else {
        stack.pop();
      }
    }

    return maze;
  }
}

const MazePage: FC = () => {
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [maxMoves, setMaxMoves] = useState(0);
  const [showQuizOverlay, setShowQuizOverlay] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const gameRef = useRef<Phaser.Game | null>(null);

  // Lesson 1 color theme - Green
  const themeColor = '#4CAF50';
  const themeColorDark = '#45a049';
  const backgroundGradient =
    'linear-gradient(135deg, #4CAF50 0%, #2e7d32 100%)';

  const handleQuizComplete = (finalScore: number) => {
    setMaxMoves(finalScore);
    setQuizComplete(true);
    setShowQuizOverlay(false);
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
  };

  const handleWin = () => {
    setGameWon(true);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !quizComplete || gameWon) return;

    // Only initialize game once when quiz is first completed
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
    // Pass maxMoves and callbacks to the scene via registry
    game.registry.set('maxMoves', maxMoves);
    game.registry.set('onNoMoves', handleNoMoves);
    game.registry.set('onWin', handleWin);

    return () => {
      if (gameWon) {
        game.destroy(true);
        gameRef.current = null;
      }
    };
  }, [quizComplete, gameWon]);

  if (!quizComplete) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          background: backgroundGradient,
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
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '16px',
              maxWidth: '550px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: `3px solid ${themeColor}`,
            }}
          >
            <h1
              style={{
                marginTop: 0,
                marginBottom: '10px',
                color: themeColor,
                textAlign: 'center',
                fontSize: '32px',
              }}
            >
              Lesson 1: Basic Pronouns
            </h1>
            <p
              style={{
                color: '#666',
                textAlign: 'center',
                marginBottom: '30px',
                fontSize: '16px',
              }}
            >
              Start by taking a quick quiz to earn moves for the maze challenge!
            </p>
            <Quiz onComplete={handleQuizComplete} primaryColor={themeColor} />
          </div>
        </div>
      </div>
    );
  }

  if (gameWon) {
    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
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
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
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
                Lesson 1.
              </p>
              <Quiz onComplete={handleQuizComplete} primaryColor={themeColor} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MazePage), { ssr: false });
