import { db } from "./firebase.js";

class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username || "Anonymous";
    this.chats = db.collection("chats");
    this.unsub = null;
  }

  setRoom(newRoom) {
    this.room = newRoom;
    if (this.unsub) this.unsub();
  }

  setUsername(newUsername) {
    this.username = newUsername;
  }

  async addChat(message) {
    const chat = {
      message,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
    };
    await this.chats.add(chat);
  }

  getChats(callback) {
    this.unsub = this.chats.orderBy("created_at").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && change.doc.data().room === this.room) {
          callback(change.doc.data());
        }
      });
    });
  }

  async clearRoom() {
    const snapshot = await this.chats.where("room", "==", this.room).get();

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }
}

export { Chatroom };
