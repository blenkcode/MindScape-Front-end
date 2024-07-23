import styles from "../styles/Profil.module.css";
import { useState } from "react";
import SideBar from "../components/SideBar";
import AcceuilContent from "../components/AcceuilContent";
import ChatBar from "../components/ChatBar";
import { useDispatch, useSelector } from "react-redux";

function Profil() {
  return (
    <div>
      <main className={styles.main}>
        <div className={styles.sidebar}>
          <SideBar></SideBar>
        </div>
        <div className={styles.FootChat}>
          <ChatBar></ChatBar>
        </div>
        <div className={styles.Content}>
          <AcceuilContent></AcceuilContent>
        </div>
      </main>
    </div>
  );
}

export default Profil;
