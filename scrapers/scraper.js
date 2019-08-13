const puppeteer = require("puppeteer");
const moment = require("moment");
const scraperFuncs = require("./scraperFuncs");

async function scrapeInterval(readDate) {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(90000);

  try {
    await scraperFuncs(page).login();
    await scraperFuncs(page).selectDataPeriod("INTERVAL"); //INTERVAL or DAILY
    await scraperFuncs(page).selectDateRange(readDate, readDate);

    await page.waitFor(4000); // make sure data is loaded

    let formattedData = await scraperFuncs(page)
      .copyIntervalData()
      .then(data => {
        let formattedData = [];

        data.forEach(row => {
          const FORMAT = "MM/DD/YYYY hh:mm a";
          let data = [];

          data[0] = moment(readDate, "MM/DD/YYYY").format("YYYY-MM-DD");
          data[1] = readDate + " " + row[0];
          data[2] = readDate + " " + row[1];
          data[3] = moment(readDate + " " + row[0], FORMAT)
            .subtract(5, "h")
            .format(FORMAT);
          data[4] = parseFloat(row[2]);
          formattedData.push(data);
        });
        return formattedData;
      });

    await browser.close();
    return formattedData;
  } catch (e) {
    console.log(e);
    await browser.close();
    return;
  }
}

async function scrapeDaily(startDate, endDate) {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(90000);

  try {
    console.log("Getting Daily Totals");
    await scraperFuncs(page).login();
    await scraperFuncs(page).selectDataPeriod("DAILY"); //INTERVAL or DAILY
    await scraperFuncs(page).selectDateRange(startDate, endDate);

    await page.waitFor(4000); // make sure data is loaded

    let formattedData = await scraperFuncs(page)
      .copyDailyData()
      .then(data => {
        console.log("----");
        console.log(data);
        console.log("----");
        let formattedData = [];

        data.forEach(row => {
          const FORMAT = "MM/DD/YYYY hh:mm a";
          let data = [];

          data[0] = row[0];
          data[1] = parseFloat(row[1]);
          data[2] = parseFloat(row[2]);
          data[3] = parseFloat(row[3]);

          formattedData.push(data);
        });

        return formattedData;
      });

    await browser.close();
    return formattedData;
  } catch (e) {
    console.log(e);
    await browser.close();
    return;
  }
}

module.exports = { scrapeInterval, scrapeDaily };
