import React, { useEffect, useState } from "react";
import styles from "../styles/Calendar.module.css";
import Calendar from "react-calendar";
import Clock from "./Clock";
import "react-calendar/dist/Calendar.css"; // Import the styles
import ButtonCalendar from "./ButtonCalendar";
import { useSelector } from "react-redux";

const CalendarMain = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [eventText, setEventText] = useState("");
  const projectID = useSelector((state) => state.user.value.projectID);
  console.log(events);

  const onChange = (date) => {
    setDate(date);
  };

  const addEvent = () => {
    const dateStr = date.toDateString();
    console.log("Adding event:", eventText, "to date:", dateStr);

    const newEvent = { event: eventText, date: dateStr };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    setEventText("");

    // Send the updated events to the backend
    fetch(
      `https://mindscapebackend-9f2c807f920b.herokuapp.com/projects/updateEvents/${projectID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events: updatedEvents }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("Events updated successfully", data.project.events);
          setEvents(data.project.events);
        } else {
          console.error("Error updating events:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error updating events:", error);
      });
  };

  const tileContent = ({ date, view }) => {
    const dateStr = date.toDateString();
    if (events.some((event) => event.date === dateStr)) {
      return <div className={styles.eventIndicator}></div>;
    }
    return null;
  };

  useEffect(() => {
    fetch(
      `https://mindscapebackend-9f2c807f920b.herokuapp.com/projects/getProjectsEvents/${projectID}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.result) {
          setEvents(data.events);
        } else {
          console.error("Failed to fetch tasks:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [projectID]);
  return (
    <div className={styles.container}>
      <div className={styles.upper}>
        <div className={styles.calendar}>
          <Calendar
            className={styles.calendarObject}
            onChange={onChange}
            value={date}
            tileContent={tileContent}
            tileClassName={({ date, view }) => {
              const dateStr = date.toDateString();
              return events.some((event) => event.date === dateStr)
                ? styles.hasEvent
                : null;
            }}
          />
        </div>
        <div className={styles.addEvent}>
          <div className={styles.clock}>
            <Clock />
          </div>

          <p className={styles.mainT}> {date.toDateString()}</p>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              placeholder="Nouvel évènement"
              className={styles.input}
            />

            <div onClick={addEvent}>
              <ButtonCalendar />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.Events}>
        <div className={styles.mainT}>
          <h3 className={styles.title}>Évènements du jour : </h3>
        </div>

        <ul className={styles.box}>
          {events
            .filter((event) => event.date === date.toDateString())
            .map((event, index) => (
              <li className={styles.list} key={index}>
                {event.event}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarMain;
