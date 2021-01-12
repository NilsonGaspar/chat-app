import firebase from "firebase";
import { auth, googleProvider } from "./Firebase";
import firestore from "./Firebase";

export default {
  SignInWithGoogle: async () => {
    let result = await auth.signInWithPopup(googleProvider);
    return result;
  },

  SaveUserDatabase: async (data) => {
    let saveUser = await firestore.collection("user").doc(data.uid).set(
      {
        uid: data.uid,
        userName: data.userName,
        avatar: data.avatar,
        email: data.email,
      },
      { merge: true }
    );
    console.log(saveUser);
  },

  // called at NewChat
  GetContactList: async (userId) => {
    let contactList = [];
    let results = await firestore.collection("user").doc(userId).collection("contacts").get();
    results.forEach((result) => {
      let data = result.data();
      if (result.exists) {
        contactList.push({
          uid: result.id,
          userName: data.userName,
          avatar: data.avatar,
        });
      }
    });

    return contactList;
  },

  // called at AddContact
  GetAllUsersList: async (userId) => {
    let allUsersList = [];
    let results = await firestore.collection("user").get();
    results.forEach((result) => {
      let data = result.data();
      // don't add logged in user in the list
      if (result.id !== userId) {
        allUsersList.push({
          uid: result.id,
          userName: data.userName,
          avatar: data.avatar,
        });
      }
    });
    return allUsersList;
  },

  CreateNewChat: async (user, user2) => {
    const roomSnapshot = await firestore
      .collection("user")
      .doc(user.uid)
      .collection("rooms")
      .where("recipient", "==", user2.uid)
      .get();
    if (roomSnapshot.empty) {
      // check if both users already have a chatroom created
      let newChat = await firestore.collection("room").add({
        userName: user.userName,
        members: [user.uid, user2.uid],
        roomTitle: user2.userName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: user.uid,
      });
      firestore.collection("message").doc(newChat.id).collection("messages").add({});
      firestore
        .collection("user")
        .doc(user.uid)
        .collection("rooms")
        .doc(newChat.id)
        .set({
          roomId: newChat.id,
          roomTitle: user2.userName,
          avatar: user2.avatar,
          recipient: user2.uid,
          recentMessageText: "You and " + user2.userName + " are now connected",
        });
      firestore
        .collection("user")
        .doc(user2.uid)
        .collection("rooms")
        .doc(newChat.id)
        .set({
          roomId: newChat.id,
          roomTitle: user.userName,
          avatar: user.avatar,
          recipient: user.uid,
          recentMessageText: "You and " + user.userName + " are now connected",
        });
    }
  },

  HandleAddContact: (user, user2) => {
    firestore.collection("user").doc(user.uid).collection("contacts").doc(user2.uid).set({
      uid: user2.uid,
      userName: user2.userName,
      avatar: user2.avatar,
    });
    firestore.collection("user").doc(user2.uid).collection("contacts").doc(user.uid).set({
      uid: user.uid,
      userName: user.userName,
      avatar: user.avatar,
    });
  },

  // called at sidebar
  GetChatList: async (userId, setChatList) => {
    return firestore
      .collection("user")
      .doc(userId)
      .collection("rooms")
      .onSnapshot((snapshot) => {
        let data = snapshot.docs.map((doc) => doc.data());
        if (data) setChatList(data);
      });
  },

  GetChatMessage: (activeChat, setMessageList, setChatMembers) => {
    firestore
      .collection("room")
      .doc(activeChat.roomId)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          let data = snapshot.data();
          setChatMembers(data.members);
        } else {
          console.log("Members document does not exist");
        }
      });

    firestore
      .collection("message")
      .doc(activeChat.roomId)
      .collection("messages")
      .orderBy("sentAt")
      .onSnapshot((snapshot) => {
        let data = snapshot.docs.map((doc) => doc.data());
        if (data) {
          setMessageList(data);
        }
      });
  },

  // called at
  SendMessage: (user, activeChat, textInput, chatMembers) => {
    firestore.collection("message").doc(activeChat.roomId).collection("messages").add({
      messageText: textInput,
      sentBy: user.uid,
      sentAt: firebase.firestore.FieldValue.serverTimestamp(),
      avatar: user.avatar,
    });
    if (chatMembers) {
      for (let i in chatMembers) {
        firestore
          .collection("user")
          .doc(chatMembers[i])
          .collection("rooms")
          .doc(activeChat.roomId)
          .update({
            recentMessageText: textInput,
            sentAt: new Date(),
          });
      }
    }
  },
};
