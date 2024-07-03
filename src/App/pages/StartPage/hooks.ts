import { useEffect, useLayoutEffect, useState } from 'react';
import dayjs from 'dayjs';

import { checkIsSame, getObjectTime } from './utils';

import { START_TIME } from './constants';

import { Timer } from './types';

export const useWindowWidth = (): number => {
  const [windowWidth, setWindowWidth] = useState<number>(window.screen.width);
  
  useLayoutEffect(() => {
    const onResize = () => {
      setWindowWidth(window.screen.width);
    };

    window.addEventListener('resize', onResize);
  }, []);

  return windowWidth;
};

export const useCountdown = (): Timer => {
  const [time, setTime] = useState<Timer>();

  const getTime = async () => {
    try {
      const apiTime = await fetch('/api/Time/current/zone?timeZone=Europe/Moscow');

      if (!apiTime?.ok) {
        throw new Error(apiTime.toString())
      }

      return apiTime.json() as Promise<{ dateTime: string }>;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timer;

    getTime()
      .then((data) => {
        if (!data?.dateTime) {
          return;
        }

        const isSame = checkIsSame(data.dateTime);

        if (!isSame) {
          return;
        }

        timer = setInterval(() => {
          const current = dayjs();
          const start = dayjs(START_TIME);
    
          const diff = start.diff(current);
    
          const objectTimer = getObjectTime(diff);

          if (objectTimer.days === 0 && objectTimer.hours === 0 && objectTimer.minutes === 0) {
            setTime(undefined);

            clearInterval(timer);

            return;
          }

          setTime(objectTimer);
        }, 1000);
      });
    
    return () => clearInterval(timer);
  }, []);

  return time;
};
