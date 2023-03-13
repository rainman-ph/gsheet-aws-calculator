//https://calculator.aws/pricing/2.0/meteredUnitMaps/elasticache/USD/current/elasticache-calc/US%20East%20(N.%20Virginia)/primary-selector-aggregations.json
// Cache Engine: "Memcached"
// Instance Family: "Standard"
// Instance Type: "cache.m5.4xlarge"
// Memory: "52.26 GiB"
// Network Performance: "High"
// TermType: "Reserved"
// vCPU: "16"

//https://calculator.aws/pricing/2.0/meteredUnitMaps/elasticache/USD/current/elasticache-calc/US%20East%20(N.%20Virginia)/OnDemand/Redis/cache.m4.10xlarge/Standard/40/154.64%20GiB/10%20Gigabit/index.json
//OnDemand Redis cache.m4.10xlarge Standard Hrs

//https://calculator.aws/pricing/2.0/meteredUnitMaps/elasticache/USD/current/elasticache-calc/US%20East%20(N.%20Virginia)/Reserved/Redis/cache.m4.10xlarge/Standard/40/154.64%20GiB/10%20Gigabit/index.json
//Reserved Redis cache.m4.10xlarge Standard 1yr Heavy Utilization Quantity:


function get_cache_selector(type,engine,url){
  let selector =""
  let json =JSON.parse(get_calculator_aws_data(url))
  let i=0
  for (const a of json.aggregations) { 
    if (a.selectors["Cache Engine"]==engine && a.selectors["Instance Type"]==type){
      s =a.selectors;
      selector=`${s["Instance Type"]}/${s["Instance Family"]}/${s["vCPU"]}/${s["Memory"]}/${s["Network Performance"]}`
      break;
    }
    i += 1
  }
  return selector
}

/**
 * Get price of Cache Reserve Instances
 *
 * @param {region} Region
 * @param {type} Instance type (Linux, Windows, etc)
 * @param {engine} Engine (Redis,Memcached)
 * @param {term_length} Reserved term(years,optional)
 * @customfunction
 */
function aws_cache_ri(region,type,engine,term_length){
  return get_calculator_aws_cache_price(region,type,engine,"Reserved",term_length)     
}

/**
 * Get price of Cache OnDemand Instances
 *
 * @param {region} Region
 * @param {type} Instance type (Linux, Windows, etc)
 * @param {engine} Engine (postgres,mysql,aurora-mysql,etc)
 * @customfunction
 */
function aws_cache_od(region,type,engine,term_length){
  return get_calculator_aws_cache_price(region,type,engine,"OnDemand",term_length)*24*365     
}

/**
 * Get price of Cache  Instances
 *
 * @param {region} Region
 * @param {type} Instance type (e.g db.m5.large, etc)
 * @param {engine} RDS Engine (e.g. postgres,mysql,aurora-mysql,etc)
 * @param {payment_term} payment Term e.g. OnDemand, Reserved
 * @param {term_length} Term length in years. e.g 1, 3
 * @customfunction
 */
function get_calculator_aws_cache_price(region,type,engine,payment_term,term_length){
  if (!term_length) term_length = 1
  let url =`https://calculator.aws/pricing/2.0/meteredUnitMaps/elasticache/USD/current/elasticache-calc/${region_map[region]}/primary-selector-aggregations.json`

  let selector = get_cache_selector(type,engine,url)
  url = `https://calculator.aws/pricing/2.0/meteredUnitMaps/elasticache/USD/current/elasticache-calc/${region_map[region]}/${payment_term}/${engine}/${selector}/index.json`

  let json =''
  try{
     json = JSON.parse(get_calculator_aws_data(url))
  }
  catch{
    throw `ERROR: ${payment_term} price not found for ${engine} ${type}. ${url}`
  }

  //e.g.:
  //OnDemand Redis cache.m4.10xlarge Standard Hrs
  //Reserved Redis cache.m4.10xlarge Standard 1yr Heavy Utilization Quantity:
  let instance_family= selector.split("/")[1]
  let keyname_pre=`${payment_term} ${engine} ${type} ${instance_family}`

  let price= ''
  let keyname=''
  if (payment_term=='Reserved'){
    keyname =`${keyname_pre} ${term_length}yr Heavy Utilization Quantity`
    if (a= json.regions[region_map[region]][keyname]){
      price = a['price']
      return parseFloat(price)
    }
    else{
      keyname =`${keyname_pre} ${term_length}yr All Upfront Quantity`
      price = json.regions[region_map[region]][keyname]["price"]
    }
  }
  else{
    keyname =`${keyname_pre} Hrs`
    price = json.regions[region_map[region]][keyname]["price"]
  }

  return parseFloat(price)
}





