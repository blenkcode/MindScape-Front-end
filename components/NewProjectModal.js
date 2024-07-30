import styles from "../styles/NewProjectModal.module.css";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import ButtonC from "./ButtonC";
import { updateProjectID } from "../reducers/user";

const NewProjectModal = ({ isVisible, onClose, children }) => {
  if (!isVisible) {
    return null;
  }
  const router = useRouter();
  const dispatch = useDispatch();
  const [projectName, setProjectName] = useState("");
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [team, setTeam] = useState("");
  const [contacts, setContacts] = useState([]);
  const token = useSelector((state) => state.user.value.token);
  const fetchedContacts = useSelector((state) => state.user.value.contacts);
  console.log("fetchedcontacts : ", fetchedContacts);
  const handleCreateProject = () => {
    const memberIds = contacts
      .filter((contact) => collaborateurs.includes(contact._id))
      .map((contact) => contact.userId);
    const projectData = {
      name: projectName,
      ownerToken: token, // Assuming token is the user ID, adjust if necessary
      memberIds: memberIds,
      team: team,
    };
    console.log("membersid : ", memberIds);
    fetch(
      `https://mindscapebackend-9f2c807f920b.herokuapp.com/projects/createProject`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(updateProjectID(data.data._id));
          router.push("/project");
        }
      })
      .catch((error) => {
        console.error("Error creating project:", error);
      });
  };

  useEffect(() => {
    setContacts(fetchedContacts);
  }, [token]);

  const options = contacts.map((contact) => ({
    value: contact._id,
    label: contact.name,
  }));

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.h2}>Nouveau projet</h2>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
        <div className={styles.form}>
          <div className={styles.inputContainer}>
            Nom du projet :{" "}
            <input
              onChange={(e) => setProjectName(e.target.value)}
              value={projectName}
              className={styles.input}
              type="text"
            />
          </div>
          <div className={styles.inputContainer}>
            Ajouter collaborateurs (optionnel) :{" "}
            <Select
              isMulti
              name="collaborateurs"
              options={options}
              className={styles.selects}
              classNamePrefix="select"
              onChange={(selectedOptions) => {
                setCollaborateurs(
                  selectedOptions
                    ? selectedOptions.map((option) => option.value)
                    : []
                );
              }}
            />
          </div>

          <div onClick={handleCreateProject} className={styles.creer}>
            {" "}
            <ButtonC></ButtonC>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;
