import React, { useRef, useEffect } from "react";
import styles from "../styles/Clock.module.css";

const Clock = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const clock = () => {
      const date = new Date();
      const hours = ((date.getHours() + 11) % 12) + 1;
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const hour = hours * 30;
      const minute = minutes * 6;
      const second = seconds * 6;

      if (hourRef.current)
        hourRef.current.style.transform = `rotate(${hour}deg)`;
      if (minuteRef.current)
        minuteRef.current.style.transform = `rotate(${minute}deg)`;
      if (secondRef.current)
        secondRef.current.style.transform = `rotate(${second}deg)`;
    };

    clock();
    const interval = setInterval(clock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.clock}>
      <div className={styles.wrap}>
        <span ref={hourRef} className={styles.heure}></span>
        <span ref={minuteRef} className={styles.minute}></span>
        <span ref={secondRef} className={styles.seconde}></span>
        <span className={styles.dot}></span>
      </div>
    </div>
  );
};

export default Clock;
