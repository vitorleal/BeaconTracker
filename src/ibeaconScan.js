var noble   = require('noble'),
    _       = require('underscore'),
    events  = require('events'),
    util    = require('util'),
    grove   = require('jsupm_grove'),
    DB      = require('./db'),
    Display = require('./display'),
    db      = new DB(),
    display = new Display();


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

  this.showAll = true;
  this.ibeacons = [];
  this.temperature = new grove.GroveTemp(0);

  // Start the display
  display.start();

  // On exit
  process.on('SIGINT', function() {
    display.defaultScreen();
    process.exit();
  });

  return this;
};

util.inherits(IBeaconScan, events.EventEmitter);


// Get info as object to use in the save method
IBeaconScan.prototype.toObject = function toObject () {
  'use strict';

  return {
    temperature: this.temperature.value(),
    ibeacons: this.ibeacons,
    location: {
      lat: -23.5957039,
      lon: -46.6753629
    }
  }
};

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
    if (_this.showAll) {
       _this.emit('discover', peripheral);

    } else {
      if (_this.device.ids.indexOf(peripheral.uuid) !== -1) {
        _this.emit('discover', peripheral);
      }
    }

  });

  return this;
};

// Check if the beacon is in the range
IBeaconScan.prototype.check = function check (ibeacon) {
  'use strict';

  if (ibeacon.distance < 1) {
    this.addToList(ibeacon);

  } else {
    this.removeFromList(ibeacon);
  }
};


// Add beacon to list and save
IBeaconScan.prototype.addToList = function addToList (ibeacon) {
  'use strict';

  var uuids = _.pluck(this.ibeacons, 'uuid');

  if (uuids.indexOf(ibeacon.uuid) === -1) {
    this.ibeacons.push(ibeacon);
    db.save(this.toObject());
  }

  display.update(this.temperature.value(), this.ibeacons.length);
};


// Remove beacon from list and save
IBeaconScan.prototype.removeFromList = function removeFromList (ibeacon) {
  var uuids = _.pluck(this.ibeacons, 'uuid'),
      index = uuids.indexOf(ibeacon.uuid);

  if (index !== -1) {
    this.ibeacons.splice(index, 1);
    db.save(this.toObject());
  }

  display.update(this.temperature.value(), this.ibeacons.length);
};


exports = module.exports = IBeaconScan;

