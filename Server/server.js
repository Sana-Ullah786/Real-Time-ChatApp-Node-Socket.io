//require express
const express = require("express");

//app
const app = express();

//http
const http = require("http").createServer(app);

//port
const port = process.env.PORT || 3000;

//listen
http.listen(port, () => {
  console.log(`listening on port ${port}`);
});

//use
app.use(express.static(__dirname + "/public"));

let dict = {};

//route
app.get("/", (req, res) => {
  //Here index.html is the file name
  res.sendFile(__dirname + "/index.html");
});
//socket
const io = require("socket.io")(http);

//on connection
io.on(
  "connection",
  (socket) => {
    //recieve name from client
    socket.on("name", (name) => {
      socket.broadcast.emit("Joined", name);
      dict[socket.id] = name;
    });
    //receive message
    socket.on("message", (msg) => {
      //send message to all clients
      socket.broadcast.emit("message", msg);
    });

    //disconnect
    socket.on("disconnect", () => {
      socket.broadcast.emit("Left", dict[socket.id]);
    });
  } //end of on connection
);
