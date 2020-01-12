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
      "#wrapper",
      // "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.panel-heading",
      { clickCount: 1 }
    );

    await page.waitFor(1000);

    await page.click("#startdatefield", { clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.type("#startdatefield", startDate);
    await page.click(
      "#wrapper",
      // "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(5) > div.col-lg-8.col-xs-12 > div > div.panel-heading",
      { clickCount: 1 }
    );

    await page.click(
      "#form > fieldset > div:nth-child(5) > button > span > span",
      { clickCount: 1 }
    );

    // await this.customClick(
    //   page,
    //   "#form > fieldset > div:nth-child(5) > button > span > span"
    // );

    // await page.waitForNavigation({ waitUntil: "networkidle0" });
    // return;
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
    const data = await page.evaluate(() => {
      let selector =
        "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(6) > div > div > div:nth-child(4) > div.usage-grid > table > tbody > tr";

      const tds = Array.from(document.querySelectorAll(selector));

      let data = tds.map(td => td.innerText);
      return data;
    });
    console.log("---------------------------");
    console.log(data);
    console.log("---------------------------");

    return data;

    // console.log("Starting to copy data");
    // return await page.evaluate(() => {
    //   let results = [];
    //   const SELECTOR =
    //     "#wrapper > div.row.page-content-wrapper > main > div > div:nth-child(6) > div > div > div:nth-child(4) > div.usage-grid > table > tbody > tr";
    //   // "#td_print_end > table > tbody > tr:nth-child(5) > td > span > table tr";

    //   let rowNodeList = document.querySelectorAll(SELECTOR);
    //   console.log("the selector is ", SELECTOR);

    //   let tds = Array.from(rowNodeList);

    //   console.log(tds);

    //   if (tds) {
    //     tds.forEach(row => {
    //       // innerText shows the data in the table
    //       let rowData = row.innerText.split("\t");

    //       if (rowData[0].length === 10) {
    //         results.push(rowData);
    //       }
    //     });
    //   }
    //   console.log("the results are");
    //   console.log(results);
    //   return results;
    // });
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
  },

  async customClick(page, selector, timeout = 30000) {
    // From: https://stackoverflow.com/questions/49979069/puppeteer-element-click-not-working-and-not-throwing-an-error

    await page.waitForSelector(selector, { visible: true, timeout });

    let error;
    while (timeout > 0) {
      try {
        console.log("Clicking button (", selector, ")");
        await page.click(selector);
        console.log("clicked");
        return;
      } catch (e) {
        await page.waitFor(100);
        timeout -= 100;
        error = e;
      }
    }
    throw err;
  }
});

[
  '<th scope="row" class=" pivoted" columnkey="1" style="font-weight: 400;"><div class="tdBefore"><span>Date</span></div>01/05/2020</th><td class=" pivoted"><div class="tdBefore"><span>Start Read</span></div>20378.266</td><td class=" pivoted"><div class="tdBefore"><span>End Read</span></div>20385.035</td><td class=" pivoted"><div class="tdBefore"><span>Consumption(Kwh)</span></div>6.768</td>',
  '<th scope="row" class=" pivoted" columnkey="1" style="font-weight: 400;"><div class="tdBefore"><span>Date</span></div>01/06/2020</th><td class=" pivoted"><div class="tdBefore"><span>Start Read</span></div>20385.035</td><td class=" pivoted"><div class="tdBefore"><span>End Read</span></div>20405.537</td><td class=" pivoted"><div class="tdBefore"><span>Consumption(Kwh)</span></div>20.504</td>',
  '<th scope="row" class=" pivoted" columnkey="1" style="font-weight: 400;"><div class="tdBefore"><span>Date</span></div>01/07/2020</th><td class=" pivoted"><div class="tdBefore"><span>Start Read</span></div>20405.537</td><td class=" pivoted"><div class="tdBefore"><span>End Read</span></div>20461.884</td><td class=" pivoted"><div class="tdBefore"><span>Consumption(Kwh)</span></div>56.342</td>',
  '<th scope="row" class=" pivoted" columnkey="1" style="font-weight: 400;"><div class="tdBefore"><span>Date</span></div>01/08/2020</th><td class=" pivoted"><div class="tdBefore"><span>Start Read</span></div>20461.884</td><td class=" pivoted"><div class="tdBefore"><span>End Read</span></div>20497.369</td><td class=" pivoted"><div class="tdBefore"><span>Consumption(Kwh)</span></div>35.48</td>',
  '<th scope="row" class=" pivoted" columnkey="1" style="font-weight: 400;"><div class="tdBefore"><span>Date</span></div>01/09/2020</th><td class=" pivoted"><div class="tdBefore"><span>Start Read</span></div>20497.369</td><td class=" pivoted"><div class="tdBefore"><span>End Read</span></div>20528.638</td><td class=" pivoted"><div class="tdBefore"><span>Consumption(Kwh)</span></div>31.271</td>',
  '<th scope="row" class=" pivoted" columnkey="1" style="font-weight: 400;"><div class="tdBefore"><span>Date</span></div>01/10/2020</th><td class=" pivoted"><div class="tdBefore"><span>Start Read</span></div>20528.638</td><td class=" pivoted"><div class="tdBefore"><span>End Read</span></div>20550.055</td><td class=" pivoted"><div class="tdBefore"><span>Consumption(Kwh)</span></div>21.414</td>'
];
