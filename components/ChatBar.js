import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/ChatBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

import io from "socket.io-client";

const socket = io("https://mindscapebackend-9f2c807f920b.herokuapp.com", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("connected to socket.io server");
});

socket.on("disconnect", () => {
  console.log("disconnected from socket.io server");
});
const ChatBar = () => {
  const [openChannels, setOpenChannels] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [messageInputs, setMessageInputs] = useState({});
  const lastMessageRef = useRef(null);

  const openConversation = useSelector(
    (state) => state.user.value.openConversation
  );
  const username = useSelector((state) => state.user.value.name);
  const userId = useSelector((state) => state.user.value.userId);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      try {
        const response = await fetch(
          `https://mindscapebackend-9f2c807f920b.herokuapp.com/api/private-messages/${userId}/${activeChat}`
        );
        if (response.ok) {
          const data = await response.json();
          setMessages((prevMessages) => ({
            ...prevMessages,
            [activeChat]: data,
          }));
        } else {
          console.error("Error fetching messages: ", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    fetchMessages();
  }, [activeChat, userId]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  const handleSubmit = (e, contactId) => {
    e.preventDefault();
    const message = messageInputs[contactId];
    if (message && username && contactId) {
      socket.emit("private message", {
        message,
        username,
        senderId: userId,
        recipientId: contactId,
      });
      setMessages((prevMessages) => ({
        ...prevMessages,
        [contactId]: [
          ...(prevMessages[contactId] || []),
          { message, username, senderId: userId, recipientId: contactId },
        ],
      }));
      setMessageInputs((prevInputs) => ({ ...prevInputs, [contactId]: "" }));
    }
  };

  const handleInputChange = (e, contactId) => {
    const { value } = e.target;
    setMessageInputs((prevInputs) => ({ ...prevInputs, [contactId]: value }));
  };

  const toggleChannel = (userId) => {
    setOpenChannels((prevOpenChannels) =>
      prevOpenChannels.includes(userId)
        ? prevOpenChannels.filter((id) => id !== userId)
        : [...prevOpenChannels, userId]
    );
    setActiveChat(userId);
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.ChatBar}>
      {Array.isArray(openConversation) &&
        openConversation.map((contact) => (
          <div
            key={contact._id}
            className={
              openChannels.includes(contact.userId)
                ? styles.channelsOpen
                : styles.channels
            }
            onClick={() => toggleChannel(contact.userId)}
          >
            {openChannels.includes(contact.userId) && (
              <div className={styles.contentContainer}>
                <div onClick={handleInputClick} className={styles.chatContent}>
                  {(messages[contact.userId] || []).map((msg, index) => (
                    <div
                      className={
                        msg.senderId === userId
                          ? styles.userMessageContainer
                          : styles.receiverMessageContainer
                      }
                      key={index}
                      ref={
                        index === (messages[contact.userId] || []).length - 1
                          ? lastMessageRef
                          : null
                      }
                    >
                      <div
                        className={
                          msg.senderId === userId
                            ? styles.userMessageContent
                            : styles.messageContent
                        }
                      >
                        <div
                          className={
                            msg.username === username
                              ? styles.userTitle
                              : styles.title
                          }
                        >
                          {msg.username}:{" "}
                        </div>
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  onClick={handleInputClick}
                  onSubmit={(e) => handleSubmit(e, contact.userId)}
                  className={styles.inputContainer}
                >
                  <input
                    className={styles.input}
                    value={messageInputs[contact.userId] || ""}
                    onChange={(e) => handleInputChange(e, contact.userId)}
                    type="text"
                  />
                  <button className={styles.send} type="submit">
                    Send
                  </button>
                </form>
              </div>
            )}

            <div
              className={styles.name}
              onClick={() => setActiveChat(contact.userId)}
            >
              {contact.name}
              <FontAwesomeIcon className={styles.icon} icon={faEnvelope} />
            </div>
          </div>
        ))}
    </div>
  );
};

export default ChatBar;
