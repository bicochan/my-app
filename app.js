require("dotenv").config();

const express = require("express");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const port = 3001;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.use(express.static(__dirname + "/"));

app.get("/auth", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.readonly"],
  });

  res.redirect(authUrl);
});

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    const userInfo = await youtube.channels.list({
      part: "snippet",
      mine: true,
    });

    res.json(userInfo.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
