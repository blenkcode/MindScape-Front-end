import styles from "../styles/SideBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import ContactModal from "./ContactModal";
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import {
  faPeopleGroup,
  faComments,
  faEllipsis,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  updateProjectID,
  logout,
  setOpenConversation,
  updateContacts,
} from "../reducers/user";

const SideBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const name = useSelector((state) => state.user.value.name);
  const userId = useSelector((state) => state.user.value._id); // Assurez-vous que l'ID utilisateur est disponible
  const contacts = useSelector((state) => state.user.value.contacts);
  const token = useSelector((state) => state.user.value.token);
  const projectID = useSelector((state) => state.user.value.projectID);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [dropdownProjectID, setDropdownProjectID] = useState(null);
  const [dropdownContactID, setDropdownContactID] = useState(null);
  const [confirmDeleteProjectID, setConfirmDeleteProjectID] = useState(null);
  const [confirmDeleteContact, setConfirmDeleteContact] = useState(null);
  const dropdownRef = useRef(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    fetch(
      `https://mind-scape-back-end.vercel.app/projects/getAllProjects/${token}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setProjects(data.projects);
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, [token, reload]);

  useEffect(() => {
    fetch(`https://mind-scape-back-end.vercel.app/users/${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(updateContacts(data.data));
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
      });
  }, [token, reload]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownProjectID(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleContacts = () => {
    setIsModalVisible(true);
  };

  const handleRouterProject = () => {
    router.push("/profil");
  };

  const handleOpenProjects = (project) => {
    dispatch(updateProjectID(project._id));
    if (router.pathname !== "/project") {
      router.push("/project");
    }
  };

  const toggleDropdown = (projectID) => {
    setDropdownProjectID(dropdownProjectID === projectID ? null : projectID);
  };

  const toggleDropdownC = (contactID) => {
    setDropdownContactID(dropdownContactID === contactID ? null : contactID);
  };

  const handleDelete = (id) => {
    // Handle the delete action here
    console.log(`Delete project with ID: ${id}`);

    const projectId = id;
    fetch(
      `https://mind-scape-back-end.vercel.app/projects/deleteProject/${projectId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setReload(!reload);
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      });
  };
  const handleDeleteContact = (id) => {
    // Handle the delete action here

    const contactID = id;

    fetch(
      `https://mind-scape-back-end.vercel.app/users/deleteContact/${contactID}/${token}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setReload(!reload);
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      });
  };

  const handleSecure = (id) => {
    setConfirmDeleteProjectID(confirmDeleteProjectID === id ? null : id);
  };
  const handleSecureC = (id) => {
    setConfirmDeleteContact(confirmDeleteContact === id ? null : id);
  };

  const handleLogout = () => {
    router.push("/");
    dispatch(logout());
  };

  const handleOpenConversation = (contact) => {
    dispatch(setOpenConversation({ ...contact }));
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.infos}>
        <div className={styles.name}>{name}</div>
        <FontAwesomeIcon
          className={styles.logout}
          onClick={handleLogout}
          icon={faDoorOpen}
        />
        <FontAwesomeIcon
          onClick={handleContacts}
          className={styles.contact}
          icon={faAddressBook}
        />
      </div>
      <div className={styles.section1}>
        <ContactModal
          className={styles.modal}
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        ></ContactModal>
        <div className={styles.contentContainer}>
          <div className={styles.title} onClick={handleRouterProject}>
            Projects
            <div>
              <FontAwesomeIcon className={styles.icon} icon={faFolder} />
            </div>
          </div>
          <ul className={styles.content}>
            {projects.map((project) => (
              <li
                onClick={() => handleOpenProjects(project)}
                className={`${styles.li} ${
                  project._id === projectID ? styles.active : ""
                }`}
                key={project._id}
              >
                {project.name}
                <div>
                  <FontAwesomeIcon
                    className={styles.ellipsis}
                    icon={faEllipsis}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the li click handler
                      toggleDropdown(project._id);
                    }}
                  />
                </div>
                {dropdownProjectID === project._id && (
                  <div ref={dropdownRef} className={styles.dropdown}>
                    <div
                      className={styles.dropdownItem}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the li click handler
                        handleSecure(project._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </div>
                    {confirmDeleteProjectID === project._id && (
                      <div className={styles.confirmDelete}>
                        <button
                          className={styles.confirmDeleteBtn}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the li click handler
                            handleDelete(project._id);
                          }}
                        >
                          Supprimer projet ?
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.section3}>
        <div className={styles.contentContainer}>
          <div className={styles.title}>
            Contacts{" "}
            <FontAwesomeIcon className={styles.iconco} icon={faComments} />
          </div>
          <ul className={styles.contentChat}>
            {contacts.map((contact) => (
              <li
                className={styles.li}
                onClick={() => handleOpenConversation(contact)}
                key={contact.userId}
              >
                {contact.name}
                <div>
                  <FontAwesomeIcon
                    className={styles.ellipsis}
                    icon={faEllipsis}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the li click handler
                      toggleDropdownC(contact._id);
                    }}
                  />
                  {dropdownContactID === contact._id && (
                    <div ref={dropdownRef} className={styles.dropdown}>
                      <div
                        className={styles.dropdownItem}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the li click handler
                          handleSecureC(contact._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </div>
                      {confirmDeleteContact === contact._id && (
                        <div className={styles.confirmDelete}>
                          <button
                            className={styles.confirmDeleteBtn}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the li click handler
                              handleDeleteContact(contact.userId);
                            }}
                          >
                            Supprimer contact ?
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
