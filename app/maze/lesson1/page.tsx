'use client';

import MazePageComponent from '../_components/MazePageComponent';
import Quiz from './Quiz';
import { MazeScene } from './scene';
import dynamic from 'next/dynamic';
import type { FC } from 'react';

const MazePage: FC = () => {
  // Lesson 1 color theme - Green
  const themeColor = '#4CAF50';
  const themeColorDark = '#388E3C';
  const backgroundGradient =
    'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';

  return (
    <MazePageComponent
      MazeScene={MazeScene}
      Quiz={Quiz}
      lessonNumber={1}
      lessonTitle="Nouns"
      themeColor={themeColor}
      themeColorDark={themeColorDark}
      backgroundGradient={backgroundGradient}
    />
  );
};

export default dynamic(() => Promise.resolve(MazePage), { ssr: false });
