module.exports = page => ({
  async login() {
    const METER_READER = "https://www.smartmetertexas.com/home";
    await page.goto(METER_READER, { waitUntil: "networkidle2" });
    await page.type("#userid", process.env.WUSERNAME);
    await page.type("#password", process.env.WTXTPASSWORD);
    await page.keyboard.press("Enter"); //.then(console.log("pressed enter"));
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
    await page.click(
      "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.panel-heading",
      { clickCount: 1 }
    );

    await page.waitFor(1000);

    await page.click("#startdatefield", { clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.type("#startdatefield", startDate);
    await page.click(
      "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.panel-heading",
      { clickCount: 1 }
    );

    // await page.keyboard.press("Enter");
    await page.click("#form > fieldset > div:nth-child(5) > button", {
      clickCount: 1
    });

    await page.waitForNavigation({ waitUntil: "networkidle0" });
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
          if (rowData[0].length === 8) {
            results.push(rowData);
          }
        });

        return results;
      }
    });
  },

  async copyDailyData() {
    return await page.evaluate(() => {
      let results = [];
      const SELECTOR =
        "#td_print_end > table > tbody > tr:nth-child(5) > td > span > table tr";

      let rowNodeList = document.querySelectorAll(SELECTOR);

      let tds = Array.from(rowNodeList);

      if (tds) {
        tds.forEach(row => {
          // innerText shows the data in the table
          let rowData = row.innerText.split("\t");

          if (rowData[0].length === 10) {
            results.push(rowData);
          }
        });
      }

      return results;
    });
  },

  async copyOnDemandReadData() {
    return await page.evaluate(() => {
      let results = [];
      let cleanData = {};
      const SELECTOR =
        "#td_print_end > table > tbody > tr:nth-child(3) > td > table > tbody > tr";

      let rowNodeList = document.querySelectorAll(SELECTOR);

      let tds = Array.from(rowNodeList);

      if (tds) {
        tds.forEach(row => {
          // innerText shows the data in the table
          let rowData = row.innerText.split("\t");

          // if (rowData[0].length === 10) {
          results.push(rowData);
          // }
        });

        cleanData = [
          results[3][1] + " " + results[3][2], // readTime
          results[4][1], // previousDate
          results[3][3], // currentMeterRead
          results[4][3], // previousMeterRead
          results[3][4] // consumption
        ];
      }

      return cleanData;
    });
  }
});
