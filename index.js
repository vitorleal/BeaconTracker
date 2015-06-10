var IBeacon      = require('./src/ibeacon'),
    ibeacon      = new IBeacon(),
    BeaconReader = require('./src/beaconReader'),
    beaconReader = new BeaconReader();


ibeacon.start();

ibeacon.on('ready', function (beacon) {
  console.log('Edison IBeacon UIID is %s', beacon.service.uiid);
});

ibeacon.on('error', function (err) {
  console.error(err);
});

beaconReader.scan();

