require("dotenv").config();
const scrapers = require("./scrapers/scraper");
const db = require("./models/index");
const moment = require("moment");

async function copyData() {
  console.log("  ");
  console.log(
    "--------------   Starting OnDemand Read at ",
    moment().format("llll"),
    "--------------"
  );
  // Lookup last date we have data for, if we don't have a last date set default
  let lastDataDate = await db.OnDemand.max("readTime").then(max => {
    return max === 0 ? "2019-03-30" : max;
  });

  // Get manual read data from website
  let dailyData = await scrapers.scrapeOnDemandRead(lastDataDate);

  // If data was pulled from the website, insert it into the database
  if (dailyData && dailyData.length > 0) {
    dailyData.forEach(function(data) {
      console.log(data);
      db.OnDemand.create({
        previousDate: data[0],
        previousMeterRead: data[1],
        readTime: data[2],
        currentMeterRead: data[3],
        consumption: data[4]
      })
        .then(console.log("Data added to database"))
        .catch(error => console.log(error));
    });
  } else {
    console.log("No data to copy");
  }

  console.log(
    "-----------------------------------------------------------------------------------"
  );
  console.log("  ");
}

copyData();
