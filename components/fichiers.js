import React, { useRef, useEffect } from "react";
import styles from "../styles/Fichiers.module.css";

const Fichiers = () => {
  // const formData = new FormData();

  // formData.append("photoFromFront", {
  //   uri: "file://...",
  //   name: "photo.jpg",
  //   type: "image/jpeg",
  // });

  // fetch("http://.../upload", {
  //   method: "POST",
  //   body: formData,
  // })
  //   .then((response) => response.json())
  //   .then((data) => {});
  return (
    <div className={styles.fichierContainer}>
      <div className={styles.title}>Fichiers Partagés</div>
      <div className={styles.content}>
        {" "}
        <div className={styles.fichiersLeft}>
          <ul>
            <li>market.pdf</li>
            <li>market.pdf</li>
            <li>market.pdf</li>
            <li>market.pdf</li>
          </ul>
        </div>
        <div className={styles.fichiersMiddle}>
          <ul>
            <li>market.pdf</li>
            <li>market.pdf</li>
            <li>market.pdf</li>
            <li>market.pdf</li>
          </ul>
        </div>
        <div className={styles.fichiersRight}>
          <ul>
            <li>market.pdf</li>
            <li>market.pdf</li>
            <li>market.pdf</li>
            <li>market.pdf</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Fichiers;
