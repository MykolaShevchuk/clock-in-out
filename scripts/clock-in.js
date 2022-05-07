const Helper = require('./Helper');
const { login, logout, isDayOff } = require('./common');

if (isDayOff()) {
  console.log('Day off skipping job');
  process.exit(1);
}

(async function () {
  console.log('Check-in start');

  const helper = await Helper.init();

  let err = null;
  let isLoggedIn = false;

  try {
    await login(helper);
    isLoggedIn = true;

    await (await helper.contains('.in.chlodIng', 'Check-in', 120000)).click();
    await helper.contains('.out.chlodIng', 'Check-out');
    console.log('Check in');
  } catch (e) {
    err = e;
    console.error(e);
  } finally {
    if (isLoggedIn) {
      await logout(helper);
    }
    await helper.quit();
    console.log('Check-in finish');
  }

  if (err != null) {
    throw err;
  }
})();
