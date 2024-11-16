const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { validateUsername } = require("../utils/inputValidation/validators.js");

const storage = multer.diskStorage({
  destination: function (req, _, cb) {
    const username = req.user?.username || validateUsername(req.body.username);

    if (!username) {
      // Tell the multer to skip uploading the file
      return cb(
        new Error("Invalid username provided, skipping the file upload"),
        false
      );
    }

    const uploadFilePath = path.join(
      __dirname,
      "..",
      "public",
      "uploads",
      username
    );

    //Check if Filepath exists or not
    if (!fs.existsSync(uploadFilePath)) {
      fs.mkdirSync(uploadFilePath, { recursive: true });
    }

    cb(null, uploadFilePath);
  },
  filename: function (_, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
