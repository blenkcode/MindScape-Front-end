import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import styles from "../styles/DashBoard.module.css";
import DraggableCard from "./DraggableCard";
import DroppableContainer from "./DroppableContainer";
import Fichiers from "./Fichiers";
import CalendarMain from "./CalendarMain";
import GroupChat from "./GroupChat";

function DashBoard() {
  const [cards, setCards] = useState({
    section1: [],
    section2: [],
    section3: [],
  });

  const [editingCardId, setEditingCardId] = useState(null);

  const projectID = "66868492cef7a2aba4b4e075"; // Remplacez par l'ID réel de votre projet

  const updateProjectTasks = (tasks) => {
    fetch(
      `https://mind-scape-back-end.vercel.app/projects/updateTask/${projectID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks }), // Envoyer les tâches mises à jour
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          console.error("Failed to update tasks:", data.error);
        } else {
          console.log("Tasks updated successfully:", data);
        }
      })
      .catch((error) => {
        console.error("Error updating tasks:", error);
      });
  };

  useEffect(() => {
    fetch(`https://mind-scape-back-end.vercel.app/projects/${projectID}/tasks`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.result) {
          setCards(data.tasks || { section1: [], section2: [], section3: [] });
        } else {
          console.error("Failed to fetch tasks:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [projectID]);

  const handleAddCard = (section) => {
    const newCard = { id: uuidv4(), name: "New Card", color: "#6B6B6B" };
    const updatedCards = {
      ...cards,
      [section]: [...cards[section], newCard],
    };
    setCards(updatedCards);
    setEditingCardId(newCard.id);
    updateProjectTasks(updatedCards);
  };

  const handleNameChange = (id, newName) => {
    const updatedCards = { ...cards };
    for (let section in updatedCards) {
      updatedCards[section] = updatedCards[section].map((card) =>
        card && card.id === id ? { ...card, name: newName } : card
      );
    }
    setCards(updatedCards);
    setEditingCardId(null);
    updateProjectTasks(updatedCards);
  };

  const handleColorChange = (id, newColor) => {
    const updatedCards = { ...cards };
    for (let section in updatedCards) {
      updatedCards[section] = updatedCards[section].map((card) =>
        card && card.id === id ? { ...card, color: newColor } : card
      );
    }
    setCards(updatedCards);
    updateProjectTasks(updatedCards);
  };

  const handleDrop = (section, id) => {
    let cardToMove = null;
    const updatedCards = { ...cards };

    for (let sec in updatedCards) {
      updatedCards[sec] = updatedCards[sec].filter((card) => {
        if (card && card.id === id) {
          cardToMove = card;
          return false;
        }
        return true;
      });
    }

    if (cardToMove) {
      updatedCards[section] = [...updatedCards[section], cardToMove];
      setCards(updatedCards);
      updateProjectTasks(updatedCards);
    } else {
      console.error("Card not found: ", id);
    }
  };

  const handleDeleteCard = (id) => {
    const updatedCards = { ...cards };
    for (let section in updatedCards) {
      updatedCards[section] = updatedCards[section].filter(
        (card) => card.id !== id
      );
    }
    setCards(updatedCards);
    updateProjectTasks(updatedCards);
  };

  return (
    <div className={styles.projectContainer}>
      <DndProvider backend={HTML5Backend}>
        <div className={styles.taches}>
          <div className={styles.section1}>
            <div className={styles.titleSection}>
              À faire :
              <div
                className={styles.plusContainer}
                onClick={() => handleAddCard("section1")}
              >
                <FontAwesomeIcon className={styles.icon} icon={faPlus} />
              </div>
            </div>
            <DroppableContainer onDrop={(id) => handleDrop("section1", id)}>
              {cards.section1.map(
                (card) =>
                  card && ( // Check if card is not null or undefined
                    <DraggableCard
                      key={card.id}
                      id={card.id}
                      name={card.name}
                      color={card.color}
                      onNameChange={handleNameChange}
                      onColorChange={handleColorChange}
                      isEditing={card.id === editingCardId}
                      setEditingCardId={setEditingCardId}
                      onDelete={handleDeleteCard}
                    />
                  )
              )}
            </DroppableContainer>
          </div>
          <div className={styles.section2}>
            <div className={styles.titleSection}>En cours :</div>
            <DroppableContainer onDrop={(id) => handleDrop("section2", id)}>
              {cards.section2.map(
                (card) =>
                  card && ( // Check if card is not null or undefined
                    <DraggableCard
                      key={card.id}
                      id={card.id}
                      name={card.name}
                      color={card.color}
                      onNameChange={handleNameChange}
                      onColorChange={handleColorChange}
                      isEditing={card.id === editingCardId}
                      setEditingCardId={setEditingCardId}
                      onDelete={handleDeleteCard}
                    />
                  )
              )}
            </DroppableContainer>
          </div>
          <div className={styles.section3}>
            <div className={styles.titleSection}>Terminé :</div>
            <DroppableContainer onDrop={(id) => handleDrop("section3", id)}>
              {cards.section3.map(
                (card) =>
                  card && ( // Check if card is not null or undefined
                    <DraggableCard
                      key={card.id}
                      id={card.id}
                      name={card.name}
                      color={card.color}
                      onNameChange={handleNameChange}
                      onColorChange={handleColorChange}
                      isEditing={card.id === editingCardId}
                      setEditingCardId={setEditingCardId}
                      onDelete={handleDeleteCard}
                    />
                  )
              )}
            </DroppableContainer>
          </div>
        </div>
      </DndProvider>
      <div className={styles.fichiers}>
        <Fichiers />
      </div>
      <div className={styles.calendrierContainer}>
        <CalendarMain />
      </div>
      <div className={styles.chat}>
        <GroupChat />
      </div>
    </div>
  );
}

export default DashBoard;
