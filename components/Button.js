import React, { useRef, useEffect } from "react";
import styles from "../styles/Button.module.css";

const Button = () => {
  const btnRef = useRef(null);

  return (
    <div className={styles.body}>
      {" "}
      <div ref={btnRef} className={styles.btn}>
        <span className={styles.txt}>Login</span>
      </div>
    </div>
  );
};

export default Button;
