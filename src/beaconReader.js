var noble = require('noble'),
    _     = require('underscore');


// Beacon reader class
var BeaconReader = function BeaconReader () {
  'use strict';

  this.noble = noble;

  this.device = {
    ids: [],
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


// Start scan for IBeacons
BeaconReader.prototype.scan = function scan (options) {
  'use strict';
  var _this = this;

  if (options) {
    this.setOptions(options);
  }

  // Start scan for the
  this.noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
      _this.noble.startScanning(
        _this.device.ids,
        _this.device.duplicated
      );


    } else {
      _this.noble.stopScanning();
    }
  });

  this.noble.on('discover', function onDiscover (peripheral) {
    var uiid = peripheral.uuid,
        rssi = peripheral.rssi,
        name = peripheral.advertisement.localName;

    console.log('found device: ', uiid, ' ', name, ' ', rssi);
  });

  return this;
};

exports = module.exports = BeaconReader;

