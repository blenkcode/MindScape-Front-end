import styles from "../styles/ContactModal.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { updateContacts } from "../reducers/user";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ButtonCreate from "./ButtonCreate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const ContactModal = ({ isVisible, onClose, children }) => {
  if (!isVisible) {
    return null;
  }
  const token = useSelector((state) => state.user.value.token);
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const dispatch = useDispatch();

  const handleAddContact = () => {
    fetch(`https://mind-scape-back-end.vercel.app/users/addContact/${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail }), // Send email as part of an object
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          setError(data.error); // Set error message if there was an error
          setSuccess(null); // Clear success message
        } else {
          setError(null); // Clear error message
          setSuccess(data.success); // Set success message
          setUserEmail("");
          dispatch(updateContacts(data.user.contacts));
          console.log(data.user.contacts);
          console.log("Response from contact update:", data);
          // Optionally, you can update the user's contact list in the state here
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("An unexpected error occurred.");
        setSuccess(null); // Clear success message
      });
  };
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {" "}
        <h2 className={styles.h2}>Nouveau collaborateur</h2>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
        <div className={styles.form}>
          <div className={styles.inputContainer}>
            Email du collaborateur :{" "}
            <input
              onChange={(e) => setUserEmail(e.target.value)}
              value={userEmail}
              className={styles.input}
              type="text"
            ></input>
            <div onClick={handleAddContact}>
              {" "}
              <ButtonCreate className={styles.btn}></ButtonCreate>
            </div>
          </div>
          <div className={styles.errorContainer}>
            {error && (
              <p className={styles.error}>
                {error}{" "}
                <FontAwesomeIcon className={styles.iconX} icon={faXmark} />
              </p>
            )}
            {success && (
              <p className={styles.success}>
                {success}{" "}
                <FontAwesomeIcon className={styles.iconV} icon={faCheck} />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
