var assert = require('assert');
module.exports = {
//  mysql : {
//    query : 'USE sql314271;'
//  },
// PGNative fails on dyno  :-(
//  postgresql : {
//    params : {
//      query : 'SELECT NOW() AS "theTime"'
//    },
//    tester : function(err, res){
//      assert.ok(res.rows && res.rows.length && res.rows.length > 0);
//      assert.ok(res.rows[0]);
//    }
//  },
  mongodb : {
    params : {
      insert : {a:2},
      collection : 'test'
    }
  },
  mongoose : {
    params : {
      message : 'Hello world'
    }
  },
//  couchdb : {
//    params : {
//      db : '_users',
//      doc : 'org.couchdb.user:fhtest'
//    },
//    tester : function(err, res){
//      assert.ok(res.name);
//    }
//  },
  s3 : {
    params : {
      bucket : 'cianstestbucket'
    }
  },
  salesforce : {
    params : {
      query : "SELECT Id, Name FROM Account"
    }
  },
  googleapis : {
    params : {
      url : 'http://google.com'
    },
    tester : function(err, res){
      assert.ok(res.longUrl);
    }
  },
  intercom : {
    params : {
      user : 'john.doe@example.com'
    },
    tester : function(err, res){
      assert.ok(res.created_at);
    }
  },
//  netweaver : {
//    params : {},
//    tester : function(err, res){
//      assert.ok(res.GetVersion());
//    }
//  },
  stripe : {
    params : {
      email : 'foobar@example.org'
    },
    tester : function(err, res){
      assert.ok(typeof res.account_balance !== 'undefined');
    }
  },
  paypal : {
    params : {
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
    tester : function(err, res){
      assert.ok(res.state === 'ok')
    }
  },
  logentries : {
    params : {
      msg : {sleep:"all night", work:"all day"}
    },
    tester : function(err, res){
      assert.ok(res.ok);
    }
  },
  /*loggly : {
    params : {
      msg : '127.0.0.1 - Theres no place like home'
    },
    tester : function(err, res){
      assert.ok(res.response === "ok");
    }
  }, Loggly - why you so SLOW!?*/
  mixpanel : {
    params : {},
    tester : function(err, res){
      assert.ok(res.ok);
    }
  },
  underscore : {
    params : {
      list : [1,2,3]
    }
  },
  sqlite : {
    params : {},
    tester : function(err, res){
      assert.ok(res.id);
      assert.ok(res.info);
    }
  },
  rabbitmq : {},
  pkgcloud : {
    params : {},
    tester : function(err, res){
      assert.ok(res[0]);
      assert.ok(res[0].name);
    }
  },
  /*leveldb : {
    params : {
      value : 'LevelUP',
      key : 'name'
    },
    tester : function(err, res){
      assert.ok(res === "LevelUP");
    }
  },Dependency issues with this*/
  smtp : {
    params : {
      message : 'Hello world',
      to : 'cclarke@feedhenry.com',
      from : 'cclarke@feedhenry.com'
    }
  }
};
  
