import React, { useRef, useEffect } from "react";
import styles from "../styles/ButtonCreate.module.css";

const ButtonCreate = () => {
  const btnRef = useRef(null);

  return (
    <div className={styles.body}>
      {" "}
      <div ref={btnRef} className={styles.btn}>
        <span>Ajouter</span>
      </div>
    </div>
  );
};

export default ButtonCreate;
