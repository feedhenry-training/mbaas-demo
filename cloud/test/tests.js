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

main.postgresql({
  query : 'SELECT NOW() AS "theTime"'
}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
  assert.ok(res.rows && res.rows.length && res.rows.length > 0);
  assert.ok(res.rows[0]);
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
  db : '_users',
  doc : 'org.couchdb.user:fhtest'

}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
  assert.ok(res.name);
});

main.s3({
bucket : 'cianstestbucket'
},
function(err, res){
  assert.ok(!err);
  assert.ok(res);
});

main.rabbitmq({},
function(err, res){
  assert.ok(!err);
  assert.ok(res);
});

main.salesforce({
  query : "SELECT Id, Name FROM Account"
},
function(err, res){
  assert.ok(!err);
  assert.ok(res);
});

main.googleapis({
  url : 'http://google.com'
}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
  assert.ok(res.longUrl);
});

main.intercom({
  user : 'john.doe@example.com'
}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
  assert.ok(res.created_at);
});

main.netweaver({
}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
  assert.ok(res.GetVersion());
});

main.stripe({
  email : 'foobar@example.org'
}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
  assert.ok(typeof res.account_balance !== 'undefined');
});

main.paypal({
  card : {
    "type": "visa",
    "number": "4417119669820331",
    "expire_month": "11",
    "expire_year": "2018",
    "cvv2": "123",
    "first_name": "Joe",
    "last_name": "Shopper"
  }
}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
  assert.ok(res.state === 'ok')
});

main.logentries({
  msg : {sleep:"all night", work:"all day"}
}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
  assert.ok(res.ok);
});

main.loggly({
  msg : '127.0.0.1 - Theres no place like home'
}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
  assert.ok(res.response === "ok");
});

main.mixpanel({

}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
  assert.ok(res.ok);
});

main.underscore({
  list : [1,2,3]
}, function(err, res){
  l(res);
});

main.oracle({
  query : ''
}, function(err, res){
  assert.ok(!err);
  assert.ok(res);
});

main.sqlite({

},
function(err, res){
  assert.ok(!err);
  assert.ok(res);
  assert.ok(res.id);
  assert.ok(res.info);
});