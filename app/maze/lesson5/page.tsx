'use client';

import MazePageComponent from '../_components/MazePageComponent';
import Quiz from './Quiz';
import { MazeScene } from './scene';
import dynamic from 'next/dynamic';
import type { FC } from 'react';

const MazePage: FC = () => {
  // Lesson 5 color theme
  const themeColor = '#9C27B0';
  const themeColorDark = '#7B1FA2';
  const backgroundGradient =
    'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)';

  return (
    <MazePageComponent
      MazeScene={MazeScene}
      Quiz={Quiz}
      lessonNumber={5}
      lessonTitle="Prepositions"
      themeColor={themeColor}
      themeColorDark={themeColorDark}
      backgroundGradient={backgroundGradient}
    />
  );
};

export default dynamic(() => Promise.resolve(MazePage), { ssr: false });
