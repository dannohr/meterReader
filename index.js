const cron = require("node-cron");
const moment = require("moment");

const getDemandReadData = require("./requestOnDemandRead").getDemandReadData;

const getLastOnDemandRequest = require("./requestOnDemandRead")
  .getLastOnDemandRequest;

const requestOnDemandRead = require("./requestOnDemandRead")
  .requestOnDemandRead;

// var task = cron.schedule("15 14 * * *", async function () {
var start = async function () {
  console.log("");
  console.log("");
  console.log("");
  console.log("");
  console.log("Start of New Task");

  let lastRequest = null;

  lastRequest = await getLastOnDemandRequest();

  console.log("---------------------------------");
  console.log(lastRequest);
  console.log("---------------------------------");

  let lastRequestTime = lastRequest
    ? moment(lastRequest.createdAt, "YYYY-MM-DD hh:mm:ss Z").format("LLL")
    : null;

  let minsSinceLastRequest = moment().diff(
    moment(lastRequestTime, "LLL"),
    "minutes"
  );

  console.log("          The current time is:", moment().format("LLL"));
  console.log("          The last request time was:", lastRequestTime);
  console.log("          Which was", minsSinceLastRequest, "minutes ago.");

  if (!lastRequest.registeredRead) {
    // If registeredRead is null, get the data.  (Will only be null for a pending request)
    console.log("Need to get the data from SMT");
    getDemandReadData(lastRequest);
  } else {
    console.log("No data to get, request new");
    await requestOnDemandRead();

    let i = 1;
    let timerId = setInterval(async () => {
      // update lastRequest to the new record with the pending read
      lastRequest = await getLastOnDemandRequest();
      console.log(lastRequest);
      //Now start time and read the data if you can
      console.log("Try number,", i);

      await getDemandReadData(lastRequest);

      if (i > 4) {
        clearInterval(timerId);
      }
      i++;
    }, 10000);

    // let results = await getDemandReadData(lastRequest);
    // console.log(results);
  }
};
// });

// task.start();
start();
