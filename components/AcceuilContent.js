import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/AcceuilContent.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import NewProjectModal from "./NewProjectModal";

import { useDispatch } from "react-redux";

function AcceuilContent() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const handleNewProject = () => {
    setIsModalVisible(true);
  };

  const handleOpenProjects = () => {
    router.push("/all-projects");
  };
  return (
    <div className={styles.cardsContainer}>
      <NewProjectModal
        className={styles.modal}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      ></NewProjectModal>{" "}
      <div
        className={isModalVisible ? styles.Card1Modal : styles.Card1}
        onClick={handleNewProject}
      >
        Créer un nouveau projet
        <div>
          <FontAwesomeIcon className={styles.icon} icon={faPlus} />
        </div>
      </div>
      <div
        className={isModalVisible ? styles.Card2Modal : styles.Card2}
        onClick={handleOpenProjects}
      >
        Ouvrir un projet déjà éxistant
        <div>
          {" "}
          <FontAwesomeIcon className={styles.icon} icon={faArrowRight} />
        </div>
      </div>
    </div>
  );
}

export default AcceuilContent;
