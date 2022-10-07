const peer = new Peer();

let currentCall;
// show my id on screen
peer.on("open", (id) => {
  document.getElementById("id").textContent = id;
});
// Making a call
const startCall = async () => {
  // get id entered by user
  const peerId = document.querySelector("input").value;
  // get video stream
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  // show local user video stream
  document.getElementById("localVideo").srcObject = stream;
  document.getElementById("localVideo").play();
  // call remote peer
  const call = peer.call(peerId, stream);
  // when remote peer adds stream, display it
  call.on("stream", (stream) => {
    document.getElementById("remoteVideo").srcObject = stream;
    document.getElementById("remoteVideo").play();
  });
  call.on("error", (err) => {
    console.error(`${err.name}: ${err.message}`);
  });

  currentCall = call;
};

// Answering a call
peer.on("call", (call) => {
  if (confirm(`Accept call from ${call.peer}?`)) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // show local user video stream
        document.getElementById("localVideo").srcObject = stream;
        document.getElementById("localVideo").play();
        // answer call
        call.answer(stream);
        currentCall = call;

        call.on("stream", (remoteStream) => {
          // display remote stream
          document.getElementById("remoteVideo").srcObject = remoteStream;
          document.getElementById("remoteVideo").play();
        });
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });
  } else {
    call.close();
  }
});

// Ending call
const endCall = () => {
  currentCall.close();
  console.log("hanging up");
};

// Text chat
const dataToSend = document.getElementById("dataToSend");
const dataReceive = document.getElementById("dataReceive");
const sendBtn = document.getElementById("sendBtn");

const sendData = () => {
  const data = dataToSend.value;
  const peerId = document.querySelector("input").value;
  const dataConnection = peer.connect(peerId);
  dataConnection.send(data);
  console.log(`Sent data: ${data}`);
  console.log(dataConnection);
};

peer.on("connection", (con) => {
  con.on("data", (data) => {
    dataReceive.value += data;
    console.log(`Incoming data: ${data}`);
    con.send("muuu");
  });
});
