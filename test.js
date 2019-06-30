require("dotenv").config();
const scraper = require("./scraper");
const db = require("./models/index");
const moment = require("moment");

const importMeterData = async readDate => {
  let intervalData = await scraper(readDate);
  intervalData.forEach(row => {
    // console.log(row[0]);

    db.Interval.create({
      meterDate: row[0],
      start: row[1],
      end: row[2],
      startDateTime: row[3],
      consumption: row[4]
    })
      //   .then(error => console.log(error.dataValues))
      .catch(error => console.log(error));
  });
};

// let startDate = new Date("04/01/2019");
// let endDate = moment(new Date()).format("MM/DD/YYYY");
// let readDate = moment(startDate).format("MM/DD/YYYY");

async function copyData() {
  let lastDataDate = await db.Interval.max("startDateTime").then(max => {
    return max;
  });

  let startDate = moment(lastDataDate)
    .add(1, "d")
    .format("MM/DD/YYYY");

  console.log("Max date in database is", lastDataDate);

  let endDate = moment("06/14/2019", "MM/DD/YYYY").format("MM/DD/YYYY");
  //   let endDate = moment().format("MM/DD/YYYY");

  console.log("Starting Date is: ", startDate);
  console.log("Ending Date is: ", endDate);

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
  importMeterData(startDate);
}

copyData();

// importMeterData("06/01/2019");
