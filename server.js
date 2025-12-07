const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("bot is alive!");
});

app.listen(3000, () => {
  console.log("web server running on port 3000");
});
