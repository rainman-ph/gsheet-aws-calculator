function test_ec2(){
//us-west-2	m5.xlarge	Windows
  const region = 'us-east-1'
  const type = 'c5.2xlarge'
  // const type = 'm6g.xlarge'
  const platform = 'Linux/UNIX'
  // const platform ='Windows with SQL Server Standard'
  let price = ''
  // price = ec2_ri_all(region,type,platform,1)
  price = ec2_od(region,type,platform)
  return price
}

function test_rds(){
  //us-east-1	db.t4g.micro	FALSE	postgres
  const region = 'us-east-1'
  const type = 'db.t4g.micro'
  const engine = 'postgres'
  const price = ''
  price = aws_rds_ri_all(region,type,engine,1)
  // price = rds_od(region,type,engine)
  return price
}

function test_rds_2(){
  // us-east-1	db.t4g.micro	FALSE	postgres
  const region = 'us-east-1'
  const type = 'db.t3.medium'
  const engine = 'aurora-mysql'
  return price
}

function test_cache(){
  // us-east-1	db.t4g.micro	FALSE	postgres
  const region = 'us-east-1'
  const type = 'cache.t4g.micro'
  const engine = 'Redis'
  let price =''
  price = cache_ri(region,type,engine)
  price = cache_od(region,type,engine)
  return price
}
