const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Backend setup completed");
});

app.listen(5173);
