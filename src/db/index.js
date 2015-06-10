var dweetClient = require('node-dweetio'),
    dweetio     = new dweetClient();


/**
 * Creates an instance of the DB object.
 * @class
 * @extends EventEmitter
 */
var DB = function () {
  'user strict';

  // If is not instance of IBeacon return a new instance
  if (false === (this instanceof DB)) {
    return new DB();
  }
};


// DB Save method
DB.prototype.save = function (data, callback) {
  'use strict';

  dweetio.dweet_for('beacon-tracker', data, function (err, dweet) {
    if (callback) {
      callback();
    }
  });
};


exports = module.exports = DB;

