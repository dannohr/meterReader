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
    let dailyData = await scrapers.scrapeOnDemandRead(lastDataDate);

    // If data was pulled from the website, insert it into the database
    if (dailyData) {
      console.log(dailyData);
      db.OnDemand.create({
        // previousDate: moment(dailyData[0], "MM/DD/YYYY").format("YYYY-MM-DD"),
        previousDate: dailyData[0],
        previousMeterRead: dailyData[1],
        readTime: dailyData[2],
        // readTime: moment(dailyData[2], "MM/DD/YYYY HH:mm:ss").format(
        //   "YYYY-MM-DD HH:mm:ss"
        // ),
        currentMeterRead: dailyData[3],
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
