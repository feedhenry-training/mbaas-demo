module.exports = {
  mysql : {
    query : 'USE sql314271;'
  },
  postgresql : {
    query : 'SELECT NOW() AS "theTime"'
  },
  mongodb : {
    insert : {a:2},
    collection : 'test'
  },
  mongoose : {
    message : 'Hello world'
  },
  couchdb : {
    db : '_users',
    doc : 'org.couchdb.user:fhtest'
  },
  s3 : {
    bucket : 'cianstestbucket'
  },
  salesforce : {
    query : "SELECT Id, Name FROM Account"
  },
  googleapis : {
    url : 'http://google.com'
  },
  intercom : {
    user : 'john.doe@example.com'
  },
  netweaver : {
  },
  stripe : {
    email : 'foobar@example.org'
  },
  paypal : {
    card : {
      "type": "visa",
      "number": "4417119669820331",
      "expire_month": "11",
      "expire_year": "2018",
      "cvv2": "123",
      "first_name": "Joe",
      "last_name": "Shopper"
    }
  },
  logentries : {
    msg : {sleep:"all night", work:"all day"}
  },
  loggly : {
    msg : '127.0.0.1 - Theres no place like home'
  },
  mixpanel : {

  },
  underscore : {
    list : [1,2,3]
  },
  oracle : {
    query : ''
  },
  sqlite : {
  },
  rabbitmq : {},
  pkgcloud : {},
  leveldb : {
    value : 'LevelUP',
    key : 'name'
  },
  smtp : {
    message : 'Hello world',
    to : 'cclarke@feedhenry.com',
    from : 'cclarke@feedhenry.com'
  }
};
  
