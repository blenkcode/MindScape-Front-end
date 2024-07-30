import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { loginn, updateContacts } from "../reducers/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
import ButtonR from "./ButtonR";
import {
  faAddressBook,
  faDoorOpen,
  faListCheck,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import ContactModal from "./ContactModal";

import { faFolder } from "@fortawesome/free-regular-svg-icons";
import {
  faPeopleGroup,
  faComments,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  const router = useRouter();
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
  const [emailError, setEmailError] = useState(false);
  const [userError, setUserError] = useState(false);
  const user = useSelector((state) => state.user.value);
  console.log(user);

  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);

  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  useEffect(() => {
    if (user.token && user.name) {
      router.push("/profil");
    }
  }, [user, router]);

  const handleRegister = () => {
    fetch("https://mindscapebackend-9f2c807f920b.herokuapp.com/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, email }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.result) {
          console.log(data.name, data.token, data._id);
          dispatch(
            loginn({ name: data.name, token: data.token, userId: data._id })
          );
          setName("");
          setEmail("");
          setPassword("");
        } else {
          setUserError(true);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleConnexion = () => {
    fetch("https://mindscapebackend-9f2c807f920b.herokuapp.com/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailLogin, passwordLogin }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log(data);
          dispatch(
            loginn({
              name: data.data.name,
              token: data.data.token,
              userId: data.data._id,
            })
          );
          dispatch(updateContacts(data.data.contacts));
          router.push("/profil");
        }
      });
  };

  const handleNameClick = () => {
    setUserError(false);
    setEmailError(false);
  };

  const handleShowLogin = () => {
    setLogin(true);
    setRegister(false);
  };
  const handleShowRegister = () => {
    setRegister(true);
    setLogin(false);
  };

  return (
    <div>
      <main className={styles.main}>
        <div
          className={
            register ? styles.headerInscription : styles.headerInscriptionHidden
          }
        >
          <div className={styles.registerContainer}>
            <div
              className={
                register ? styles.registerTitle : styles.registerHidden
              }
            >
              Welcome on board!
              <div
                className={register ? styles.btn : styles.inputHidden}
                onClick={handleRegister}
              >
                {" "}
                <ButtonR></ButtonR>
              </div>
            </div>
            <div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={register ? styles.input : styles.inputHidden}
              ></input>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={register ? styles.input : styles.inputHidden}
              ></input>
              <input
                className={register ? styles.input : styles.inputHidden}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
          </div>
        </div>
        <div
          className={
            login ? styles.headerConnexion : styles.headerConnexionHidden
          }
        >
          <div className={styles.loginContainer}>
            <div className={login ? styles.loginTitle : styles.loginHidden}>
              Nice to see you again!
            </div>
            <div className={styles.inputcontainer}>
              <input
                type="text"
                placeholder="Email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                className={login ? styles.input : styles.inputHidden}
              ></input>
              <input
                type="password"
                placeholder="Password"
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
                className={login ? styles.input : styles.inputHidden}
              ></input>

              <div className={login ? styles.btn : styles.inputHidden}>
                {" "}
                <div onClick={handleConnexion}>
                  {" "}
                  <Button></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.leftSection}>
          <h1 className={styles.titleMain}>
            <span className={styles.span}>
              <span className={styles.M}>M</span>
              <span className={styles.i}>i</span>
              <span className={styles.n}>n</span>
              <span className={styles.d}>d</span>
              <span className={styles.S}>S</span>
              <span className={styles.S}>c</span>
              <span className={styles.a}>a</span>
              <span className={styles.p}>p</span>
              <span className={styles.e}>e</span>
            </span>
          </h1>
          <p className={styles.subtitle}>
            Votre espace de travail et gestion de projet 2.0
          </p>
          <div className={styles.taches}>
            <div className={styles.tache}>
              {" "}
              Création de projet en groupe{" "}
              <span className={styles.lines}></span>
              <FontAwesomeIcon className={styles.icons} icon={faPeopleGroup} />
            </div>
            <div className={styles.tache1}>
              {" "}
              Chats privés <span className={styles.lines1}></span>
              <FontAwesomeIcon className={styles.icons} icon={faComments} />
            </div>
            <div className={styles.tache2}>
              {" "}
              Gestion des tâches <span className={styles.lines2}></span>
              <FontAwesomeIcon className={styles.icons} icon={faListCheck} />
            </div>
            <div className={styles.tache3}>
              {" "}
              Calendriers partagés <span className={styles.lines3}></span>
              <FontAwesomeIcon className={styles.icons} icon={faCalendar} />
            </div>
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.Card1} onClick={handleShowLogin}>
            Login
          </div>
          <div className={styles.Card2} onClick={handleShowRegister}>
            Register
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
