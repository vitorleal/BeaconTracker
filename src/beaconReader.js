var noble = require('noble'),
    _     = require('underscore');


// Beacon reader class
var BeaconReader = function BeaconReader () {
  'use strict';

  this.noble = noble;

  this.device = {
    id: 'f84e5bbf8951',
    duplicated: true
  }

  return this;
};


// Set beacon reader device options
BeaconReader.prototype.setOptions = function setOptions (options) {
  'use strict';

  if (options) {
    _.extend(this.device, options);
  }

  return this;
};


// Calculate the distance
BeaconReader.prototype.calculateDistance = function calculateDistance (rssi) {
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
BeaconReader.prototype.scan = function scan (options) {
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
    if (peripheral.uuid === _this.device.id) {
      var uiid = peripheral.uuid,
          rssi = peripheral.rssi,
          distance = _this.calculateDistance(rssi),
          name = peripheral.advertisement.localName;

      console.log('found device: %s, name: %s, distance: %s', uiid, name, distance);
    }
  });

  return this;
};


exports = module.exports = BeaconReader;

