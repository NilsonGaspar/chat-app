import React, { useEffect, useState, useRef } from "react";
import "./ChatRoom.css";

// components import
import MessagesList from "./MessageList";

import EmojiPicker from "emoji-picker-react";

// icons
import Avatar from "@material-ui/core/Avatar";
import SearchIcon from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import SendIcon from "@material-ui/icons/Send";
import MicIcon from "@material-ui/icons/Mic";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

import HandleData from "../HandleData";

// called at App
function ChatRoom({ user, activeChat, showChatroom, setShowChatroom, setShowSidebar }) {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [speechListening, setSpeechListening] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [chatMembers, setChatMembers] = useState([]);
  const EndPoint = useRef();

  useEffect(() => {
    EndPoint.current.scrollIntoView(); // scrool to the bottom
  }, [activeChat.roomId, messageList]);

  useEffect(() => {
    setMessageList([]);
    let unsub = HandleData.GetChatMessage(activeChat, setMessageList, setChatMembers, chatMembers);
    return unsub;
  }, [activeChat.roomId]);

  // join emoji and text inside text input
  function HandleEmojiClick(e, emojiObecject) {
    //console.log(emojiObecject);
    setTextInput(textInput + emojiObecject.emoji);
  }

  // open and close emoji tab
  function HandleOpenEmoji() {
    if (openEmoji === false) {
      setOpenEmoji(true);
    } else {
      setOpenEmoji(false);
    }
  }

  function TranscribeVoiceMesssage() {
    let recognition = null;
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
    }

    if (recognition) {
      recognition.onstart = function () {
        setSpeechListening(true);
      };
      recognition.onend = function () {
        setSpeechListening(false);
      };
      recognition.onresult = function (e) {
        setTextInput(e.results[0][0].transcript);
      };
      recognition.start();
    }
  }

  function SendMesssage(e) {
    e.preventDefault();
    if (textInput) {
      HandleData.SendMessage(user, activeChat, textInput, chatMembers);
      setTextInput("");
      setOpenEmoji(false);
    }
  }

  return (
    <div className={`chatroom ${showChatroom ? "active" : "inactive"}`}>
      <div className="chatroom__header">
        <div className="chatroom__header__info">
          <div
            className="material__icons__grey setDisplay"
            onClick={() => {
              setShowChatroom(false);
              setShowSidebar(true);
            }}
          >
            <ArrowBackIosIcon />
          </div>
          <Avatar className="chatroom__header__avatar" alt="" src={activeChat.avatar} />
          <div className="chatroom__header__name">{activeChat.roomTitle}</div>
        </div>

        <div className="chatroom__header__buttons">
          <div className="material__icons__grey">
            <MoreVertIcon />
          </div>
        </div>
      </div>

      <div className="chatroom__body">
        {messageList.map((message) => (
          <MessagesList key={message.sentAt} data={message} user={user} />
        ))}
        <div ref={EndPoint}></div>
      </div>

      <div className={`chatroom__emoji__body ${openEmoji && "active"}`}>
        <EmojiPicker onEmojiClick={HandleEmojiClick} disableSearchBar />
      </div>

      <div className="chatroom__footer">
        <div className="chatroom__footer__left">
          <div
            className={`material__icons__grey ${openEmoji && "active"}`}
            onClick={HandleOpenEmoji}
          >
            <InsertEmoticonIcon />
          </div>
        </div>

        <div className="chatroom__footer__input">
          <form onSubmit={SendMesssage}>
            <input
              className="chatroom__input"
              type="text"
              placeholder="Send a message"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </form>
        </div>

        <div className="chatroom__footer__right">
          {textInput ? (
            <div onClick={SendMesssage} className="material__icons__grey">
              <SendIcon />
            </div>
          ) : (
            <div
              onClick={TranscribeVoiceMesssage}
              className={`material__icons__grey ${speechListening && "active"}`}
            >
              <MicIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
