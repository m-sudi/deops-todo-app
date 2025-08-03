# infrastructure/modules/rds/main.tf
resource "aws_db_subnet_group" "main" {
  name       = "${var.environment}-db-subnet-group"
  subnet_ids = var.private_subnets

  tags = {
    Name = "${var.environment}-db-subnet-group"
  }
}

resource "aws_db_parameter_group" "main" {
  family = "postgres15"
  name   = "${var.environment}-db-params"

  parameter {
    name  = "log_statement"
    value = "all"
  }

  tags = {
    Name = "${var.environment}-db-params"
  }
}

resource "aws_db_instance" "main" {
  identifier = "${var.environment}-todoapp-db"

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp2"
  storage_encrypted     = true

  db_name  = var.db_name
  engine   = "postgres"
  engine_version = "15.4"
  instance_class = var.instance_class

  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [var.security_group_id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  parameter_group_name   = aws_db_parameter_group.main.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = true
  deletion_protection = false

  performance_insights_enabled = false
  monitoring_interval         = 0

  tags = {
    Name = "${var.environment}-todoapp-db"
  }
}

