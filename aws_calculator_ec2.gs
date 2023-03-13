/**
 * EC2
 */

platform_map = {
  "Linux/UNIX": ["Linux/NA","Linux"],
  "Windows":["Windows/NA","Windows"],
  "Windows with SQL Server Standard":["Windows/SQL Std","Windows SQL Std"]
}

/**
 * Get price of EC2 Reserve Instances
 *
 * @param {region} Region
 * @param {type} Instance type (Linux, Windows, etc)
 * @param {platform} Platform
 * @param {term_length} Reserved term(years,optional)
 * @customfunction
 */
function aws_ec2_ri_all_std(region,type,platform,term_length){
  let price = get_calculator_aws_ec2_price(region,type,platform,"Reserved","All","standard",term_length)*24*365
  return price
}

function test_ec2_od(){
//us-west-2	m5.xlarge	Windows
//us-west-2	c5.2xlarge	Linux/UNIX
//eu-north-1	c5.2xlarge	Linux/UNIX
  const region = 'eu-north-1'
  const type = 'c5.2xlarge'
  // const type = 'm6g.xlarge'
  const platform = 'Linux/UNIX'
  // const platform ='Windows with SQL Server Standard'
  const price = ec2_od(region,type,platform)
  return price
}
/**
 * Get price of EC2 OnDemand Instances
 *
 * @param {region} Region
 * @param {type} Instance type (Linux, Windows, etc)
 * @param {platform} Platform
 * @customfunction
 */
function aws_ec2_od(region,type,platform){
  let price= get_calculator_aws_ec2_price(region,type,platform,"OnDemand")*24*365
  return price
}

/**
 * Get price of EC2 Reserve Instances
 *
 * @param {region} Region
 * @param {type} Instance type (Linux, Windows, etc)
 * @param {platform} Platform
 * @param {payment_term} payment Term e.g. OnDemand, Reserved
 * @param {purchase_option} Applicable only to Reserved e.g. All, Partial, No
 * @param {offering_class} Applicable only to Reserved e.g. convertible, standard
 * @param {term_length} Term length in years. e.g 1, 3
 * @customfunction
 */
function get_calculator_aws_ec2_price(region,type,platform,payment_term,purchase_option,offering_class,term_length){
  if (!term_length) term_length = 1
  let type_class = type.slice(0,type.indexOf('.'))
  let type_size = type.slice(type.indexOf('.')+1,type.length)

  let url= ''
  let purchase_option_url=''
  let purchase_option_keyname=''
  let current_generation=''
  let keyname=''

  if (payment_term=="OnDemand" || purchase_option !="All"){
    current_generation ='Yes'
    if (purchase_option){
      purchase_option_url = `${term_length}yr/${purchase_option}%20Upfront/${offering_class}/`
      purchase_option_keyname = `${term_length}yr ${purchase_option} Upfront ${offering_class} `
    }
    url = `https://calculator.aws/pricing/2.0/meteredUnitMaps/ec2/USD/current/ec2-calc/${region_map[region]}/${payment_term}/Shared/${platform_map[platform][0]}/No%20License%20required/${purchase_option_url}${current_generation}/index.json`
    keyname = `${type_class} ${type_size} ${payment_term} Shared ${platform_map[platform][1]} No License required ${purchase_option_keyname}${current_generation} Hrs`
  }
  else // Reserved "All Upfront"
  {
    // Use for Reserved and "All Upfront"
    url = `https://calculator.aws/pricing/2.0/meteredUnitMaps/computesavingsplan/USD/current/compute-instance-savings-plan-ec2-calc/${type}/${region_map[region]}/${platform_map[platform][0]}/Shared/index.json`
    keyname = `EC2InstanceSavingsPlans ${term_length} year ${purchase_option} Upfront`
  }

  let json = ''
  try{
     json = JSON.parse(get_calculator_aws_data(url))
  }
  catch{
    throw `ERROR: ${payment_term} price not found for ${engine} ${type}. ${url}`
  }

  let a = ''
  let price = ''
  if (a= json.regions[region_map[region]][keyname]){
     price = a['price']
     return parseFloat(price)
  }
  if (current_generation=='Yes'){
    current_generation ='No'
    url = `https://calculator.aws/pricing/2.0/meteredUnitMaps/ec2/USD/current/ec2-calc/${region_map[region]}/${payment_term}/Shared/${platform_map[platform][0]}/No%20License%20required/${purchase_option_url}${current_generation}/index.json`
    keyname = `${type_class} ${type_size} ${payment_term} Shared ${platform_map[platform][1]} No License required ${purchase_option_keyname}${current_generation} Hrs`
    json = JSON.parse(get_calculator_aws_data(url))
    price = json.regions[region_map[region]][keyname]['price']
    return parseFloat(price)
  }
  return parseFloat(price)

}