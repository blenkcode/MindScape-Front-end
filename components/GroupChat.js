import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/GroupChat.module.css";

import { useSelector } from "react-redux";

import io from "socket.io-client";

const socket = io("https://mindscapebackend-9f2c807f920b.herokuapp.com/", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("connected to socket.io server");
});

socket.on("disconnect", () => {
  console.log("disconnected from socket.io server");
});
const GroupChat = () => {
  const projectID = useSelector((state) => state.user.value.projectID);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const username = useSelector((state) => state.user.value.name);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://mindscapebackend-9f2c807f920b.herokuapp.com/api/messages/${projectID}`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    fetchMessages();

    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [projectID]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message && username && projectID) {
      socket.emit("chat message", { message, username, projectID });
      setMessage("");
    }
  };

  return (
    <div className={styles.ChatContainer}>
      <ul className={styles.chatContent}>
        {messages.map((msg, index) => (
          <li
            className={styles.message}
            key={index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <div
              className={
                msg.username === username
                  ? styles.userMessageContent
                  : styles.messageContent
              }
            >
              <strong
                className={
                  msg.username === username ? styles.userTitle : styles.title
                }
              >
                {msg.username}:{" "}
              </strong>
              {msg.message}
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className={styles.inputContainer}>
        <input
          className={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
        />
        <button className={styles.send} type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default GroupChat;
