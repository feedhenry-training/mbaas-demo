/**
 *
 * @param req
 * @param res
 * @param params
 * @return {Object}
 */

module.exports = function (req, res, params){
  var apiKey = process.env.FH_APP_API_KEY;
  var authConfig = process.env.FH_ENDPOINT_CONFIG;
  // connect seems to lowercase headers??
  var HEADER_KEY = "x-fh-auth-app";
  var PARAM_KEY = "appkey";
  var OVERRIDES_KEY = "overrides";
  var DEFAULT_KEY  = "default";
  var UNAUTORIZED_HTTP_CODE = 401;
  /**
   * private
   */
  function authenticateAppApiKey(cb){
    var sentApiKey = getAppApiKey();
    if(! sentApiKey || ! apiKey ) return cb({code:UNAUTORIZED_HTTP_CODE,message:"no app api key found"});
    if(sentApiKey !== apiKey) return cb({code:UNAUTORIZED_HTTP_CODE,message:"invalid key"});
    else{
      return cb();
    }
  }

  function getAppApiKey(){
    var headers = req.headers;
    if(headers.hasOwnProperty(HEADER_KEY)) return headers[HEADER_KEY];
    if(params && params.__fh){
      return params.__fh[PARAM_KEY];
    }
    else return undefined;
  }

  function processAuth(authType, cb){
    switch(authType){
      case "https":
        cb();
        break;
      case "appapikey":
        authenticateAppApiKey(cb);
        break;
      default:
        cb({code:UNAUTORIZED_HTTP_CODE,message:"unknown auth type " + authType});
        break;
    }
  }

  return {
    /**
     *
     * @param endpoint
     * @param cb
     * @return {*}
     *
     * checks the authConfig set when the was last started for the endpoint being called and
     * checks if the requester is allowed to access this endpoint.
     */
    "authenticate" : function (endpoint, cb){
      //if there is no auth config then assume nothing has been setup for this app yet and continue as normal.
      if(! authConfig) return cb();
      if('string' === typeof authConfig){
        try{
          authConfig = JSON.parse(authConfig);
        }catch(e){
          return cb({code:503 ,message:"failed to parse auth config " + e.message});
        }
      }
      var overrides  = authConfig[OVERRIDES_KEY];
      var defaultOpt = authConfig[DEFAULT_KEY];
      //if there is a config set for this option process it.
      if(overrides && overrides.hasOwnProperty(endpoint)){
        var enpointConfig = overrides[endpoint];
        //there is a config for this endpoint it must have a security property otherwise we cannot decide how to proceed.
        if('object' === typeof  enpointConfig && enpointConfig.hasOwnProperty("security")){
          var authType = enpointConfig.security.trim();
          processAuth(authType,cb);
        }else return cb({code:503 ,message:"unable to parse security type from endpoint config "});
      }else{
        //fall back to config default
        processAuth(defaultOpt,cb);
      }
    }
  };
};
