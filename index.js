var IBeacon     = require('./src/ibeacon'),
    IBeaconScan = require('./src/ibeaconScan'),
    DB          = require('./src/db'),
    ibeacon     = new IBeacon(),
    ibeaconScan = new IBeaconScan(),
    db          = new DB();


// Satart ibeacon
ibeacon.start();

ibeacon.on('error', function (err) {
  console.error(err);
});

// Start beacon scan
ibeaconScan.start();

ibeaconScan.on('discover', function (beacon) {
  var uuid = beacon.uuid,
      rssi = beacon.rssi,
      distance = ibeaconScan.calculateDistance(rssi);


  db.save({
    uuid: uuid,
    rssi: rssi,
    distance: distance
  }, function (err) {
    if (err) {
      console.log(err);
    }
  });

  console.log('device: %s, distance: %s', uuid, distance);
});

