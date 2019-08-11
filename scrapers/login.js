module.exports = page => ({
  // <-- to have page in scope
  async login() {
    // <-- make this function async

    const METER_READER = "https://www.smartmetertexas.com/CAP/public/";

    await page.goto(METER_READER, { waitUntil: "networkidle2" });
    await page.type("#username", process.env.WUSERNAME);
    await page.type("#txtPassword", process.env.WTXTPASSWORD);
    await page.keyboard.press("Enter"); //.then(console.log("pressed enter"));

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    await page.screenshot({
      path: "1-AfterLogin.png",
      fullPage: true
    });
  },
  async selectInterval() {
    await page.select(' select[name="reportType"] ', "INTERVAL");
    // .then(console.log("selected ReportType"));

    await page.screenshot({
      path: "2-SelectedIntervalReport.png",
      fullPage: true
    });
  }
});
