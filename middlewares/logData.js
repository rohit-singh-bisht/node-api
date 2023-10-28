const fs = require("fs");

function logReqRes(filename) {
  return (req, res, next) => {
    const userIP = req.ip;
    const reqURL = req.url;
    const logData = `${new Date(Date.now()).toLocaleString()}, IP: ${userIP}, ${
      req.method
    } ${reqURL}\n`;
    fs.appendFile(filename, logData, (err, data) => {
      if (err) return res.json("Error writing log file.");
      next();
    });
  };
}

module.exports = logReqRes;
