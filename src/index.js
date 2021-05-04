const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/index.route");
const app = express();
const port = process.env.PORT || 3000;
var cors = require("cors");
const { logger } = require("./middlewares");

app.use(logger);
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "hi" });
});

app.use("/api", route);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
