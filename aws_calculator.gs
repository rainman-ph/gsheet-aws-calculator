region_map = {
    "us-east-1":"US East (N. Virginia)",
    "us-east-2":"US East (Ohio)",
    "us-west-1":"US West (N. California)",
    "us-west-2":"US West (Oregon)",
    "af-south-1":"Africa (Cape Town)",
    "ap-east-1":"Asia Pacific (Hong Kong)",
    "ap-southeast-3":"Asia Pacific (Jakarta)",
    "ap-south-1":"Asia Pacific (Mumbai)",
    "ap-northeast-3":"Asia Pacific (Osaka)",
    "ap-northeast-2":"Asia Pacific (Seoul)",
    "ap-southeast-1":"Asia Pacific (Singapore)",
    "ap-southeast-2":"Asia Pacific (Sydney)",
    "ap-northeast-1":"Asia Pacific (Tokyo)",
    "ca-central-1":"Canada (Central)",
    "eu-central-1":"EU (Frankfurt)",
    "eu-west-1":"EU (Ireland)",
    "eu-west-2":"EU (London)",
    "eu-south-1":"EU (Milan)",
    "eu-west-3":"EU (Paris)",
    "eu-north-1":"EU (Stockholm)",
    "me-south-1":"Middle East (Bahrain)",
    "sa-east-1":"South America (São Paulo)"
  }
  
  function get_calculator_aws_data(url) {
    var key = Utilities.base64Encode(url);
    var cacheHandler = new cCacheHandler.CacheHandler(600,'aws_calculator',false,false,CacheService.getPublicCache(), key);
    var cached = cacheHandler.getCache(key);
    if (cached == null) {
      try{
         cached = UrlFetchApp.fetch(url).getContentText();
      }
      catch{
        throw 'Error: '+url
      }
      cacheHandler.putCache(cached, key);
    }
    return cached;
  }
  