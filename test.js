require("dotenv").config();
const scraper = require("./scraper");
const db = require("./models/index");
const moment = require("moment");

const importMeterData = async readDate => {
  let intervalData = await scraper(readDate);
  //   console.log(intervalData);

  intervalData.forEach(row => {
    db.Interval.create({
      meterDate: row[0],
      start: row[1],
      end: row[2],
      startDateTime: row[3],
      consumption: row[4]
    })
      //   .then(entry => console.log(entry.dataValues))
      .catch(error => console.log(error));
  });

  //   return await scraper("06/27/2019");
};

let startDate = new Date("04/01/2019");
let endDate = moment(new Date()).format("MM/DD/YYYY");
let readDate = moment(startDate).format("MM/DD/YYYY");
// console.log(startDate);
// console.log(readDate);
// console.log(endDate);

let i = 0;

async function copyData() {
  let lastDataDate = await db.Interval.max("startDateTime").then(max => {
    return max;
  });

  let startDate = moment(lastDataDate)
    .add(1, "d")
    .format("MM/DD/YYYY");
  //   let startDate = moment("05/17/2019", "MM/DD/YYYY").format("MM/DD/YYYY");

  //   let endDate = moment("06/30/2019", "MM/DD/YYYY").format("MM/DD/YYYY");
  let endDate = moment().format("MM/DD/YYYY");

  let readDate = moment(startDate, "MM/DD/YYYY").format("MM/DD/YYYY");
  // console.log(startDate);
  console.log("Starting Date is: ", readDate);
  console.log("Ending Date is: ", endDate);

  while (readDate != endDate) {
    console.log("Getting Data for ", readDate);
    try {
      await importMeterData(readDate);
    } catch (err) {
      console.log(err);
    }
    readDate = moment(readDate, "MM/DD/YYYY")
      .add(1, "d")
      .format("MM/DD/YYYY");
  }
}

// setInterval(() => {
//   copyData();
// }, 5000);
// copyData();

importMeterData("06/01/2019");
