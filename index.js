var bleno = require('bleno');

var service = {
  uiid: '4c1db1b25c614e19bbb3552d8ed90b20',
  major: 1,
  minor: 1,
  measuredPower: -59
};

// Start advertising the IBeacon protocol
bleno.startAdvertisingIBeacon(service.uiid, service.major, service.minor, service.measuredPower,
    function callback(err) {
      if (err) {
        console.log(error);
      }

      console.log('Start advertising as IBeacon with UIID: %s', service.uiid);
});

