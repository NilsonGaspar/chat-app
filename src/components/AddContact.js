import React, { useState, useEffect } from "react";
import "./AddContact.css";

import HandleData from "../HandleData";

// icons
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { Avatar } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import NewChat from "./NewChat";

// called at App
function AddContact({ user, show, setShow, updateContactList, setUpdateContactList }) {
  const [allUsersList, setallUsersList] = useState([]);
  const [search, setSearch] = useState("");

  const filterallUsersList = allUsersList.filter((contact) => {
    return contact.userName.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    async function GetAllUsersList() {
      if (user) {
        let result = await HandleData.GetAllUsersList(user.uid);
        setallUsersList(result);
      }
    }
    GetAllUsersList();
  }, [user]);

  function HandleCloseChat() {
    setShow(false);
  }

  function HandleUpdateContactList() {
    if (updateContactList === false) {
      setUpdateContactList(true);
    } else {
      setUpdateContactList(false);
    }
  }

  async function HandleAddContact(user2) {
    await HandleData.HandleAddContact(user, user2);
    HandleCloseChat();
    if (search) {
      setSearch("");
    }
  }

  return (
    <div className={`addcontact ${show ? "active" : ""}`}>
      <div className="addcontact__header">
        <div onClick={HandleCloseChat} className="addcontact__back__button material__icons__white">
          <ArrowBackIosIcon />
        </div>

        <div className="addcontact__title">Add New Contact</div>
      </div>

      <div className="addcontact__contact__list">
        <div className="addcontact__search">
          <div className="addcontact__search__input">
            <div className="material__icons__grey">
              <SearchIcon />
            </div>

            <input
              placeholder="Search for contacts name"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {search ? (
          <>
            {filterallUsersList.map((contact) => (
              <div
                key={contact.uid}
                onClick={() => {
                  HandleAddContact(contact);
                  HandleUpdateContactList();
                }}
                className="addcontact__contact__item"
              >
                <Avatar
                  className="addcontact__contact__avatar"
                  alt={contact.userName + " picture profile"}
                  src={contact.avatar}
                />
                <div className="addcontact__contact__name">{contact.userName}</div>
              </div>
            ))}
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default AddContact;
