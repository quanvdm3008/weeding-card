import { useState, useEffect } from "react";

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculates and continuously updates the countdown to a target date/time.
 * Replaces the duplicated useEffect countdown pattern across all template files.
 * Properly cleans up the interval on unmount to prevent memory leaks.
 *
 * @param date - ISO date string, e.g. "2027-02-14"
 * @param time - Time string, e.g. "17:30"
 * @returns CountdownTime object that updates every second
 */
export function useCountdown(date?: string, time?: string): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!date) return;

    const targetMs = new Date(`${date}T${time ?? "00:00"}`).getTime();

    if (isNaN(targetMs)) return;

    /* `id` must be declared BEFORE the first tick(): if the wedding date has passed (diff <= 0*/
    /* immediately), the clearInterval(id) branch runs during the first synchronous tick() call —*/
    /* Using const will then throw TDZ "Cannot access 'id' before initialization"*/
    /* and whiten the entire card page.*/
    let id: ReturnType<typeof setInterval> | undefined;

    const tick = () => {
      const diff = targetMs - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (id !== undefined) clearInterval(id);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      });
    };

    tick(); // run immediately so there's no 1-second blank on mount
    if (targetMs > Date.now()) {
      id = setInterval(tick, 1_000);
    }

    return () => {
      if (id !== undefined) clearInterval(id);
    };
  }, [date, time]);

  return timeLeft;
}
