const multer = require("multer");
const path = require("path");
const crypto = require("crypto");




  module.exports = {
  dest:  path.resolve(__dirname,'..', '..', 'uploads'),
  storage : multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve( __dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
const filename = `${hash.toString("hex")}-${file.originalname}`
        // file.key = `${hash.toString("hex")}-${file.originalname}`;
        // file.url = `images/${file.key}`;
        cb(null, filename);
      });
    }
  }),

  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpg",
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/tiff",
      "image/tif",
      "image/bmp",
      "video/x-ms-wmv",
      "video/webm",
      "video/ogg",
      "video/x-msvideo",
      "video/mpeg",
      "video/mp4",
      "video/3gpp",
      "video/x-ms-asf",
      "video/x-ms-asf",
      "video/x-ms-wm",
      "video/x-ms-wmx",
      "video/divx",
      "video/x-flv",
      "video/quicktime",
      "video/x-matroska",
      "video/3gpp2"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }console.log('export')
  }
  
  }