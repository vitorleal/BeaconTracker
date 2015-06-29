var events = require('events'),
    util   = require('util'),
    bleno  = require('bleno'),
    _      = require('underscore');

/**
 * Creates an instance of the IBeacon object.
 * @class
 * @extends EventEmitter
 */
var IBeacon = function() {
  'user strict';

  // If is not instance of IBeacon return a new instance
  if (false === (this instanceof IBeacon)) {
    return new IBeacon();
  }

  events.EventEmitter.call(this);

  this.bleno = bleno;

  // Default service for the IBeacon
  this.service = {
    uuid: '4c1db1b25c614e19bbb3552d8ed90b20',
    major: 1,
    minor: 1,
    measuredPower: -59
  };

  return this;
};

util.inherits(IBeacon, events.EventEmitter);

// Create the service based in the default service and the options information
IBeacon.prototype.setService = function setService(options) {
  'use strict';

  _.extend(this.service, options);

  return this;
};

// Start advertising as IBeacon
IBeacon.prototype.start = function start(options) {
  'use strict';

  var _this = this;

  if (options) {
    this.setService(options);
  }

  // Start the bleno advertisment
  this.bleno.startAdvertisingIBeacon(
    _this.service.uuid,
    _this.service.major,
    _this.service.minor,
    _this.service.measuredPower,
    function ibeaconArdvertisingCallback(err) {

      if (err) {
        _this.emit('error', err);
      }

      console.log('Edison IBeacon UUID is %s', _this.service.uuid);
    });

  return this;
};

exports = module.exports = IBeacon;

