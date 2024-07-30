import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import styles from "../styles/Projects.module.css";
import { updateProjectID } from "../reducers/user";

import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

function Projects() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.value.token);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(
      `https://mindscapebackend-9f2c807f920b.herokuapp.com/projects/getAllProjects/${token}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data.projects);
          setProjects(data.projects);
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, [token]);

  const handleOpenProjects = (project) => {
    dispatch(updateProjectID(project._id));
    router.push("/project");
  };

  const upperProjects = projects.slice(0, 4);
  const lowerProjects = projects.slice(4, 8);

  return (
    <div className={styles.cardsContainer}>
      <div className={styles.upper}>
        {upperProjects.map((project) => (
          <div
            key={project._id}
            className={styles.Card2}
            onClick={() => handleOpenProjects(project)}
          >
            {project.name}
            <div>
              <FontAwesomeIcon className={styles.icon} icon={faFolder} />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.lower}>
        {lowerProjects.map((project) => (
          <div
            key={project._id}
            className={styles.Card2}
            onClick={() => handleOpenProjects(project)}
          >
            {project.name}
            <div>
              <FontAwesomeIcon className={styles.icon} icon={faFolder} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
