# gsheet-aws-calculator

## Usage

General label:
- region - us-east-1, us-west-2, etc 
- term_length - (in years) 1, 3. defaults to 1 if omitted. not applicable to ondemand (od)

### ec2

- aws_ec2_ri_all_std(region,type,platform,term_length)
- aws_ec2_od(region,type,platform)

where
- type - m5.xlarge, etc
- platform - Linux/Unix, Windows, Windows with SQL Server Standard

## rds
- aws_rds_ri_all(region,type,engine,term_length)
- aws_rds_od(region,type,engine)

where
- type - db.m5.xlarge, etc
- engine - postgres, mysql, etc

## elasticache
- aws_cache_ri(region,type,engine,term_length)
- aws_cache_od(region,type,engine)

where
- type - cache.m5.xlarge, etc
- engine - Redis, etc

## redshift
- aws_redshift_ri_all(region,type,term_length)
- aws_redshift_od(region,type)

where
- type - dc.large, ra3.xlplus