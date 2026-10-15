import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
function uploadMiddleware() {
  const allowedFiles = {
    "application/pdf": ".pdf",
    "video/mp4": ".mp4",
  };
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        mkdirSync("./uploads", { recursive: true });
        cb(null, "./uploads");
      } catch (error) {
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      const extension = allowedFiles[file.mimetype];
      const fileName = `${randomUUID()}${extension}`;
      cb(null, fileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "video/mp4") {
      return cb(null, true);
    }

    const error = new Error("Only PDF and MP4 files are allowed");
    error.status = 400;
    cb(error);
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 1,
    },
  }).single("file");

  return upload;
}
export default uploadMiddleware;
