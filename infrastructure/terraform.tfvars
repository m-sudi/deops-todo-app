

# -------------------------------------------------------------------
# infrastructure/terraform.tfvars.example
aws_region = "us-east-1"
environment = "development"
vpc_cidr = "10.0.0.0/16"
instance_type = "t2.micro"
key_pair_name = ""  # Optional: your EC2 key pair name
db_name = "todoapp"
db_username = "todouser"
db_password = "12314"  
db_instance_class = "db.t3.micro"

