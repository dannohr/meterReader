require("dotenv").config();
const db = require("./models/index");
const moment = require("moment");
const https = require("https");
const axios = require("axios");
const fs = require("fs");
const { Op, literal } = require("sequelize");

const postUrl = process.env.URL + "odrstatus/";
const username = "dannohr";
const password = process.env.PASSWORD;
const esiid = process.env.ESIID;
const correlationId = "863155";

const instance = axios.create({
  httpsAgent: new https.Agent({
    cert: fs.readFileSync("./config/certs/cert.pem"),
    key: fs.readFileSync("./config/certs/privkey.pem"),
    rejectUnauthorized: false,
  }),
});

const getDemandRead = async () => {
  console.log("Starting to Get On Demand Read ");
  console.log(postUrl);
  let trans_id = Date.now().toString();
  let body = {
    trans_id: "456",
    requestorID: "dannohr",
    correlationId: "863155",
    SMTTermsandConditions: "Y",
  };

  console.log("The Request Body Is:");
  console.log(body);
  console.log("XXXXXXXXXXXXX");

  console.log("trans_id", trans_id);

  await instance({
    method: "post",
    // url: "https://services.smartmetertexas.net/odr/",
    url: postUrl,
    data: body,

    auth: {
      username: username,
      password: password,
    },
  })
    .then((response) => {
      let onDemandReadRequest = response.data;

      console.log(" ---  On Demand Request Response --- ");
      console.log(onDemandReadRequest);
      console.log("-------------------------------------");

      // db.OnDemandReadRequest.create({
      //   trans_id: trans_id,
      //   correlationId: "",
      //   statusCode: onDemandReadRequest.statusCode,
      //   statusReason: onDemandReadRequest.statusReason,
      // })
      //   .then(console.log("Data added to database"))
      //   .catch((error) => console.log(error));
    })
    .catch((err) => {
      let onDemandReadRequest = err.response.data;
      console.log(onDemandReadRequest);

      // db.OnDemandReadRequest.create({
      //   trans_id: onDemandReadRequest.trans_id,
      //   correlationId: onDemandReadRequest.correlationId,
      //   statusCode: onDemandReadRequest.statusCode,
      //   statusReason: onDemandReadRequest.statusReason,
      // })
      //   .then(console.log("Data added to database"))
      //   .catch((error) => console.log(error));
    });
};

getDemandRead();
