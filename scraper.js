const puppeteer = require("puppeteer");
const moment = require("moment");

const METER_READER =
  "https://www.smartmetertexas.com/smt/tPartyAgreementsLogin/public/smt_login.jsp";

const SELECTOR =
  "#td_print_end > table > tbody > tr:nth-child(5) > td > span > table";

// let readDate = "06/27/2019";

async function scraper(readDate) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const meterDate = readDate;

  try {
    await page.goto(METER_READER, { waitUntil: "networkidle2" });

    await page.type("#username", process.env.WUSERNAME);
    // .then(console.log("entered username"));
    await page.type("#txtPassword", process.env.WTXTPASSWORD);
    // .then(console.log("entered password"));

    await page.keyboard.press("Enter"); //.then(console.log("pressed enter"));

    await page.waitForNavigation({ waitUntil: "networkidle0" });
    // .then(console.log("waited"));

    await page.select(' select[name="reportType"] ', "INTERVAL");
    // .then(console.log("selected ReportType"));

    await page.waitForSelector(' select[name="reportType"] ');
    // .then(console.log("waited for selector"));

    await page.click(" input[name='viewUsage_startDate'] ", { clickCount: 3 });
    // .then(console.log("clicked start date"));

    await page.keyboard.press("Backspace");

    await page.type(' input[name="viewUsage_startDate"] ', readDate);
    await page.click(' input[name="viewUsage_endDate"] ', { clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.type(' input[name="viewUsage_endDate"] ', readDate);
    await page.keyboard.press("Enter"); //.then(console.log("update data"));
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    // .then(console.log("data should be shown"));

    await page.waitFor(4000); //.then(console.log("Is it showing"));

    // const meterData = [];

    const newMeterData = await page.evaluate(meterDate => {
      let results = [];
      // let resultsMore = [];

      const rowNodeList = document.querySelectorAll(
        "#td_print_end > table > tbody > tr:nth-child(5) > td > span > table tr"
      );

      const tds = Array.from(rowNodeList);

      tds.forEach(row => {
        let rowData = row.innerText.split("\t");
        if (rowData[0].length === 8) {
          results.push(rowData);
        }
      });

      return results;
    });

    let formattedData = [];

    newMeterData.forEach(row => {
      const FORMAT = "MM/DD/YYYY hh:mm a";
      let data = [];

      // let newDate = moment(testDate, FORMAT);
      // data[0] = moment(readDate + " " + row[0], FORMAT).subtract(5, "h");
      data[0] = readDate;
      data[1] = readDate + " " + row[0];
      data[2] = readDate + " " + row[1];
      data[3] = moment(readDate + " " + row[0], FORMAT).subtract(5, "h");
      data[4] = parseFloat(row[2]);
      formattedData.push(data);
    });
    console.log(formattedData);
    await browser.close();
    return formattedData;
  } catch (e) {
    console.log(e);
  }
}

module.exports = scraper;
