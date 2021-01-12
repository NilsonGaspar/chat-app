import React from "react";
import "./ChatIntro.css";

// icons
import Avatar from "@material-ui/core/Avatar";

function ChatIntro({ user }) {
  return (
    <div className="chat__intro inactive">
      <Avatar alt="" src={user.avatar} />
      <h1 className="name">Hello. {user.userName}</h1>
    </div>
  );
}

export default ChatIntro;
