import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "urls.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const short = req.query.id;
  const dest = data[short];

  if (!dest) {
    return res.status(404).send("Short link not found");
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

const WEBHOOK_URL = "https://webhook.site/348541dd-aff4-4c93-9b82-fbf680af8acd"; 

fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: short,
      ip: ip,
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {});

  return res.redirect(dest);
}
