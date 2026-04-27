import React, { useState, useEffect } from 'react';

export default function Countdown() {
  // Format: YYYY-MM-DDTHH:mm:ss+07:00
  const TARGET_DATE = new Date("2026-05-20T08:00:00+07:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }


      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  const formatNumber = (num) => (num < 10 ? `0${num}` : num);

  return (
    <section style={{ gap: '20px', marginBottom: '50px', alignItems: 'center' }}>
      <h>{formatNumber(timeLeft.days)} Days, </h>
      <h>{formatNumber(timeLeft.hours)} Hours, </h>
      <h>{formatNumber(timeLeft.mins)} Minutes, </h>
      <h>{formatNumber(timeLeft.secs)} Seconds </h>
      


    </section>
  );
}