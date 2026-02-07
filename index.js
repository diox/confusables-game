const express = require("express");
const basicAuth = require("express-basic-auth");
const path = require("path");
const db = require('better-sqlite3')('confusables.db');

app = express();

app.use("/static", express.static("static", { maxAge: "365d" }));

app.use(
  basicAuth({
    users: { user: "VzGkffaInLnmi7k82TjrV6Z1" },
    challenge: true,
    realm: "confusables-game",
  }),
);

app.get("/", function (req, res) {
  // Might be a real view template someday... but not now.
  res.status(200).sendFile(path.join(__dirname, "/views/index.html"));
});

app.post("/record", express.json(), function (req, res) {
  const statement = db.prepare('INSERT INTO confusables (timestamp, user, confusable, alphabet) VALUES (?, ?, ?, ?)');
  console.log("Recording for %s!", req.auth.user, req.body);
  statement.run(Date.now(), req.auth.user, req.body.confusable, req.body.alphabet);  
  res.status(202).send();
});

app.listen(8989);
