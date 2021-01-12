import React, { useState, useEffect } from "react";
import "./MessageList.css";
import { Avatar } from "@material-ui/core";
// called at chat room
function MessageList({ data, user }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    if (data.sentAt > 0) {
      let date = new Date(data.sentAt.seconds * 1000);
      let hours = date.getHours();
      let minutes = date.getMinutes();
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      setTime(`${hours}:${minutes}`);
    }
  });

  return (
    <div className={`message__list ${user.uid === data.sentBy ? "senderMode" : ""}`}>
      <Avatar
        className={`message__list__avatar ${user.uid === data.sentBy ? "senderMode" : ""}`}
        alt={data.userName + " picture profile"}
        src={data.avatar}
      />
      <div className={`message__list__info ${user.uid === data.sentBy ? "senderMode" : ""}`}>
        <div className="message__text">{data.messageText}</div>
        <div className="message__date">{time}</div>
      </div>
    </div>
  );
}

export default MessageList;
