var noble  = require('noble'),
    _      = require('underscore'),
    events = require('events'),
    util   = require('util');


/**
 * Creates an instance of the IBeaconScan object.
 * @class
 * @extends EventEmitter
 */
var IBeaconScan = function IBeaconScan () {
  'use strict';

  // If is not instance of Wearable return a new instance
  if (false === (this instanceof IBeaconScan)) {
    return new IBeaconScan();
  }

  this.noble = noble;

  this.device = {
    ids: ['f84e5bbf8951'],
    duplicated: true
  }

  return this;
};

util.inherits(IBeaconScan, events.EventEmitter);


// Set beacon reader device options
IBeaconScan.prototype.setOptions = function setOptions (options) {
  'use strict';

  if (options) {
    _.extend(this.device, options);
  }

  return this;
};


// Calculate the distance
IBeaconScan.prototype.calculateDistance = function calculateDistance (rssi) {
  var txPower = -59,
      _toFixed = function (num) {
        return +(Math.round(num + 'e+2')  + 'e-2');
      };

  if (rssi == 0) {
    return -1.0;
  }

  var ratio = rssi * 1.0 / txPower;

  if (ratio < 1.0) {
    var distance = Math.pow(ratio, 10);

    return _toFixed(distance);

  } else {
    var distance = (0.89976) * Math.pow(ratio,7.7095) + 0.111;
    return _toFixed(distance);
  }
};


// Start scan for IBeacons
IBeaconScan.prototype.start = function scan (options) {
  'use strict';

  var _this = this;

  if (options) {
    this.setOptions(options);
  }

  // Start scan for the
  this.noble.on('stateChange', function onStateChange (state) {
    if (state === 'poweredOn') {
      _this.noble.startScanning(
        [],
        _this.device.duplicated
      );

    } else {
      _this.noble.stopScanning();
    }
  });

  this.noble.on('discover', function onDiscover (peripheral) {
    if (_this.device.ids.indexOf(peripheral.uuid) !== -1) {
      _this.emit('discover', peripheral);
    }
  });

  return this;
};


exports = module.exports = IBeaconScan;

