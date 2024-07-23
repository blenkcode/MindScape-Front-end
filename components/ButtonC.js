import React, { useRef, useEffect } from "react";
import styles from "../styles/ButtonCreate.module.css";

const ButtonC = () => {
  const btnRef = useRef(null);

  return (
    <div className={styles.body}>
      {" "}
      <div ref={btnRef} className={styles.btn}>
        <span>Créer</span>
      </div>
    </div>
  );
};

export default ButtonC;
