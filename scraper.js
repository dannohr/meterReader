const puppeteer = require("puppeteer");
const moment = require("moment");

const METER_READER = "https://www.smartmetertexas.com/CAP/public/";

// module.exports = {
//   list(req, res) {
//     return db.Address.findAll()
//       .then(addresses => res.status(200).send(addresses))
//       .catch(error => {
//         res.status(400).send(error);
//       });
//   }
// };

async function scrapeInterval(readDate) {
  // const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const browser = await puppeteer.launch({ slowMo: 50 });
  const page = await browser.newPage();

  const meterDate = readDate;

  try {
    page.setDefaultNavigationTimeout(90000);
    await page.goto(METER_READER, { waitUntil: "networkidle2" });

    try {
      await page.type("#username", process.env.WUSERNAME);
      // .then(console.log("entered username"));
    } catch (err) {
      console.log(err);
      await browser.close();
      return;
    }

    try {
      await page.type("#txtPassword", process.env.WTXTPASSWORD);
      // .then(console.log("entered password"));
    } catch (err) {
      console.log(err);
      await browser.close();
      return;
    }

    await page.keyboard.press("Enter"); //.then(console.log("pressed enter"));

    await page.waitForNavigation({ waitUntil: "networkidle0" });
    // .then(console.log("waited"));

    try {
      await page.select(' select[name="reportType"] ', "INTERVAL");
      // .then(console.log("selected ReportType"));
    } catch (err) {
      console.log(err);
      await browser.close();
      return;
    }

    try {
      await page.waitForSelector(' select[name="reportType"] ');
      // .then(console.log("waited for selector"));
    } catch (err) {
      console.log(err);
      await browser.close();
      return;
    }

    try {
      await page.click(" input[name='viewUsage_startDate'] ", {
        clickCount: 3
      });
      // .then(console.log("clicked start date"));
    } catch (err) {
      console.log(err);
      await browser.close();
      return;
    }

    await page.keyboard.press("Backspace");

    await page.type(' input[name="viewUsage_startDate"] ', readDate);
    await page.click(' input[name="viewUsage_endDate"] ', { clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.type(' input[name="viewUsage_endDate"] ', readDate);
    await page.keyboard.press("Enter"); //.then(console.log("update data"));
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    // .then(console.log("data should be shown"));

    await page.waitFor(4000); //.then(console.log("Is it showing"));

    const newMeterData = await page.evaluate(meterDate => {
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

    let formattedData = [];

    newMeterData.forEach(row => {
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

  try {
    page.setDefaultNavigationTimeout(90000);
    await page.goto(METER_READER, { waitUntil: "networkidle2" });

    try {
      await page
        .type("#username", process.env.WUSERNAME)
        .then(console.log("entered username"));
    } catch (err) {
      console.log(err);
      await browser.close();
      return;
    }

    try {
      await page
        .type("#txtPassword", process.env.WTXTPASSWORD)
        .then(console.log("entered password"));
    } catch (err) {
      console.log(err);
      await browser.close();
      return;
    }

    await page.keyboard.press("Enter").then(console.log("pressed enter"));

    await page
      .waitForNavigation({ waitUntil: "networkidle0" })
      .then(console.log("waited for natigation networkidle0"));

    try {
      await page
        .select(' select[name="reportType"] ', "DAILY")
        .then(console.log("selected ReportType"));
    } catch (err) {
      console.log(err, "error");
      await browser.close();
      return;
    }

    try {
      await page
        .waitForSelector(' select[name="reportType"] ')
        .then(console.log("waited for selector"));
    } catch (err) {
      console.log(err);
      await browser.close();
      return;
    }

    try {
      await page
        .click(" input[name='viewUsage_startDate'] ", {
          clickCount: 3
        })
        .then(console.log("clicked start date"));
    } catch (err) {
      console.log(err);
      await browser.close();
      return;
    }

    await page.keyboard.press("Backspace");

    await page.type(' input[name="viewUsage_startDate"] ', startDate);
    await page.click(' input[name="viewUsage_endDate"] ', { clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.type(' input[name="viewUsage_endDate"] ', endDate);
    await page.keyboard.press("Enter").then(console.log("update data"));
    await page
      .waitForNavigation({ waitUntil: "networkidle0" })
      .then(console.log("data should be shown"));

    await page.waitFor(4000); //.then(console.log("Is it showing"));

    const newMeterData = await page.evaluate(meterDate => {
      let results = [];
      const SELECTOR =
        "#td_print_end > table > tbody > tr:nth-child(5) > td > span > table tr";

      let rowNodeList = document.querySelectorAll(SELECTOR);

      let tds = Array.from(rowNodeList);

      console.log("--here is the raw data --");
      console.log(tds);
      console.log("-------------------------");

      return tds;

      // if (tds) {
      //   tds.forEach(row => {
      //     let rowData = row.innerText.split("\t");
      //     if (rowData[0].length === 8) {
      //       results.push(rowData);
      //     }
      //   });
      //   console.log(results);
      //   return results;
      // }
    });

    let formattedData = [];

    console.log("xxx");
    console.log(newMeterData);
    console.log("xxx");

    newMeterData.forEach(row => {
      const FORMAT = "MM/DD/YYYY hh:mm a";
      let data = [];

      // data[0] = moment(readDate, "MM/DD/YYYY").format("YYYY-MM-DD");
      // data[1] = readDate + " " + row[0];
      // data[2] = readDate + " " + row[1];
      // data[3] = moment(readDate + " " + row[0], FORMAT)
      //   .subtract(5, "h")
      //   .format(FORMAT);
      // data[4] = parseFloat(row[2]);
      formattedData.push(row);
    });

    await browser.close();
    console.log(formattedData);
    return formattedData;
  } catch (e) {
    console.log(e);
    await browser.close();
    return;
  }
}

module.exports = { scrapeInterval, scrapeDaily };
