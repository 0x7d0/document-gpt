import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

// Create a new instance of the Storage class
const storage = new Storage();

// Set the name of the bucket where files will be uploaded
const bucketName = "<your_bucket_name>";

/**
 * Uploads a file to Google Cloud Storage.
 * Returns the URL of the uploaded file.
 */
export async function uploadFile(file) {
  // Generate a unique filename for the uploaded file
  const filename = `${uuidv4()}.pdf`;

  // Upload the file to Google Cloud Storage
  await storage.bucket(bucketName).upload(file.path, {
    destination: filename,
    contentType: "application/pdf",
  });

  // Generate a signed URL for the uploaded file
  const signedUrl = await storage.bucket(bucketName).file(filename).getSignedUrl({
    action: "read",
    expires: "01-01-2100",
  });

  // Return the URL of the uploaded file
  return signedUrl[0];
}
