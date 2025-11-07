import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: "Missing ?url parameter" });
  }

  try {
    console.log("Fetching:", targetUrl);

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Roblox/WinInet",
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      }
    });

    const text = await response.text();
    res.setHeader("Content-Type", "application/json");
    res.send(text);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch target URL" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Roblox Proxy running on port ${PORT}`);
});
