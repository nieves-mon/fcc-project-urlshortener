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

const urls = [];

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

  const idx = urls.findIndex((el) => el == url);
  if (idx != -1) {
    res.json({ original_url: url, short_url: idx });
    return;
  }

  if (!isValidUrl(url)) {
    res.json({ error: "invalid url" });
    return;
  }

  urls.push(url);

  res.json({ original_url: url, short_url: urls.length - 1 });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const idx = req.params.short_url;

  if (!urls[idx]) {
    res.json({ error: "invalid short url" });
  }

  const url = urls[idx];
  res.redirect(url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
