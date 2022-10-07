const peer1 = new Peer();
const peer2 = new Peer();
let idPeer1, idPeer2;

peer1.on("open", (id) => {
  console.log(`peer1 ID is: ${peer1.id}`);
  idPeer1 = id;
  const printID = document.getElementById("peer1");
  printID.textContent += id;
});

peer2.on("open", (id) => {
  console.log(`peer2 ID is: ${id}`);
  idPeer2 = id;
  const printID = document.getElementById("peer2");
  printID.textContent += id;
});

// peer1 calls and peer2 answers
let call; // mediaConnection
// calling
const startCall = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  document.getElementById("localVideo").srcObject = stream;
  document.getElementById("localVideo").play();

  call = peer1.call(idPeer2, stream);
  console.log("calling");
  console.log(call);
  peer1.on("error", (err) => {
    console.error(`${err.name}: ${err.message}`);
  });
};

// answering
const answerCall = () => {
  peer2.on("call", (call) => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      // show local user video stream
      document.getElementById("remoteVideo").srcObject = stream;
      document.getElementById("remoteVideo").play();
      call.answer(stream);
    });
    console.log("answering call");
    console.log(call);

    // remote video stream
    call.on("stream", (stream) => {
      document.getElementById("remoteVideo").srcObject = stream;
    });

    peer2.on("error", (err) => {
      console.error(`${err.name}: ${err.message}`);
    });
  });
};
// hang up
const endCall = () => {
  call.close();
  console.log("closing connection");
};
