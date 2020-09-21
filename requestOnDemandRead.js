require("dotenv").config();
// const db = require("../models/meterReader/index");
const moment = require("moment");
const https = require("https");
const axios = require("axios");
const fs = require("fs");
const { Op, literal } = require("sequelize");

const url = process.env.URL + "odr/";
const username = "dannohr";
const password = process.env.PASSWORD;
const esiid = process.env.ESIID;

const instance = axios.create({
  httpsAgent: new https.Agent({
    cert: fs.readFileSync("./config/certs/cert.pem"),
    key: fs.readFileSync("./config/certs/privkey.pem"),
    rejectUnauthorized: false,
  }),
});

const requestOnDemandRead = async () => {
  console.log("Starting On Demand Read Request");
  console.log(url);
  let trans_id = Date.now().toString();
  let body = {
    trans_id: trans_id,
    requesterType: "RES",
    requestorID: username,
    deliveryMode: "API",
    ESIID: esiid,
    SMTTermsandConditions: "Y",
  };
  console.log(body);

  console.log("trans_id", trans_id);

  await instance({
    method: "post",
    url: "https://services.smartmetertexas.net/odr/",
    data: body,

    auth: {
      username: username,
      password: password,
    },
  })
    .then((response) => {
      let onDemandReadRequest = response.data;

      console.log(onDemandReadRequest);
    })
    .catch((err) => {
      console.log(err.response.data);

      db.OnDemandReadRequest.create({
        previousDate: data[0],
        previousMeterRead: data[1],
        readTime: data[2],
        currentMeterRead: data[3],
        consumption: data[4],
      })
        .then(console.log("Data added to database"))
        .catch((error) => console.log(error));
    });
};

requestOnDemandRead();
