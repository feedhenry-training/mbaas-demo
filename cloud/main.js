/*
 Exposes $fb.db to the client side
 @param operation the $fh.db operation we want to do - e.g. list, create, update
 @param type the $fb.db collection / table name we want to insert into / query
 */
exports.db = function(params, callback){
  params.act = params.operation || "list";
  return $fh.db(params, callback);
};

/*
 @param param.query : the query to execute
 */
exports.mysql = function(params, cb){
  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD
  });

  connection.connect();

  connection.query(params.query, function(err, rows, fields) {
    if (err){
      return cb(err);
    }

    return cb(err, {rows : rows, fields : fields });
  });

  connection.end();
};

/*

 */
exports.postgresql = function(params, cb){
  var pg = require('pg');

  var conString = "tcp://postgres:1234@localhost/postgres"; //TODO Find a free provider

  var client = new pg.Client(conString);
  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    client.query('SELECT NOW() AS "theTime"', function(err, result) {
      if(err) {
        return console.error('error running query', err);
      }
      console.log(result.rows[0].theTime);
      //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
      client.end();
    });
  });

};

/*
  @param params.insert an object to insert into your database
  @param params.collection the collection to insert it into
 */
exports.mongodb = function(params, cb){
  var MongoClient = require('mongodb').MongoClient,
  format = require('util').format,
  user = process.env.MONGODB_USER,
  password = process.env.MONGODB_PASSWORD,
  upString = (typeof user === 'string' && typeof password === 'string') ? user + ":" + password : "",
  database = process.env.MONGODB_DATABASE,
  host = process.env.MONGODB_HOST;

  MongoClient.connect('mongodb://' + upString + '@' + host + '/' + database, function(err, db) {
    if(err) return cb(err);

    var collection = db.collection(params.collection);
    collection.insert(params.insert, function(err, docs) {
      db.close();
      return cb(null, docs);
    });
  })

};

/*
  This example Exposes Mongoose ORM to the client side by creating a Message model,
  adding an instance to it, then finding all instances of messages, returning these to the client
  @param params.message : The message to send to the DB
 */
exports.mongoose = function(params, cb){
  var mongoose = require('mongoose'),
  user = process.env.MONGOOSE_USER,
  password = process.env.MONGOOSE_PASSWORD,
  upString = (typeof user === 'string' && typeof password === 'string') ? user + ":" + password : "",
  database = process.env.MONGOOSE_DATABASE,
  host = process.env.MONGOOSE_HOST,
  db = mongoose.connect('mongodb://' + upString + '@' + host + '/' + database),
  Schema = mongoose.Schema;

  // Make a new message model
  var Message = mongoose.model('Message', {
    message: String,
    date: Date
  });

  var instance = new Message();
  Message.message = params.message;
  Message.date = new Date();

  instance.save(function (err) {
    Message.find({}, function (err, docs) {
      mongoose.disconnect();
      return cb(err, docs);
    });
  });
};

/*

 */
 exports.couchdb = function(params, cb){
   var util = require('util'),
   couchdb = require('felix-couchdb'),
   client = couchdb.createClient(443, 'registry.npmjs.org', {
     auth: { username: params.username, password: params.password }
   }),
   db = client.db('my-db');

   db.getDoc('my-doc', function(er, doc) {
    console.log('cb');
     // TODO Just hangs, never connects
     if (er) console.log(er);
     util.puts('Fetched my new doc from couch:');
     util.p(doc);
   });
 };

/*
 Retrieves the contents of an Amazon S3 bucket
 @param params.bucket : Bucket name we're retrieving the listing from
 */
exports.s3 = function(params, callback){
  var s3 = require('knox'),
  client = s3.createClient({
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: params.bucket
  });
  client.list({}, function(err, data){
    console.log('s3 list :: err=', err, ' data', data);
    if (err) {
      return callback(err);
    }

    var contents = data && data.Contents;

    if (!contents){
      return callback({err : "No files found" });
    }
    console.log('returning contents :: ', contents);
    return callback(null, {'contents':contents});
  });
};

/*
 @param params.to : recipient
 @param params.subject : email subjecrt
 @param params.body : message body
 */
exports.sendgrid = function(params, cb){
  var SendGrid = require('sendgrid').SendGrid;
  var sendgrid = new SendGrid(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
  sendgrid.send({
    to: params.to,
    from: 'mobile@feedhenry.com',
    fromname : 'FeedHenry mBaaS',
    subject: params.subject || "FeedHenry Email",
    text: params.body || "Here is an email from a FeedHenry app!"
  }, function(success, message) {
    if (!success) {
      return cb(message);
    }
    return cb(null, { ok : true});
  });
};

/*
  Sends an SMS with the twilio API
  @param to : recipient
  @param body : message body
 */
exports.twillio = function(params, cb){
  // Your accountSid and authToken from twilio.com/user/account
  var accountSid = process.env.TWILIO_SID,
  authToken = process.env.TWILIO_AUTH,
  client = require('twilio')(accountSid, authToken);

  client.sms.messages.create({
    body: params.body,
    to: params.to,
    from: "+18572541934"
  }, function(err, message) {
    return cb(err, message);
  });
};



/*

 */
exports.rabbitmq = function(params, cb){
  var context = require('rabbit.js').createContext(process.env.RABBITMQ_HOST);
  context.on('ready', function() {
    var pub = context.socket('PUB'), sub = context.socket('SUB');
    sub.connect('events', function() {
      pub.connect('events', function() {
        pub.write(JSON.stringify({welcome: 'rabbit.js'}), 'utf8');
      });
    });
    sub.on('data', function(data) {
      console.log(data.toString());
      //TODO: Hangs indefinately, context doesn't close with context.close()
      return cb(null, data.toString());
     });
  });

};

/*
  Performs authentication with SalesForce using SOAP API then queries the db
  @param params.query : The SOQL query to perform
 */
exports.salesforce = function(params, cb){
  var sf = require('node-salesforce'),
  pass = (typeof process.env.SALESFORCE_SECURITYTOKEN === 'undefined') ? process.env.SALESFORCE_PASSWORD : process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITYTOKEN;
  var conn = new sf.Connection({
  });
  conn.login(process.env.SALESFORCE_USERNAME, pass, function(err, userInfo) {
    if (err) {
      return cb(err);
    }
    conn.query(params.query, cb);
  });
};

/*
  Example of using google apis module to discover the URL shortener module, and shorten
  a url
  @param params.url : the URL to shorten
 */
exports.googleapis = function(params, cb){
  var googleapis = require('googleapis');
  googleapis
  .discover('urlshortener', 'v1')
  .execute(function(err, client) {
    var req1 = client.urlshortener.url.insert({ longUrl: params.url });

    req1.execute(cb);
  });
};

/*
  Logs into the Intercom.io API using your APP and API key,
  then retrieves the information on a specific user
  @param params.user : the user who's info to retrieve
 */
exports.intercom = function(params, cb){
  var settings = {
    "API_KEY": process.env.INTERCOM_API_KEY,
    "APP_ID": process.env.INTERCOM_APP_KEY
  };
  var intercom = require('node-intercom').app(settings);

  intercom.users.get(params.user,function(code, body){
    if (code.toString()[0] !== '2'){
      // If our response code isn't a 2**, error condition..
      return cb(code);
    }
    // Body is a JSON string - parse it into an object
    try{
      body = JSON.parse(body);
      return cb(null, body);
    }catch(err){
      return cb(err);
    }
  });
};

///*
//  Needs native library install
// */
//exports.netweaver = function(err, res){
//  var conParams = {
//    ashost: '192.168.0.10',
//    sysid: 'NPL',
//    sysnr: '42',
//    user: 'DEVELOPER',
//    passwd: 'password',
//    client: '001',
//    lang: 'E'
//  };
//  var con = new sapnwrfc.Connection;
//
//  con.Open(conParams, function(err) {
//    if (err) {
//      console.log(err);
//      return;
//    }
//    return cb(err, con);
//  });
//};

/*
 Authenticates with Stripe and creates a customer
 @param params.email : the user account we're creating
 */
exports.stripe = function(params, cb){
  var api_key = process.env.STRIPE_API_KEY;  // secret stripe API key
  var stripe = require('stripe')(api_key);
  return stripe.customers.create( { email: params.email }, cb );
};

/*
  Connects to the Paypal SDK, and shows an example of adding a credit card to the system.
  @param params.card : JSON object representing the card being created - expects type, number, expire_month, expire_year, cvv2, first_name, last_name
 */
exports.paypal = function(params, cb){
  var paypal_sdk = require('paypal-rest-sdk');
  paypal_sdk.configure({
    'host': process.env.PAYPAL_HOST || 'api.paypal.com',
    'port': '443',
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
  });

  return paypal_sdk.credit_card.create(params.card, cb);
};

/*
  Logs a message to a logentries app
  @param params.msg : the message to log
 */
exports.logentries = function(params, cb){
  var logentries = require('node-logentries')

  var log = logentries.logger({
    token: process.env.LOGENTRIES_APP_TOKEN
  });
  log.log("debug", params.msg);
  log.end();
  return cb(null, { ok : true });
};

/*
  Logs a message to loggly
  @param params.msg : the message to log
 */
exports.loggly = function(params, cb){
  var loggly = require('loggly');
  var config = {
    subdomain: process.env.LOGGLY_SUBDOMAIN,
    auth: {
      username: process.env.LOGGLY_USERNAME,
      password: process.env.LOGGLY_PASSWORD
    }
  };
  var client = loggly.createClient(config);
  return client.log(process.env.LOGGLY_INPUT_TOKEN, params.msg, cb);
};

/*
 Tracks an event with the Mixpanel API
 */
exports.mixpanel = function(params, cb){
  var Mixpanel = require('mixpanel');
  // create an instance of the mixpanel client
  var mixpanel = Mixpanel.init(process.env.MIXPANEL_API_KEY);

// track an event with optional properties
  mixpanel.track("my event", {
    distinct_id: "some unique client id",
    as: "many",
    properties: "as",
    you: "want"
  });
  return cb(null, { ok : true })
};

/*
  Uses underscore's .each iterator to iterate over a list and produce a comma separated string of it's values
  @param params.list : a list of items to transform to a row in CSV
 */
exports.underscore = function(params, cb){
  var _ = require('underscore'),
  str = "";
  _.each(params.list, function(el, index){
    str += el;
    str = (index === params.list.length) ? str : str+";";
  });
  return cb(null, str);
};

