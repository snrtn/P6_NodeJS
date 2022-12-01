const BadRequestError = require('./bad-request')
const UnauthenticatedError = require('./unauthenticated');
const CustomAPIError = require('./custom-api');

module.exports = {
  BadRequestError,
  UnauthenticatedError,
  CustomAPIError
}
