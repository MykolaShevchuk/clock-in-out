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

    await (await helper.contains('.out.chlodIng', 'Check-out', 120000)).click();
    await helper.contains('.in.chlodIng', 'Check-in');

    console.log('Check out');
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
      console.log('Check-out finish');
    }
  }

  if (err != null) {
    throw err;
  }
})();
