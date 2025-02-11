const { isDayOff } = require('./common');
const Helper = require('./Helper');
const { writeFileSync } = require('fs');

if (isDayOff()) {
  console.log('Day off skipping job');
  process.exit(0);
}

(async function () {
  console.log('Check-in start');

  const helper = await Helper.init();

  let err = null;

  try {
    await helper.visit('https://live.timeclock365.com/login');
    await helper.type(
      'input[placeholder="Username"]',
      process.env.TIMECLOCK_EMAIL
    );
    await helper.click('.login-page__submit');
    await helper.type(
      'input[placeholder="Password"]',
      process.env.TIMECLOCK_PASSWORD
    );
    await helper.click('.login-page__submit');

    await helper.contains('.dashboard-punch__punch-btn', 'יציאה')

    await helper.visit('https://live.timeclock365.com/en/admin/dashboard');

    await (
      await helper.contains('.dashboard-punch__punch-btn', 'Punch out')
    ).click();
    await (
      await helper.contains(
        '.base-modal__button',
        'Yes, pause the task and punch out'
      )
    ).click();

    console.log('Check out');
  } catch (e) {
    await helper.savePage('./artifacts/error.html');
    await helper.screenshot('./artifacts/error.png');
    err = e;
    console.error(e);
  } finally {
    await helper.quit();
    if (!err) {
      console.log('Check-out finish');
    }
  }

  if (err != null) {
    throw err;
  }
})();
