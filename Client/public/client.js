const socket = io();
let name;
let chatBody = document.getElementsByClassName("chatBody")[0];
do {
  name = prompt("Enter your name: ");
} while (!name);

socket.emit("name", name);
msg = {
  name: "You",
};
appendMessage(msg, "join");
let textArea = document.getElementById("chatInput");
let sendBtn = document.getElementById("sendIcon");

//get Message from Client
textArea.addEventListener("keyup", (event) => {
  if (event.key == "Enter" && textArea.value != "") {
    sendMessage(textArea.value);
    textArea.value = "";
    // call function to scroll to bottom
    scrollToBottom();
  }
});

//Mouse click listener on sendBtn
sendBtn.addEventListener("click", (event) => {
  if (textArea.value != "") {
    sendMessage(textArea.value);
    textArea.value = "";
    // call function to scroll to bottom
    scrollToBottom();
  }
});
// Send Message to Server
function sendMessage(message) {
  let msg = {
    name: name,
    message: message,
  };

  appendMessage(msg, "outgoing");
  //send to server
  socket.emit("message", msg);
}
function playAudio(path) {
  var audio = new Audio(path);
  audio.play();
}
//Append Message to client window
function appendMessage(msg, type) {
  //print message

  if (type == "join" && msg["name"] == "You") {
    //Create a div
    playAudio("joined.mp3");
    let div = document.createElement("div");
    div.className = "info";
    div.innerHTML = `<p>${msg["name"]} have Joined The Group Chat</p>`;
    //append div
    chatBody.appendChild(div);
    return;
  } else if (type == "join") {
    playAudio("joined.mp3");
    let div = document.createElement("div");
    div.className = "info";
    div.innerHTML = `<p>${msg["name"]} has Joined The Group Chat</p>`;
    //append div
    chatBody.appendChild(div);
    return;
  } else if (type == "Left") {
    let div = document.createElement("div");
    div.className = "info";
    div.innerHTML = `<p>${msg["name"]} has Left The Group Chat</p>`;
    //append div
    chatBody.appendChild(div);
    playAudio("leave.mp3");
    return;
  }

  if (type === "outgoing") {
    let mainDiv = document.createElement("div");
    let className = "outgoing";
    mainDiv.classList.add(className, "message");
    let markup = `
        <h3>${msg.name}</h3>
        <p>${msg.message}</p>
        `;
    mainDiv.innerHTML = markup;
    chatBody.appendChild(mainDiv);
  } else {
    let mainDiv = document.createElement("div");
    let className = "incoming";
    mainDiv.classList.add(className, "message");
    let markup = `
        <h3>${msg.name}</h3>
        <p>${msg.message}</p>`;
    mainDiv.innerHTML = markup;
    chatBody.appendChild(mainDiv);
    playAudio("receive.mp3");
  }
}

//receive message from server
socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  // call function to scroll to bottom
  scrollToBottom();
});

//Recieve joined user name from server
socket.on("Left", (name1) => {
  msg = { name: name1 };
  appendMessage(msg, "Left");
  // call function to scroll to bottom
  scrollToBottom();
});

//recive left user name from server
socket.on("Joined", (name1) => {
  msg = { name: name1 };
  appendMessage(msg, "join");
  // call function to scroll to bottom
  scrollToBottom();
});

function scrollToBottom() {
  chatBody.scrollTop = chatBody.scrollHeight;
}

