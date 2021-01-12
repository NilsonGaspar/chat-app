import React, { useState, useEffect } from "react";
import "./ChatList.css";

// icons
import Avatar from "@material-ui/core/Avatar";

// called at sidebar
function ChatList({ activeChat, chatListData, setActiveChat, setShowChatroom, setShowSidebar }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    if (chatListData.sentAt > 0) {
      let date = new Date(chatListData.sentAt.seconds * 1000);
      let hours = date.getHours();
      let minutes = date.getMinutes();
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      setTime(`${hours}:${minutes}`);
    }
  });

  return (
    <div
      className={`chat__list ${activeChat && "active"}`}
      onClick={() => {
        setActiveChat(chatListData);
        setShowChatroom(true);
        setShowSidebar(false);
      }}
    >
      <Avatar className="chat__list__avatar" alt="" src={chatListData.avatar} />
      <div className="chat__list__container">
        <div className="chat__list__content">
          <div className="chat__list__name">{chatListData.roomTitle}</div>
          <div className="chat__list__date">{time}</div>
        </div>
        <div className="chat__list__content">
          <div className="chat__list__recentMsg">
            <p>{chatListData.recentMessageText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatList;
