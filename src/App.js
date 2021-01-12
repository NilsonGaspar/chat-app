import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";

// components import
import ChatIntro from "./components/ChatIntro";
import ChatRoom from "./components/ChatRoom";
import NewChat from "./components/NewChat";
import Login from "./components/Login";
import HandleData from "./HandleData";
import AddContact from "./components/AddContact";
import Sidebar from "./components/Sidebar";

// firebase
import { auth } from "./Firebase";

function App() {
  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [user, setUser] = useState(""); // logged in user
  const [updateContactList, setUpdateContactList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showSidebar, setShowSidebar] = useState(true);
  const [showChatroom, setShowChatroom] = useState(true);

  useEffect(() => {
    if (user) {
      let unsub = HandleData.GetChatList(user.uid, setChatList);
      return unsub;
    }
  }, [user]);

  useEffect(() => {
    authListener();
  }, []);

  // save logged in user in the database
  const authListener = async () => {
    setIsLoading(true);
    auth.onAuthStateChanged((user) => {
      if (user) {
        SaveLoginData(user);
      } else {
        setUser("");
        ClearInputs();
        setIsLoading(false);
      }
    });
  };
  // show create new chat sidebar
  function HandleNewChat() {
    setShowNewChat(true);
  }
  // show add new contact sidebar
  function HandleAddContact() {
    setShowAddContact(true);
  }

  function ClearInputs() {
    setChatList([]);
    setActiveChat([]);
  }

  async function SaveLoginData(data) {
    let newUser = {
      uid: data.uid,
      userName: data.displayName,
      avatar: data.photoURL,
      email: data.email,
    };
    await HandleData.SaveUserDatabase(newUser);
    setUser(newUser);
  }

  return (
    <>
      {!user ? (
        <Router>
          <Switch>
            <Route path="/">
              <Login getUserData={SaveLoginData} isLoading={isLoading} />
            </Route>
          </Switch>
        </Router>
      ) : (
        <Router>
          <Switch>
            <Route path="/">
              <div className="app">
                <NewChat
                  user={user}
                  chatList={chatList}
                  show={showNewChat}
                  setShow={setShowNewChat}
                  updateContactList={updateContactList}
                />
                <AddContact
                  user={user}
                  show={showAddContact}
                  setShow={setShowAddContact}
                  setUpdateContactList={setUpdateContactList}
                  updateContactList={updateContactList}
                />
                <Sidebar
                  HandleAddContact={HandleAddContact}
                  user={user}
                  HandleNewChat={HandleNewChat}
                  chatList={chatList}
                  setActiveChat={setActiveChat}
                  activeChat={activeChat}
                  setShowChatroom={setShowChatroom}
                  showSidebar={showSidebar}
                  setShowSidebar={setShowSidebar}
                />
                <div className="chatroom">
                  {activeChat.roomId ? (
                    <ChatRoom
                      user={user}
                      activeChat={activeChat}
                      setShowChatroom={setShowChatroom}
                      setShowSidebar={setShowSidebar}
                      showChatroom={showChatroom}
                    />
                  ) : (
                    <ChatIntro user={user} />
                  )}
                </div>
              </div>
            </Route>
          </Switch>
        </Router>
      )}
    </>
  );
}

export default App;
