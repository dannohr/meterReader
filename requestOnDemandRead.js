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

const smtApiPost = async (body, site) => {
  return await instance({
    method: "post",
    url: smtUrl + site,
    data: body,

    auth: {
      username: smtUserName,
      password: smtPassword,
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

const readRequest = async () => {
  return await db.OnDemandReadRequest.findAll({
    where: { statusCode: 0, registeredRead: null },
    raw: true,
  });
  // return data;
};

const onDemandReads = async () => {
  const needRegisteredRead = await readRequest();

  if (needRegisteredRead.length > 0) {
    console.log("read is waiting to be read");
    console.log(needRegisteredRead);
    await getDemandRead(needRegisteredRead);
  } else {
    console.log("there is no read waiting, trigger a new one");
    console.log(needRegisteredRead);
    await requestOnDemandRead();
  }
};

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

  // const responseData = await makeReadRequest();
  const responseData = await smtApiPost(body, "odr/");

  // save response to database.
  db.OnDemandReadRequest.create({
    trans_id: responseData.trans_id,
    correlationId: responseData.correlationId,
    statusCode: responseData.statusCode,
    statusReason: responseData.statusReason,
  })
    .then(console.log("Data added to database"))
    .catch((error) => console.log(error));
};

const getDemandRead = async (needRegisteredRead) => {
  console.log("Starting to Get On Demand Meter Read Data ");

  if (!needRegisteredRead[0]) {
    console.log("There is no unread read request");
    return false;
  }

  console.log(needRegisteredRead);
  let body = {
    trans_id: needRegisteredRead[0].trans_id,
    requestorID: smtUserName,
    correlationId: needRegisteredRead[0].correlationId,
    SMTTermsandConditions: "Y",
  };

  const responseData = await smtApiPost(body, "odrstatus/");

  if (responseData.statusCode === "PEN") {
    console.log("On Demand Read Still Pending");
    return false;
  } else {
    await db.OnDemandReadRequest.update(
      {
        registeredRead: responseData.odrRead.registeredRead,
        readDate: responseData.odrRead.readDate,
      },
      {
        where: {
          trans_id: responseData.trans_id,
        },
      }
    ).then(console.log("Data added to database"));
  }
};

onDemandReads();
