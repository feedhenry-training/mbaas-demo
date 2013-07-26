module.exports = {
//  mysql : {
//    query : 'USE sql314271;'
//  },
  postgresql : {
    params : {
      query : 'SELECT NOW() AS "theTime"'
    }
  },
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
  couchdb : {
    params : {
      db : '_users',
      doc : 'org.couchdb.user:fhtest'
    }
  },
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
    }
  },
  intercom : {
    params : {
      user : 'john.doe@example.com'
    }
  },
  netweaver : {
  },
  stripe : {
    params : {
      email : 'foobar@example.org'
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
    }
  },
  logentries : {
    params : {
      msg : {sleep:"all night", work:"all day"}
    }
  },
  loggly : {
    params : {
      msg : '127.0.0.1 - Theres no place like home'
    }
  },
  mixpanel : {},
  underscore : {
    params : {
      list : [1,2,3]
    }
  },
  sqlite : {},
  rabbitmq : {},
  pkgcloud : {},
  leveldb : {
    params : {
      value : 'LevelUP',
      key : 'name'
    }
  }
  smtp : {
    params : {
      message : 'Hello world',
      to : 'cclarke@feedhenry.com',
      from : 'cclarke@feedhenry.com'
    }
  }
};
  
