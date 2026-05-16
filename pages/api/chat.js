export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: "Nachricht fehlt" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: `Du bist ein freundlicher KI-Assistent für Alexandros Ohnesorge — Webdesign und KI-Automatisierung aus Dresden. Beantworte Fragen zu Webdesign, Preisen und Automatisierung kurz und direkt (max. 2-3 Sätze). Immer auf Deutsch. Preise: Website ab 890€, Automation ab 490€, Kombi ab 1.290€. Festpreis, 7 Tage Lieferzeit. Bei konkreten Projekten: kostenloses Erstgespräch empfehlen.`,
        messages: [{ role: "user", content: message.trim() }],
      }),
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? "Entschuldigung, ein Fehler ist aufgetreten.";
    res.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    res.status(500).json({ error: "Serverfehler" });
  }
}
