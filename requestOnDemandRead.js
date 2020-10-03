require("dotenv").config();
const db = require("./models/index");
const moment = require("moment");
const https = require("https");
const axios = require("axios");
const fs = require("fs");
const { Op, literal } = require("sequelize");

const smtUrl = process.env.smtUrl;
const smtUserName = process.env.smtUserName;
const smtPassword = process.env.smtPassword;
const smtEsiid = process.env.smtEsiid;

const instance = axios.create({
  httpsAgent: new https.Agent({
    cert: fs.readFileSync("./config/certs/cert.pem"),
    key: fs.readFileSync("./config/certs/privkey.pem"),
    rejectUnauthorized: false,
  }),
});

const requestOnDemandRead = async () => {
  console.log("Starting On Demand Read Request");
  console.log(" ");
  let trans_id = Date.now().toString();
  let body = {
    trans_id: trans_id,
    requesterType: "RES",
    requestorID: smtUserName,
    deliveryMode: "API",
    ESIID: smtEsiid,
    SMTTermsandConditions: "Y",
  };

  console.log(" ");
  console.log("The Request Body Is:");
  console.log(body);
  console.log(" ");
  console.log(" ");

  const makeReadRequest = async () => {
    await instance({
      method: "post",
      url: smtUrl + "odr/",
      data: body,

      auth: {
        username: smtUserName,
        password: smtPassword,
      },
    })
      .then((response) => {
        let onDemandReadRequest = response.data;

        console.log(" ---  On Demand Request Response --- ");
        console.log(onDemandReadRequest);
        console.log("-------------------------------------");
      })
      .catch((err) => {
        // let errData = err.response.data;
        console.log("There was an error and the response is:");
        console.log(err);
        console.log("");
        console.log("");
        console.log("");
        // if (err) {
        //   db.OnDemandReadRequest.create({
        //     trans_id: err.response.data.trans_id,
        //     correlationId: err.response.data.correlationId,
        //     statusCode: err.response.data.statusCode,
        //     statusReason: err.response.data.statusReason,
        //   })
        //     .then(console.log("Data added to database"))
        //     .catch((error) => console.log(error));
        // }
      });
  };

  const responseData = await makeReadRequest();

  console.log("");
  console.log("");
  console.log("responseData is:");
  console.log(responseData);
  console.log("");
  console.log("");
  // save response to database.

  db.OnDemandReadRequest.create({
    trans_id: trans_id,
    correlationId: onDemandReadRequest.correlationId,
    statusCode: onDemandReadRequest.statusCode,
    statusReason: onDemandReadRequest.statusReason,
  })
    .then(console.log("Data added to database"))
    .catch((error) => console.log(error));
};

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

requestOnDemandRead();
