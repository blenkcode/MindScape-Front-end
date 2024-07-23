import React, { useRef, useEffect } from "react";
import styles from "../styles/Cards.module.css";

const Cards = () => {
  return (
    <div className={styles.CardsContainer}>
      <div className={styles.Card1}>Login</div>
      <div className={styles.Card2}>Register</div>
    </div>
  );
};

export default Cards;
