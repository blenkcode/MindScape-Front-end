import React, { useRef, useEffect } from "react";
import styles from "../styles/ButtonR.module.css";

const ButtonR = () => {
  const btnRef = useRef(null);

  return (
    <div className={styles.body}>
      {" "}
      <div ref={btnRef} className={styles.btn}>
        <span>Register</span>
      </div>
    </div>
  );
};

export default ButtonR;
