const socket = new WebSocket(
  `ws://${window.location.hostname}:${window.location.port}`
);

function createPoint(props) {
  let messageElem = document.createElement("div");
  messageElem.appendChild(document.createTextNode(props.uniqId));
  messageElem.className = "thing";
  messageElem.id = props.uniqId;

  messageElem.style.setProperty("--px", props.x + "px");
  messageElem.style.setProperty("--py", props.y + "px");

  document.getElementById("root").appendChild(messageElem);
}

function updatePoint(props) {
  let messageElem = document.getElementById(props.uniqId);

  messageElem.style.setProperty("--px", props.x + "px");
  messageElem.style.setProperty("--py", props.y + "px");
}

socket.onmessage = function (event) {
  let inc = JSON.parse(event.data);
  inc.forEach((el, idx, arr) => {
    if (document.getElementById(el.uniqId)) {
      updatePoint(el);
    } else {
      createPoint(el);
    }
  });
};

document.querySelector("#root").addEventListener("mousemove", (e) => {
  let msg = JSON.stringify({
    x: e.clientX,
    y: e.clientY,
  });
  socket.send(msg);
});
