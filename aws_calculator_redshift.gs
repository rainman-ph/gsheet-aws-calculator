//https://calculator.aws/pricing/2.0/meteredUnitMaps/redshift/USD/current/redshift-calc.json

function test_aws_redshift_ri_all(){
  let region='us-east-1'
  let type='dc2.large'
  let result =''
  result = aws_redshift_ri_all(region,type,1)
  return result
}

/**
 * Get price of Cache Reserve Instances
 *
 * @param {region} Region
 * @param {type} Instance type (e.g dc2.large)
 * @param {purchase_option} Applicable only to Reserved e.g. All, Partial, No
 * @param {term_length} Reserved term(years,optional)
 * @customfunction
 */
function aws_redshift_ri_all(region,type,term_length){
  return get_calculator_aws_redshift_price(region,type,"Reserved","All",term_length)
}

/**
 * Get price of Cache OnDemand Instances
 *
 * @param {region} Region
 * @param {type} Instance type (Linux, Windows, etc)
 * @param {engine} Engine (postgres,mysql,aurora-mysql,etc)
 * @customfunction
 */
function aws_redshift_od(region,type){
  return get_calculator_aws_redshift_price(region,type,"OnDemand")*24*365     
}

/**
 * Get price of redshift  Instances
 *
 * @param {region} Region
 * @param {type} Instance type (e.g db.m5.large, etc)
 * @param {payment_term} payment Term e.g. OnDemand, Reserved
 * @param {purchase_option} Applicable only to Reserved e.g. All, Partial, No
 * @param {term_length} Term length in years. e.g 1, 3
 * @customfunction
 */
function get_calculator_aws_redshift_price(region,type,payment_term,purchase_option,term_length){
  if (!term_length) term_length = 1

  let url =`https://calculator.aws/pricing/2.0/meteredUnitMaps/redshift/USD/current/redshift-calc.json`

  let json =''
  try{
     json = JSON.parse(get_calculator_aws_data(url))
  }
  catch{
    throw `ERROR: ${payment_term} price not found for ${engine} ${type}. ${url}`
  }

  //e.g.:
  //.   dc2.8xlarge - OnDemand - - - Hourly Cost
  //.   dc2.8xlarge - Reserved - All Upfront - 1yr - PrepaidCost
  let keyname=''
  if (payment_term=='Reserved'){
    keyname =`${type} - Reserved - ${purchase_option} Upfront - ${term_length}yr - PrepaidCost`
  }
  else{
    keyname =`${type} - OnDemand - - - Hourly Cost`
  }
  let price=''
  price = json.regions[region_map[region]][keyname]["price"]

  return parseFloat(price)
}

