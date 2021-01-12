import React, { useState, useEffect } from "react";
import "./NewChat.css";

import HandleData from "../HandleData";

// icons
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { Avatar } from "@material-ui/core";

// called at App
function NewChat({ user, show, setShow, updateContactList }) {
  const [contactList, setContactList] = useState([]);

  useEffect(() => {
    async function GetContactList() {
      if (user) {
        let result = await HandleData.GetContactList(user.uid);
        setContactList(result);
      }
    }
    GetContactList();
  }, [user, updateContactList]);

  function HandleCloseChat() {
    setShow(false);
  }

  async function CreateNewChat(user2) {
    await HandleData.CreateNewChat(user, user2);

    HandleCloseChat();
  }

  return (
    <div className={`newchat ${show ? "active" : ""}`}>
      <div className="newchat__header">
        <div onClick={HandleCloseChat} className="newchat__back__button material__icons__white">
          <ArrowBackIosIcon />
        </div>

        <div className="newchat__title">New Conversations</div>
      </div>

      <div className="newchat__contact__list">
        {contactList.map((contact) => (
          <div
            key={contact.uid}
            onClick={() => CreateNewChat(contact)}
            className="newchat__contact__item"
          >
            <Avatar
              className="newchat__contact__avatar"
              alt={contact.userName + " picture profile"}
              src={contact.avatar}
            />
            <div className="newchat__contact__name">{contact.userName}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewChat;
