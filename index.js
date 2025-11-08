import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Simple in-memory cache
// Stores: { url: { data, expires } }
const cache = {};
const CACHE_TTL = 30 * 1000; // 30 seconds cache time

app.get("/", async (req, res) => {
  const target = req.query.url;
  if (!target) {
    return res.status(400).json({ error: "Missing ?url parameter" });
  }

  // ✅ Serve from cache if available
  const cached = cache[target];
  if (cached && cached.expires > Date.now()) {
    console.log("🔁 Cache hit for:", target);
    return res.json(cached.data);
  }

  console.log("🌐 Fetching from Roblox:", target);

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent": "RobloxProxy/1.0 (https://jeiiib-s-proxy.onrender.com)",
        "Accept": "application/json",
      },
    });

    const contentType = response.headers.get("content-type") || "";

    if (response.ok && contentType.includes("application/json")) {
      const data = await response.json();

      // 🧠 Save to cache
      cache[target] = {
        data,
        expires: Date.now() + CACHE_TTL,
      };

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
  console.log("✅ Roblox Proxy with Cache running on port 10000");
});
