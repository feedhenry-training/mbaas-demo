var main = require('../main.js'),
assert = require('assert'),
util = require('util');
function l(obj){
  console.log(util.inspect(obj, true, null, true));
}

main.mysql({
  query : 'USE sql314271;'
}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
});

main.mongodb({
  insert : {a:2},
  collection : 'test'
}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
});

main.mongoose({
  message : 'Hello world'
}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
});

main.couchdb({
  username : '',
  password : ''
}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
});

main.s3({},
function(err, res){
  assert.ok(!err);
  assert.ok(res);
});

main.rabbitmq({},
function(err, res){
  assert.ok(!err);
  assert.ok(res);
});