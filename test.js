require("dotenv").config();
const scrapers = require("./scraper");
const db = require("./models/index");
const moment = require("moment");

const importMeterData = async (startDate, endDate) => {
  let intervalData = await scrapers.scrapeDaily(startDate, endDate);

  //if puppetterr messes up on the webpage, which seems to randomly happen, no data will be returned.

  if (intervalData) {
    intervalData.forEach(row => {
      db.Interval.create({
        meterDate: row[0],
        start: row[1],
        end: row[2],
        startDateTime: row[3],
        consumption: row[4]
      }).catch(error => console.log(error));
    });
  } else {
    console.log("No data to copy");
  }
};

async function copyData() {
  let lastDataDate = await db.Daily.max("meterDate").then(max => {
    return max;
  });

  let startDate = moment(lastDataDate)
    .add(1, "d")
    .format("MM/DD/YYYY");

  let endDate = moment().format("MM/DD/YYYY");

  console.log("Max date in database is", lastDataDate);
  console.log("Starting Date is: ", startDate);
  console.log("Ending Date is ", endDate);

  //   while (startDate != endDate) {
  //     console.log("Getting Data for ", startDate);
  //     try {
  //       await importMeterData(startDate);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //     startDate = moment(startDate, "MM/DD/YYYY")
  //       .add(1, "d")
  //       .format("MM/DD/YYYY");
  //   }
  importMeterData(startDate, endDate);
}

copyData();

// importMeterData("04/01/2019");
