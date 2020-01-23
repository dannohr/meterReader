var config = require("../config/smartMeterConfig");
const moment = require("moment");

module.exports = page => ({
  async login() {
    await page.goto(config.website, { waitUntil: "networkidle0" });
    await page.type("#userid", config.websiteUser);
    await page.type("#password", config.websitePassword);
    await page.keyboard.press("Enter");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
  },

  async selectDataPeriod(interval) {
    await page.waitForSelector("#reporttype_input", {
      visible: true
    });
    await page
      .select('select[name="reporttype_input"]', interval)
      .then(console.log("selected report for: ", interval));
  },

  async selectDateRange(startDate, endDate) {
    await page.click("#enddatefield", { clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.type("#enddatefield", endDate);
    await page.click("#wrapper", { clickCount: 1 });

    await page.waitFor(1000);

    await page.click("#startdatefield", { clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.type("#startdatefield", startDate);
    await page.click("#wrapper", { clickCount: 1 });

    await page.click(
      "#form > fieldset > div:nth-child(5) > button > span > span",
      { clickCount: 1 }
    );
  },

  async copyIntervalData() {
    return await page.evaluate(() => {
      let results = [];
      const SELECTOR =
        "#td_print_end > table > tbody > tr:nth-child(5) > td > span > table tr";
      let rowNodeList = document.querySelectorAll(SELECTOR);

      let tds = Array.from(rowNodeList);

      if (tds) {
        tds.forEach(row => {
          let rowData = row.innerText.split("\t");
          // if (rowData[0].length === 8) {
          //   results.push(rowData);
          // }
        });

        console.log(results);
        return results;
      }
    });
  },

  async copyDailyData() {
    const tableData = await page.evaluate(() => {
      let selector =
        "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(6) > div > div > div:nth-child(4) > div.usage-grid > table > tbody > tr";

      const tds = Array.from(document.querySelectorAll(selector));

      let data = tds.map(td => td.innerText.split("\n"));
      return data;
    });

    let rowData = [];
    if (tableData) {
      tableData.forEach(row => {
        rowData.push([
          row[1],
          parseFloat(row[3]),
          parseFloat(row[5]),
          parseFloat(row[7])
        ]);
      });
    }

    return rowData;
  },

  async copyOnDemandData() {
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

    return dataToImport;
  }
});
