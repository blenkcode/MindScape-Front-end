import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import styles from "../styles/DashBoard.module.css";
import DraggableCard from "./DraggableCard";
import DroppableContainer from "./DroppableContainer";
import Fichiers from "./fichiers";
import CalendarMain from "./CalendarMain";
import GroupChat from "./GroupChat";
import { useSelector } from "react-redux";
function DashBoard() {
  const [cards, setCards] = useState({
    section1: [],
    section2: [],
    section3: [],
  });

  console.log(cards);

  const [editingCardId, setEditingCardId] = useState(null);
  const projectID = useSelector((state) => state.user.value.projectID);
  console.log(projectID);
  // const projectID = "66868492cef7a2aba4b4e075"; // Remplacez par l'ID réel de votre projet

  useEffect(() => {
    fetch(
      `https://mind-scape-back-end.vercel.app/projects/getProjectTasks/${projectID}/tasks`
    )
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

  const handleAddCard = (section) => {
    const newCard = { id: uuidv4(), name: "New Card", color: "#6B6B6B" };
    setCards((prevCards) => ({
      ...prevCards,
      [section]: [...prevCards[section], newCard],
    }));
    setEditingCardId(newCard.id);
    updateProjectTasks(cards); // Automatically enable editing for new card
  };

  const handleNameChange = (id, newName) => {
    setCards((prevCards) => {
      const updatedCards = { ...prevCards };
      for (let section in updatedCards) {
        updatedCards[section] = updatedCards[section].map((card) =>
          card.id === id ? { ...card, name: newName } : card
        );
      }
      return updatedCards;
    });
    setEditingCardId(null);
    updateProjectTasks(cards); // Close editing after name change
  };

  const handleColorChange = (id, newColor) => {
    setCards((prevCards) => {
      const updatedCards = { ...prevCards };
      for (let section in updatedCards) {
        updatedCards[section] = updatedCards[section].map((card) =>
          card.id === id ? { ...card, color: newColor } : card
        );
      }
      updateProjectTasks(cards);
      return updatedCards;
    });
  };

  const handleDrop = (section, id) => {
    setCards((prevCards) => {
      let cardToMove;
      const updatedCards = { ...prevCards };
      for (let sec in updatedCards) {
        updatedCards[sec] = updatedCards[sec].filter((card) => {
          if (card.id === id) {
            cardToMove = card;
            return false;
          }
          return true;
        });
      }
      updatedCards[section] = [...updatedCards[section], cardToMove];
      updateProjectTasks(updatedCards);
      return updatedCards;
    });
  };

  const handleDeleteCard = (id) => {
    setCards((prevCards) => {
      const updatedCards = { ...prevCards };
      for (let section in updatedCards) {
        updatedCards[section] = updatedCards[section].filter(
          (card) => card.id !== id
        );
      }
      return updatedCards;
    });
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
              {cards.section1.map((card) => (
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
              ))}
            </DroppableContainer>
          </div>
          <div className={styles.section2}>
            <div className={styles.titleSection}>En cours :</div>
            <DroppableContainer onDrop={(id) => handleDrop("section2", id)}>
              {cards.section2.map((card) => (
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
              ))}
            </DroppableContainer>
          </div>
          <div className={styles.section3}>
            <div className={styles.titleSection}>Terminé :</div>
            <DroppableContainer onDrop={(id) => handleDrop("section3", id)}>
              {cards.section3.map((card) => (
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
              ))}
            </DroppableContainer>
          </div>
        </div>
      </DndProvider>

      <div className={styles.calendrierContainer}>
        <CalendarMain />
      </div>
      <div className={styles.chat}>
        <GroupChat></GroupChat>
      </div>
    </div>
  );
}

export default DashBoard;
