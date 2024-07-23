import styles from "../styles/Profil.module.css";
import { useState } from "react";
import SideBar from "../components/SideBar";
import Projects from "../components/Projects";
import ChatBar from "../components/ChatBar";
import { useDispatch } from "react-redux";

function AllProjects() {
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
          <Projects></Projects>
        </div>
      </main>
    </div>
  );
}

export default AllProjects;
