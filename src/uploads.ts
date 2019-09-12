import { createWriteStream } from "fs";
import { resolve } from "path";
import { sync } from "mkdirp"
import { generate } from "shortid";
const uploadDir = resolve(__dirname, "../Images");

// Ensure upload directory exists
sync(uploadDir);

const storeUpload = async ({ stream, filename }:any) => {
  const id = generate();
  const file = `${id}-${filename}`;
  const path = `${uploadDir}/${file}`;
  // const urlPath = `files/${file}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve({ id, path: file }))
      .on("error", reject)
  );
};

export async function processUpload(file:any) {
  const { stream, filename } = await file;
  //@ts-ignore
  const { id, path } = await storeUpload({ stream, filename });
  return { id, filename, path };
}