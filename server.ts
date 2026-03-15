import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Zapis do pliku data.json
  app.post("/api/data", async (req, res) => {
    try {
      const data = req.body;
      const dataPath = path.join(__dirname, "public", "data.json");
      await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8");
      res.json({ success: true, message: "Dane zostały zapisane do pliku data.json" });
    } catch (error) {
      console.error("Błąd podczas zapisu do pliku data.json:", error);
      res.status(500).json({ success: false, error: "Nie udało się zapisać danych" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
