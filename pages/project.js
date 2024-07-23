import styles from "../styles/Profil.module.css";
import { useState } from "react";
import SideBar from "../components/SideBar";
import DashBoard from "../components/DashBoard";
import ChatBar from "../components/ChatBar";
import { useDispatch, useSelector } from "react-redux";

function Project() {
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
          <DashBoard></DashBoard>
        </div>
      </main>
    </div>
  );
}

export default Project;
