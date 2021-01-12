import React, { useState, useEffect } from "react";
import "./Sidebar.css";

// icons
import ChatIcon from "@material-ui/icons/Chat";
import SearchIcon from "@material-ui/icons/Search";
import { Avatar } from "@material-ui/core";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

// components import
import ChatList from "./ChatList";
import { auth } from "../Firebase";

function Sidebar({
  chatList,
  activeChat,
  setActiveChat,
  HandleAddContact,
  user,
  HandleNewChat,
  showSidebar,
  setShowSidebar,
  setShowChatroom,
}) {
  const [search, setSearch] = useState("");
  const filterChatList = chatList.filter((room) => {
    return room.roomTitle.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    if (search) {
      setSearch("");
    }
  }, [activeChat]);

  function SignOut() {
    auth.currentUser && auth.signOut();
    window.location.reload();
  }

  return (
    <div className={`sidebar ${showSidebar ? "active" : "inactive"}`}>
      <div className="sidebar__header">
        <Avatar className="sidebar__header__avatar" alt="" src={user.avatar} />

        <div className="sidebar__header__buttons">
          <div onClick={HandleAddContact} className="material__icons__grey">
            <PersonAddOutlinedIcon />
          </div>

          <div onClick={HandleNewChat} className="material__icons__grey">
            <ChatIcon />
          </div>

          <div onClick={SignOut} className="material__icons__grey">
            <ExitToAppIcon />
          </div>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__search__input">
          <div className="material__icons__grey">
            <SearchIcon />
          </div>

          <input
            placeholder="search for messages"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar__chat__list">
        {filterChatList.map((chat, key) => (
          <ChatList
            key={chat.roomId}
            chatListData={chat}
            setActiveChat={setActiveChat}
            activeChat={activeChat.roomId === chat.roomId}
            setShowChatroom={setShowChatroom}
            setShowSidebar={setShowSidebar}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
