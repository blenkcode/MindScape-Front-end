import React, { useState, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/DraggableCard.module.css";

const DraggableCard = ({
  id,
  name,
  color,
  onNameChange,
  onColorChange,
  isEditing,
  setEditingCardId,
  onDelete,
}) => {
  const [isEditingState, setIsEditingState] = useState(isEditing);
  const [newName, setNewName] = useState(name);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsEditingState(isEditing);
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleNameClick = () => {
    setEditingCardId(id);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNameBlur = () => {
    setIsEditingState(false);
    onNameChange(id, newName);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setIsEditingState(false);
      onNameChange(id, newName);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const handleColorChange = (newColor) => {
    onColorChange(id, newColor);
  };

  return (
    <div
      ref={drag}
      className={styles.card}
      style={{ opacity: isDragging ? 0.5 : 1, backgroundColor: color }}
    >
      {isEditingState ? (
        <input
          type="text"
          value={newName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          onKeyPress={handleKeyPress}
          autoFocus
          className={styles.input}
        />
      ) : (
        <span onClick={handleNameClick}>{name}</span>
      )}

      <div className={styles.actions}>
        <FontAwesomeIcon
          className={styles.icon}
          icon={faEllipsis}
          onClick={toggleDropdown}
        />
        {isDropdownVisible && (
          <div ref={dropdownRef} className={styles.dropdown}>
            <div className={styles.dropdownItem} onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </div>
            <div className={styles.dropdownItem}>
              <span
                onClick={() => handleColorChange("#7F3EBC")}
                className={styles.colorOption}
                style={{ backgroundColor: "#7F3EBC" }}
              />
              <span
                onClick={() => handleColorChange("#E37400")}
                className={styles.colorOption}
                style={{ backgroundColor: "#E37400" }}
              />
              <span
                onClick={() => handleColorChange("#1E90FF")}
                className={styles.colorOption}
                style={{ backgroundColor: "#1E90FF" }}
              />
              <span
                onClick={() => handleColorChange("#3A5F1E")}
                className={styles.colorOption}
                style={{ backgroundColor: "#3A5F1E" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggableCard;
