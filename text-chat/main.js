const dataToSend = document.getElementById("dataToSend");
const dataReceive = document.getElementById("dataReceive");
const sendBtn = document.getElementById("sendBtn");

const peer = new Peer();
let connection;

peer.on("open", (id) => {
  document.getElementById("id").textContent = id;
});

// Start a connection
const startCon = () => {
  const peerId = document.getElementById("peerId").value;
  connection = peer.connect(peerId);
  console.log(connection);
};
// Send text
const sendData = () => {
  const data = dataToSend.value;
  // const peerId = document.querySelector("input").value;
  // const dataConnection = peer.connect(peerId);
  connection.send(data);
  console.log(`Sent data: ${data}`);
};

// Listen for remote data

peer.on("connection", (con) => {
  con.on("data", (data) => {
    dataReceive.value += data;
    console.log(`Incoming data: ${data}`);
  });
  con.on("error", (err) => {
    console.error(`${err.name}: ${err.message}`);
  });
});
