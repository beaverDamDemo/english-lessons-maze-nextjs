'use client';

import MazePageComponent from '../_components/MazePageComponent';
import Quiz from './Quiz';
import { MazeScene } from './scene';
import dynamic from 'next/dynamic';
import type { FC } from 'react';

const MazePage: FC = () => {
  // Lesson 4 color theme
  const themeColor = '#F44336';
  const themeColorDark = '#D32F2F';
  const backgroundGradient =
    'linear-gradient(135deg, #F44336 0%, #C62828 100%)';

  return (
    <MazePageComponent
      MazeScene={MazeScene}
      Quiz={Quiz}
      lessonNumber={4}
      lessonTitle="Nouns"
      themeColor={themeColor}
      themeColorDark={themeColorDark}
      backgroundGradient={backgroundGradient}
    />
  );
};

export default dynamic(() => Promise.resolve(MazePage), { ssr: false });
