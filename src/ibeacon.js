var bleno = require('bleno'),
    _     = require('underscore');


// IBeacon class
var IBeacon = function () {
  // Default service for the IBeacon
  this.service = {
    uiid: '4c1db1b25c614e19bbb3552d8ed90b20',
    major: 1,
    minor: 1,
    measuredPower: -59
  };

  return this;
};


// Create the service based in the default service and the options information
IBeacon.prototype.setService = function setService (options) {
  _.extend(this.service, options);

  return this;
};


// Start advertising as IBeacon
IBeacon.prototype.startAdvertising = function startAdvertising (options) {
  if (options) {
    this.setService(options);
  }

  bleno.startAdvertisingIBeacon(this.service.uiid,
      this.service.major, this.service.minor, this.service.measuredPower,
    function callback(err) {
      if (err) {
        console.log(error);
      }

      console.log('Start advertising as IBeacon with UIID: %s', this.service.uiid);
    }.bind(this));
};

exports = module.exports = IBeacon;

