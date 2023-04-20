import { checkGoogleCloudVisionAPIConnection } from "../../lib/ocr";

export default async (req, res) => {
  try {
    const result = await checkGoogleCloudVisionAPIConnection();
    res.status(200).json({ status: "OK" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
