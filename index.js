require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

let urlCount = 0;
const urls = {};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;

  if (urls[url]) {
    res.json({ original_url: url, short_url: urls[url] });
  }

  if (!isValidUrl(url)) {
    res.json({ error: "invalid url" });
  }

  urlCount++;
  urls[url] = urlCount;

  res.json({ original_url: url, short_url: urls[url] });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
