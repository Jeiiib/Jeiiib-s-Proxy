import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const target = req.query.url;
  if (!target) {
    return res.status(400).json({ error: "Missing ?url parameter" });
  }

  console.log("Fetching:", target);

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent":
          "RobloxProxy/1.0 (https://jeiiib-s-proxy.onrender.com)",
        "Accept": "application/json",
      },
    });

    const contentType = response.headers.get("content-type") || "";

    // Handle Roblox’s JSON data safely
    if (response.ok && contentType.includes("application/json")) {
      const data = await response.json();
      res.json(data);
    } else {
      const text = await response.text();
      res.status(response.status).json({
        error: "Invalid response",
        status: response.status,
        message: text.slice(0, 500),
      });
    }
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed", details: err.message });
  }
});

app.listen(10000, () => {
  console.log("✅ Roblox Proxy running on port 10000");
});
