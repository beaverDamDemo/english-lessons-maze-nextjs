'use client';

import MazePageComponent from '../_components/MazePageComponent';
import Quiz from './Quiz';
import { MazeScene } from './scene';
import dynamic from 'next/dynamic';
import type { FC } from 'react';

const MazePage: FC = () => {
  // Lesson 7 color theme
  const themeColor = '#E91E63';
  const themeColorDark = '#C2185B';
  const backgroundGradient =
    'linear-gradient(135deg, #E91E63 0%, #AD1457 100%)';

  return (
    <MazePageComponent
      MazeScene={MazeScene}
      Quiz={Quiz}
      lessonNumber={7}
      lessonTitle="Adverbs"
      themeColor={themeColor}
      themeColorDark={themeColorDark}
      backgroundGradient={backgroundGradient}
    />
  );
};

export default dynamic(() => Promise.resolve(MazePage), { ssr: false });
