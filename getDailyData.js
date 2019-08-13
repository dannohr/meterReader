require("dotenv").config();
const scrapers = require("./scrapers/scraper");
const db = require("./models/index");
const moment = require("moment");
// { square, diag }

const importMeterData = async (startDate, endDate) => {
  let dailyData = await scrapers.scrapeDaily(startDate, endDate);

  //if puppetterr messes up on the webpage, which seems to randomly happen, no data will be returned.

  if (dailyData) {
    console.log(" -- Begin of Data to Import -- ");
    console.log(dailyData);
    console.log(" --  End of Data to Import  -- ");
    dailyData.forEach(row => {
      console.log(row);
      db.Daily.create({
        meterDate: row[0],
        startRead: row[1],
        endRead: row[2],
        consumption: row[3]
      }).catch(error => console.log(error));
    });
  } else {
    console.log("No data to copy");
  }
};

async function copyData() {
  let lastDataDate = await db.Daily.max("meterDate").then(max => {
    return max === 0 ? "2019-03-31" : max;
  });

  let startDate = moment(lastDataDate)
    .add(1, "d")
    .format("MM/DD/YYYY");

  let endDate = moment(startDate, "MM/DD/YYYY")
    .add(9, "d")
    .format("MM/DD/YYYY");

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
  // importMeterData("04/01/2019");
}

copyData();

// importMeterData("04/01/2019");
