import app from "../server/index";

export default async function handler(req, res) {
  console.log("API Handler started:", {
    method: req.method,
    url: req.url,
    headers: req.headers,
  });

  try {
    // Appel du serveur Express
    await app(req, res);

    // Log après la réponse envoyée
    res.on("finish", () => {
      console.log("Response sent successfully");
    });

    res.on("error", (error) => {
      console.error("Response error:", error);
    });
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Server Error" });
  }
}
