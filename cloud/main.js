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
  Sends an SMS with the twilio API
  @param to : recipient
  @param body : message body
 */
exports.sms = function(params, cb){
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
  @param to : recipient
  @param subject : email subjecrt
  @param body : message body
 */
exports.email = function(params, cb){
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
  Retrieves the contents of an Amazon S3 bucket
*/
exports.s3 = function(params, callback){
  var s3 = require('knox'),
  client = s3.createClient({
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: process.env.S3_BUCKET
  });
  console.log('s3');
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














exports.data = function(params, cb){
  exports.s3({}, cb);

};

/*
  Exposes $fb.db to the client side
  @param operation the $fh.db operation we want to do - e.g. list, create, update
  @param type the $fb.db collection / table name we want to insert into / query
 */
exports.db = function(params, callback){
  params.act = params.operation || "list";
  return $fh.db(params, callback);
}
