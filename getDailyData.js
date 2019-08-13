require("dotenv").config();
const scrapers = require("./scrapers/scraper");
const db = require("./models/index");
const moment = require("moment");

async function copyData() {
  // Lookup last date we have data for, if we don't have a last date set default
  let lastDataDate = await db.Daily.max("meterDate").then(max => {
    return max === 0 ? "2019-03-30" : max;
  });
  console.log("Max date in database is", lastDataDate);

  // set start date to day after the last date in the database.
  // Not sure why but have to add 2 to get it to the correct date.
  let startDate = moment(lastDataDate)
    .add(2, "d")
    .format("MM/DD/YYYY");

  // Set end date to today
  let endDate = moment().format("MM/DD/YYYY");

  // If startDate and endDate are the same, that means it's today.  Data is not available for current days, so no reason to run this then.
  if (startDate != endDate) {
    console.log("Getting Data for ", startDate, " through ", endDate);

    let dailyData = await scrapers.scrapeDaily(startDate, endDate);

    if (dailyData) {
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
  } else {
    console.log("Data is already current");
  }
}

copyData();
