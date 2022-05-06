const Helper = require('./Helper');

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
      await helper.contains('.dashboard-location-type__type', 'Home')
    ).click();

    await (
      await helper.contains('button.dashboard-punch__punch-btn', 'Punch in')
    ).click();
    await helper.click('option[value="31288"]');

    await helper.contains('.dashboard-select__text', 'R&D');
    await (
      await helper.contains('.base-modal__button', 'Punch in and start task')
    ).click();

    console.log('Check in');
  } catch (e) {
    err = e;
    console.error(e);
  } finally {
    await helper.quit();
    if (!err) {
      console.log('Check-in finish');
    }
  }

  if (err != null) {
    throw err;
  }
})();
