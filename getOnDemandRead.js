require("dotenv").config();
const scrapers = require("./scrapers/scraper");
const db = require("./models/index");
const moment = require("moment");

async function copyData() {
  // Lookup last date we have data for, if we don't have a last date set default
  let lastDataDate = await db.OnDemand.max("readTime").then(max => {
    return max === 0 ? "2019-03-30" : max;
  });
  console.log("Last On Demand Read Date:", moment(lastDataDate).format("llll"));

  // Define Current Time
  let endDate = moment(); //.format("MM/DD/YYYY");

  // If startDate and endDate are the same, that means it's today.  Data is not available for current days, so no reason to run this then.
  if (1 === 1) {
    // console.log("Getting Data for ", startDate, " through ", endDate);
    // console.log("Last data date is ", lastDataDate);
    let dailyData = await scrapers.scrapeOnDemandRead(lastDataDate);

    // If data was pulled from the website, insert it into the database
    if (dailyData) {
      // console.log("XXXXXXXXXXXXXXXXXXXXX");
      // console.log(dailyData);

      db.OnDemand.create({
        readTime: dailyData[0],
        previousDate: dailyData[1],
        currentMeterRead: dailyData[2],
        previousMeterRead: dailyData[3],
        consumption: dailyData[4]
      }).catch(error => console.log(error));
      // });
    } else {
      console.log("No data to copy");
    }
  } else {
    console.log("Data is already current");
  }
}

copyData();
