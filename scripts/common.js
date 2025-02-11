const { authenticator } = require('otplib');
const { formatInTimeZone } = require('date-fns-tz');
const daysOff = require('./daysOff');
const { delay } = require('./utils');

const login = async (helper) => {
  await helper.visit('https://people.group107.com/');
  await helper.click('.btnlogin');
  await helper.type(
    'input[placeholder="Email address or mobile number"]',
    process.env.ZOHO_EMAIL || 'asd'
  );
  await delay(2000);
  await helper.click('#nextbtn');
  await helper.type(
    'input[placeholder="Enter password"]',
    process.env.ZOHO_PASSWORD || 'asd'
  );
  await delay(2000);
  await helper.click('#nextbtn');

  // Input TOTP
  await helper.get('#mfa_totp'); // wait for totp container
  const totp = authenticator.generate(process.env.ZOHO_TOTP || 'aSDads');
  await helper.driver.executeScript(`
    const input = document.querySelector('#mfa_totp_full_value');
    input.value = '${totp}'
  `);

  await helper.click('#nextbtn');

  try {
    await (
      await helper.contains('.remind_later_link', 'Remind me later', 20000)
    ).click();
    console.log('Clicked confirm your location.');
  } catch (e) {}

  try {
    await (
      await helper.contains(
        '.btn.secoundary_btn.inline',
        'Remind me later',
        20000
      )
    ).click();
    console.log('Clicked ignore zoho OneAuth.');
  } catch (e) {}

  try {
    await (await helper.contains('button', 'Remind me later', 20000)).click();
    console.log('Clicked ignore zoho OneAuth.');
  } catch (e) {}

  try {
    await helper.click('.remind-later');
    await (
      await helper.contains('.remind-list', "Don't show again", 20000)
    ).click();
    console.log('Clicked "Don\'t show again" zoho OneAuth.');
  } catch (e) {}

  console.log('Logged in');
};

const logout = async (helper) => {
  await helper.click('#zpeople_userimage');
  await (await helper.contains('.zpl_signout', 'Sign Out')).click();
  await helper.get(
    'input[placeholder="Email address or mobile number"]',
    30000
  );

  console.log('Logged out');
};

const isDayOff = () => {
  const today = formatInTimeZone(new Date(), 'Europe/Kiev', 'dd/MM');

  return daysOff.includes(today);
};

module.exports = {
  login,
  logout,
  isDayOff,
};
