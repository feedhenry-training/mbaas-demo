var main = require('../main.js'),
assert = require('assert'),
util = require('util'),
async = require('async'),
definitions = require('./definitions.js');


//var env = require('./envvar.json');
//for (var key in env){
//  if (env.hasOwnProperty(key)){
//    process.env[key] = env[key];
//  }
//}

exports.run = function(params, callback){
  var tests = {};
  for (var key in main){
    if (main.hasOwnProperty(key) && definitions.hasOwnProperty(key)){

      var fn = main[key], ps = definitions[key].params;

      (function(fn, ps, key){
        tests[key] = function(cb){
          console.log('running ' + key);
          fn(ps, function(err, res){
            var status = (typeof err === "undefined" || err===null) ? " passed" : " failed";

            if (err || !res){
              console.log(arguments);
            }
            assert.ok(!err);
            assert.ok(res);
            if (definitions[key].tester){
              definitions[key].tester(err, res);
            }
            console.log(key + status);
            return cb(err, res);
          });
        }
      })(fn, ps, key);

    }
  }
  async.series(tests, callback);
}


