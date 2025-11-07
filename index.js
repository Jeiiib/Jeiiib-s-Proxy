import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// 🟢 Automatically forward everything after the slash
app.use(async (req, res) => {
  const targetUrl = "https://apis.roblox.com" + req.url; // default base
  const altDomains = [
    "https://catalog.roblox.com",
    "https://games.roblox.com",
    "https://users.roblox.com",
    "https://thumbnails.roblox.com",
    "https://economy.roblox.com",
    "https://inventory.roblox.com",
  ];

  try {
    // try each Roblox domain until one works
    for (const domain of altDomains) {
      const response = await fetch(domain + req.url, {
        method: req.method,
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.text();
        res.status(response.status).send(data);
        return;
      }
    }

    res.status(404).send("No valid Roblox endpoint found.");
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Proxy running on port " + port));
