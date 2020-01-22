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
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
    // executablePath: "chromium-browser"
    // args: ["--start-maximized"]
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(90000);
  // await page.setViewport({ width: 1920, height: 1080 });

  try {
    console.log("Getting Daily Totals");
    await scraperFuncs(page).login();
    await scraperFuncs(page).selectDataPeriod("DAILY"); //INTERVAL or DAILY

    let dataToImport = [];

    // ------------------- REPEATS FOR EACH BATCH OF DATES -------------------
    console.log("looping through the date ranges");

    // Set first start date, this date will be incremented as we loop grabbing data in 10 day batches
    let reportStartDate = startDate;

    // Calculate the number of days between start date and end date
    let numDays = moment
      .duration(
        moment(endDate, "MM/DD/YYYY").diff(moment(startDate, "MM/DD/YYYY"))
      )
      .asDays();
    console.log("Orginal mumber of days between dates is: ", numDays);

    // For now only doing 10 days at a time so don't have to worry about pagination
    // If the end date is more than 9 days after the start date, define a new temp end date, otherwise use original end date
    numDays > 9
      ? (reportEndDate = moment(startDate, "MM/DD/YYYY")
          .add(9, "d")
          .format("MM/DD/YYYY"))
      : (reportEndDate = endDate);

    while (numDays > 0) {
      console.log(
        "Days Left:",
        numDays,
        "- Start",
        reportStartDate,
        "and End",
        reportEndDate
      );

      await scraperFuncs(page).selectDateRange(reportStartDate, reportEndDate);

      await page.waitFor(4000); // make sure data is loaded

      await scraperFuncs(page)
        .copyDailyData()
        .then(data => {
          console.log(data);
          data.forEach(row => {
            dataToImport.push(row);
          });
        });

      // Set new start date to one day past previous end date
      reportStartDate = moment(reportEndDate, "MM/DD/YYYY")
        .add(1, "d")
        .format("MM/DD/YYYY");

      // Set new end date 9 days beyond new start date, this results in 10 actual days with of data
      reportEndDate = moment(reportStartDate, "MM/DD/YYYY")
        .add(9, "d")
        .format("MM/DD/YYYY");

      // website won't let you enter a date later than today's, so adjust if necessary:
      let today = moment();

      moment(reportEndDate, "MM/DD/YYYY").isAfter(today, "MM/DD/YYYY")
        ? (reportEndDate = today.format("MM/DD/YYYY"))
        : (reportEndDate = reportEndDate);

      // Calculate number of days between new Start Date and the original End Date, used to determine if loop is done
      numDays = moment
        .duration(
          moment(endDate, "MM/DD/YYYY").diff(
            moment(reportStartDate, "MM/DD/YYYY")
          )
        )
        .asDays();
    }
    // ------------------- END OF REPEAT FOR EACH BATCH OF DATES -------------------

    await browser.close();

    return dataToImport;
  } catch (e) {
    console.log(e);
    // await browser.close();
    return;
  }
}

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
async function scrapeOnDemandRead(lastDataDate) {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(90000);

  let buttonSelector =
    "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.row.panel > div.col-lg-8.col-xs-12.ondemand-meter-read > div > div:nth-child(1) > button";

  let dateSelector =
    "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.row.panel > div.col-lg-8.col-xs-12.ondemand-meter-read > div > div:nth-child(2) > div.ondemand-mtr-rdg-col1 > div:nth-child(2)";
  let timeSelector =
    "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.row.panel > div.col-lg-8.col-xs-12.ondemand-meter-read > div > div:nth-child(2) > div.ondemand-mtr-rdg-col2 > div:nth-child(2)";
  let meterReadSelector =
    "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.row.panel > div.col-lg-8.col-xs-12.ondemand-meter-read > div > div:nth-child(2) > div.ondemand-mtr-rdg-col3 > div:nth-child(2)";
  let usageSelector =
    "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.row.panel > div.col-lg-8.col-xs-12.ondemand-meter-read > div > div:nth-child(2) > div.ondemand-mtr-rdg-col4 > div:nth-child(2)";

  try {
    console.log("Getting On Demand Read");
    await scraperFuncs(page).login();

    // Make sure page has loaded after login
    // await page.waitFor(5000);

    await page
      .waitForSelector(buttonSelector)
      .then(console.log("button is here"));

    await page.click(buttonSelector, { clickCount: 1 });

    await page
      .waitForSelector(dateSelector)
      .then(console.log("On Demand Read Data is now present"));

    let latestEndOfDayDate = await page.evaluate(
      () =>
        document.querySelector(
          "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.row.panel > div.col-lg-4.col-xs-12.last-meter-read > div > div:nth-child(2) > div.last-mtr-rdg-col1 > div:nth-child(2)"
        ).innerText
    );

    let latestEndOfDayRead = await page.evaluate(
      () =>
        document.querySelector(
          "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.row.panel > div.col-lg-4.col-xs-12.last-meter-read > div > div:nth-child(2) > div.last-mtr-rdg-col3 > div:nth-child(2)"
        ).innerText
    );

    let onDemandDate = await page.evaluate(
      () =>
        document.querySelector(
          "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.row.panel > div.col-lg-8.col-xs-12.ondemand-meter-read > div > div:nth-child(2) > div.ondemand-mtr-rdg-col1 > div:nth-child(2)"
        ).innerText
    );

    let onDemandTime = await page.evaluate(
      () =>
        document.querySelector(
          "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.row.panel > div.col-lg-8.col-xs-12.ondemand-meter-read > div > div:nth-child(2) > div.ondemand-mtr-rdg-col2 > div:nth-child(2)"
        ).innerText
    );

    let meterRead = await page.evaluate(
      () =>
        document.querySelector(
          "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.row.panel > div.col-lg-8.col-xs-12.ondemand-meter-read > div > div:nth-child(2) > div.ondemand-mtr-rdg-col3 > div:nth-child(2)"
        ).innerText
    );

    let usage = await page.evaluate(
      () =>
        document.querySelector(
          "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.row.panel > div.col-lg-8.col-xs-12.ondemand-meter-read > div > div:nth-child(2) > div.ondemand-mtr-rdg-col4 > div:nth-child(2)"
        ).innerText
    );

    let dataToImport = [];

    // dataToImport.push(moment(latestEndOfDayDate, "MM/DD/YYYY").toDate());
    dataToImport.push(
      moment(latestEndOfDayDate, "MM/DD/YYYY").format("YYYY-MM-DD")
    );

    dataToImport.push(latestEndOfDayRead * 1);

    dataToImport.push(
      moment(onDemandDate + " " + onDemandTime, "MM/DD/YYYY HH:mm:ss").format(
        "YYYY-MM-DD HH:mm:ss"
      )
      // onDemandDate + " " + onDemandTime
    );

    dataToImport.push(meterRead * 1);

    dataToImport.push(usage * 1);

    await browser.close();

    return dataToImport;
  } catch (e) {
    console.log(e);
    await browser.close();
    return;
  }
}

module.exports = { scrapeInterval, scrapeDaily, scrapeOnDemandRead };
