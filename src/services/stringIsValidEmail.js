const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function stringIsValidEmail(str) {
  return pattern.test(str);
}

module.exports = stringIsValidEmail;