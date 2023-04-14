const { GoogleApis } = require("googleapis");
const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient();

async function getTextFromPDF(fileBuffer) {
  const request = {
    image: { content: fileBuffer },
  };

  const [result] = await client.documentTextDetection(request);
  const fullTextAnnotation = result.fullTextAnnotation;

  return fullTextAnnotation ? fullTextAnnotation.text : "";
}

module.exports = { getTextFromPDF };
