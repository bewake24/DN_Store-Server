const dateFns = require("date-fns");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;

const logEvents = async (message, logname) => {
  const date = dateFns.format(new Date(), "dd/MM/yyyy\tHH:mm:ss");

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
      console.log("Log Folder Created Successfully");
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logname),
      `${date}\t${uuid()}\t${message}\n`
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  logEvents(
    `${req.method} \t ${req.headers.origin} \t ${req.url}`,
    "reqLog.txt"
  );
  next();
};

module.exports = { logEvents, logger };
