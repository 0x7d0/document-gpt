import { getTextFromPDF } from "../../lib/ocr";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { fileBuffer } = req.body;
      const text = await getTextFromPDF(Buffer.from(fileBuffer, "base64"));
      res.status(200).json({ text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to extract text from the PDF file" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
