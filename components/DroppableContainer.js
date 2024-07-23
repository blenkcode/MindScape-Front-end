import React from "react";
import { useDrop } from "react-dnd";
import styles from "../styles/DroppableContainer.module.css";

const DroppableContainer = ({ children, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item) => {
      if (onDrop) {
        onDrop(item.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={isOver ? styles.containerhover : styles.container}
    >
      {children}
    </div>
  );
};

export default DroppableContainer;
