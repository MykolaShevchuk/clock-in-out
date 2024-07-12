const Helper = require('./Helper');
const { login, logout, isDayOff } = require('./common');

if (isDayOff()) {
  console.log('Day off skipping job');
  process.exit(0);
}

(async function () {
  console.log('Check-in start');

  const helper = await Helper.init();

  let err = null;
  let isLoggedIn = false;

  try {
    await login(helper);
    isLoggedIn = true;

    await (
      await helper.contains('#ZPAtt_check_in_out p', 'Check-in', 3 * 60 * 1000)
    ).click(); // timeout 3 mins
    await helper.contains('#ZPAtt_check_in_out p', 'Check-out');
    console.log('Check in');
  } catch (e) {
    await helper.savePage('./artifacts/error.html');
    await helper.screenshot('./artifacts/error.png');
    err = e;
    console.error(e);
  } finally {
    if (isLoggedIn) {
      await logout(helper);
    }
    await helper.quit();
    if (!err) {
      console.log('Check-in finish');
    }
  }

  if (err != null) {
    throw err;
  }
})();
