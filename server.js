//@ts-check
const express = require("express");
const ws = require("ws");
const path = require("path");
const http = require("http");
const _ = require("lodash");

let store = {
  balls: {},
  clients: [],
};

const app = express();
app.use(express.static(path.resolve(process.cwd(), "static")));

const server = http.createServer(app);

let wss = new ws.Server({ server: server });

wss.on("connection", (e) => {
  let uniqId = _.uniqueId();
  store.clients.push(e);
  store.balls[uniqId] = {
    x: 0,
    y: 0,
    uniqId,
  };

  e.on("message", (m) => {
    let msg = JSON.parse(m);
    store.balls[uniqId] = {
      x: msg.x,
      y: msg.y,
      uniqId,
    };
    store.clients.forEach((el, idx, arr) => {
      try {
        el.send(JSON.stringify(_.compact(Object.values(store.balls))));
      } catch (err) {
        console.log("Websocket error: %s", err);
      }
    });
  });

  e.on("close", (params) => {
    store.balls[uniqId] = null;
  });
});

server.listen(1338, () => {
  console.log(`Listening...`);
});
