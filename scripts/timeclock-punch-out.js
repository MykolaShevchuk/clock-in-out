const { isDayOff } = require('./common');
const Helper = require('./Helper');

if (isDayOff()) {
  console.log('Day off skipping job');
  process.exit(1);
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
