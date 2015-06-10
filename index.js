var IBeacon     = require('./src/ibeacon'),
    IBeaconScan = require('./src/ibeaconScan'),
    ibeacon     = new IBeacon(),
    ibeaconScan = new IBeaconScan();


// Satart ibeacon
ibeacon.start();

ibeacon.on('error', function (err) {
  console.error(err);
});

// Start beacon scan
ibeaconScan.start();

ibeaconScan.on('discover', function (beacon) {
  var uiid = beacon.uuid,
      rssi = beacon.rssi,
      distance = ibeaconScan.calculateDistance(rssi);

  console.log('found device: %s, distance: %s', uiid, distance);
});

