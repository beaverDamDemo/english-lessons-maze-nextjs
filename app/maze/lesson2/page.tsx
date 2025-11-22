'use client';

import MazePageComponent from '../_components/MazePageComponent';
import Quiz from './Quiz';
import { MazeScene } from './scene';
import dynamic from 'next/dynamic';
import type { FC } from 'react';

const MazePage: FC = () => {
  // Lesson 2 color theme
  const themeColor = '#2196F3';
  const themeColorDark = '#1976D2';
  const backgroundGradient =
    'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)';

  return (
    <MazePageComponent
      MazeScene={MazeScene}
      Quiz={Quiz}
      lessonNumber={2}
      lessonTitle="Verb Tenses"
      themeColor={themeColor}
      themeColorDark={themeColorDark}
      backgroundGradient={backgroundGradient}
    />
  );
};

export default dynamic(() => Promise.resolve(MazePage), { ssr: false });
