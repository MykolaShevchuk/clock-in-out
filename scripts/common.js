const { authenticator } = require('otplib');
const { formatInTimeZone } = require('date-fns-tz');
const daysOff = require('./daysOff');

const login = async (helper) => {
  await helper.visit('https://people.israelit.pro/');
  await helper.type(
    'input[placeholder="Email address or mobile number"]',
    process.env.ZOHO_EMAIL || 'asd'
  );
  await helper.click('#nextbtn');
  await helper.type(
    'input[placeholder="Enter password"]',
    process.env.ZOHO_PASSWORD || 'asd'
  );
  await helper.click('#nextbtn');
  await helper.type(
    'input[placeholder="Enter TOTP"]',
    authenticator.generate(process.env.ZOHO_TOTP || 'aSDads')
  );
  await helper.click('#nextbtn');

  try {
    await (
      await helper.contains('.remind_later_link', 'Remind me later', 120000)
    ).click();
    console.log('Clicked confirm your location.');
  } catch (e) {}

  console.log('Logged in');
};

const logout = async (helper) => {
  await helper.click('#zpeople_userimage');
  await (await helper.contains('.ZPSOut', 'Sign Out')).click();
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
