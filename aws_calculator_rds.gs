engine_map = {
  "postgres" : ["postgresql","Single-AZ"],
  "mysql"    : ["mysql","Single-AZ"],
  "aurora-mysql":["aurora-mysql-compatible","Reserved Memory optimized"]
}

function get_rds_specs(type,engine,url){
  let specs =""
  let json =JSON.parse(get_calculator_aws_data(url))
  let i=0
  for (const a of json.aggregations) { 
    if (a.selectors["Instance Type"]==type){
      s =a.selectors;
      if (engine.includes('aurora')){
        specs = `${s["Instance Family"]}/${s["Instance Type"]}/${s["Memory"]}/${s["vCPU"]}/${s["Network Performance"]}`
        break;
      }
      specs = `${s["Instance Type"]}/${a.selectors["vCPU"]}/${a.selectors["Memory"]}`
      break;
    }
    i += 1
  }
  return specs
}

/**
 * Get price of EC2 Reserve Instances
 *
 * @param {region} Region
 * @param {type} Instance type (Linux, Windows, etc)
 * @param {engine} Engine (postgres,mysql,aurora-mysql,etc)
 * @param {term_length} Reserved term(years,optional)
 * @customfunction
 */
function aws_rds_ri_all(region,type,engine,term_length){
  return get_calculator_aws_rds_price(region,type,engine,"Reserved","All",term_length)     
}

/**
 * Get price of EC2 OnDemand Instances
 *
 * @param {region} Region
 * @param {type} Instance type (Linux, Windows, etc)
 * @param {engine} Engine (postgres,mysql,aurora-mysql,etc)
 * @customfunction
 */
function aws_rds_od(region,type,engine){
  return get_calculator_aws_rds_price(region,type,engine,"OnDemand")*24*365     
}

/**
 * Get price of RDS Instances
 *
 * @param {region} Region
 * @param {type} Instance type (e.g db.m5.large, etc)
 * @param {engine} RDS Engine (e.g. postgres,mysql,aurora-mysql,etc)
 * @param {payment_term} payment Term e.g. OnDemand, Reserved
 * @param {purchase_option} Applicable only to Reserved e.g. All, Partial, No
 * @param {term_length} Term length in years. e.g 1, 3
 * @customfunction
 */
function get_calculator_aws_rds_price(region,type,engine,payment_term,purchase_option,term_length){
  if (!term_length) term_length = 1
  let url =`https://calculator.aws/pricing/2.0/meteredUnitMaps/rds/USD/current/rds-${engine_map[engine][0]}-calc/${region_map[region]}/primary-selector-aggregations.json`
  let specs = get_rds_specs(type,engine,url)

  if (engine.includes('aurora')){
    url = `https://calculator.aws/pricing/2.0/meteredUnitMaps/rds/USD/current/rds-${engine_map[engine][0]}-calc/${region_map[region]}/${payment_term}/${specs}/index.json`
  }
  else{
    url = `https://calculator.aws/pricing/2.0/meteredUnitMaps/rds/USD/current/rds-${engine_map[engine][0]}-calc/${region_map[region]}/Single-AZ/${specs}/${payment_term}/index.json`
  }
  
  let json = ''
  try{
     json = JSON.parse(get_calculator_aws_data(url))
  }
  catch{
    throw `ERROR: ${payment_term} price not found for ${engine} ${type}. ${url}`
  }


  let keyname=''
  if (engine.includes('aurora')){
    if (payment_term=='Reserved'){
       keyname =`Reserved ${specs.replace(/\//g," ")} ${term_length}yr ${purchase_option} Upfront Quantity`
    }
    else{
       keyname =`OnDemand ${specs.replace(/\//g," ")} Hrs`
    }
  }
  else{
    if (payment_term=='Reserved'){
      keyname = `${engine_map[engine][1]} ${type} Reserved ${term_length}yr ${purchase_option} Upfront Quantity`
    }
    else{
      keyname = `${engine_map[engine][1]} ${type} OnDemand Hrs`
    }
  }
  let price = json.regions[region_map[region]][keyname]["price"]
  return parseFloat(price)
}



