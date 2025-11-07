import express from "express";
import fetch from "node-fetch";
const app = express();

app.all("*", async (req, res) => {
  const target = req.originalUrl.slice(1);
  if (!target.startsWith("http")) return res.send("Missing URL");
  try {
    const r = await fetch(target);
    const text = await r.text();
    res.set("Content-Type", r.headers.get("content-type") || "text/plain");
    res.send(text);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
