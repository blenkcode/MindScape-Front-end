import React, { useEffect, useState } from "react";
import styles from "../styles/ChatBar.module.css";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const socket = io.connect("http://localhost:3000");

const PrivateChat = ({ recipientId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const username = useSelector((state) => state.user.value.name);
  const senderId = useSelector((state) => state.user.value.id);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://mind-scape-back-end.vercel.app/api/private-messages/${senderId}/${recipientId}`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    fetchMessages();

    socket.on("private message", (msg) => {
      if (
        (msg.senderId === senderId && msg.recipientId === recipientId) ||
        (msg.senderId === recipientId && msg.recipientId === senderId)
      ) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    return () => {
      socket.off("private message");
    };
  }, [senderId, recipientId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message && username && recipientId) {
      socket.emit("private message", {
        message,
        username,
        senderId,
        recipientId,
      });
      setMessage("");
    }
  };

  return (
    <div className={styles.ChatContainer}>
      <ul className={styles.chatContent}>
        {messages.map((msg, index) => (
          <li className={styles.message} key={index}>
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

export default PrivateChat;
