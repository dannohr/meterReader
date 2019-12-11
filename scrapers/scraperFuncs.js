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
      // .select(' select[name="reporttype_input"] ', interval)
      .select('select[name="reporttype_input"]', interval)
      .then(console.log("selected report for: ", interval));

    //Not sure why this is needed, was in the example I found online so leaving for now
    // await page
    //   .waitForSelector(' select[name="reportType"] ')
    //   .then(console.log("waited for selector"));
  },

  async selectDateRange(startDate, endDate) {
    await page.click(" input[name='#startdatefield'] ", {
      clickCount: 3
    });

    await page.keyboard.press("Backspace");

    await page.type(' input[name="#startdatefield"] ', startDate);

    await page.click(' input[name="enddatefield"] ', { clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.type(' input[name="enddatefield"] ', endDate);
    await page.keyboard.press("Enter");
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
