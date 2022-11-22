const delay = async (timeout) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });

module.exports = {
  delay,
};
