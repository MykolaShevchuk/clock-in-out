const Helper = require('./Helper');
const { login, logout } = require('./common');

(async function () {
  console.log('Check-in start');

  const helper = await Helper.init();

  let err = null;
  let isLoggedIn = false;

  try {
    await login(helper);
    isLoggedIn = true;

    await (await contains('.out.chlodIng', 'Check-out', 120000)).click();
    await contains('.in.chlodIng', 'Check-in');

    console.log('Check out');
  } catch (e) {
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
