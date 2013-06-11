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
    body: params.body || "Hi Cian",
    to: params.to || "+17812668111",
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
    to: params.to || 'cian.clarke@feedhenry.com',
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

exports.s3 = function(params, callback){
  var s3 = require('knox'),
  client = s3.createClient({
    key: "AKIAIT2XID47BVU23WZQ",
    secret: "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",
    bucket: "cianstestbucket"
  });
  client.list({}, function(err, data){
    if (err) {
      return callback(err);
    }

    var contents = data && data.Contents;

    if (!contents){
      return callback({err : "No files found" });
    }
    return callback(null, contents);
  });
};

exports.data = function(params, cb){
  exports.s3({}, cb);

};

exports.db = function(params, cb){
  return callback(null, [
    {
      key : 'row1',
      val : 'val1'
    }
  ]);
}