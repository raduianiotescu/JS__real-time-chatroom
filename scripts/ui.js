import { Chatroom } from "./chat.js";

function initUI() {
  const chatList = document.querySelector(".chat-list");
  const newChatForm = document.getElementById("new-chat-form");
  const newNameForm = document.getElementById("new-name-form");
  const rooms = document.querySelectorAll(".chat-rooms button");
  const updateMessage = document.querySelector(".update-mssg");
  const displayUsername = document.getElementById("current-username");
  const clearRoomBtn = document.getElementById("clear-room");

  let username = localStorage.getItem("username") || "Anonymous";
  let currentRoom = "general";

  displayUsername.textContent = username;

  const chatroom = new Chatroom(currentRoom, username);

  function renderChat(data) {
    const when = data.created_at?.toDate?.() || new Date();
    const time = when.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerHTML = `<span class="username font-weight-bold">${data.username}: </span>
                    <span class="message">${data.message}</span>
                    <div class="time text-muted small">${time}</div>`;
    chatList.appendChild(li);
    chatList.scrollTop = chatList.scrollHeight;
  }

  chatroom.getChats(renderChat);

  rooms.forEach((button) => {
    button.addEventListener("click", () => {
      chatList.innerHTML = "";
      currentRoom = button.id;
      chatroom.setRoom(currentRoom);
      chatroom.getChats(renderChat);
    });
  });

  newChatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = newChatForm.message.value.trim();
    if (message.length > 0) {
      chatroom.addChat(message).then(() => newChatForm.reset());
    }
  });

  newNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newName = newNameForm.name.value.trim();
    if (newName.length > 0) {
      chatroom.setUsername(newName);
      localStorage.setItem("username", newName);
      displayUsername.textContent = newName; 
      updateMessage.textContent = `Your name was updated to ${newName}`;
      setTimeout(() => (updateMessage.textContent = ""), 3000);
      newNameForm.reset();
    }
  });

  clearRoomBtn.addEventListener("click", async () => {
    if (
      confirm(
        `Are you sure you want to clear all messages from #${currentRoom}?`
      )
    ) {
      await chatroom.clearRoom();
      chatList.innerHTML = "";
    }
  });
}

export { initUI };
