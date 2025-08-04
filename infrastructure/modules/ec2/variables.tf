# -------------------------------------------------------------------
# infrastructure/modules/ec2/variables.tf
variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnets" {
  description = "Private subnet IDs"
  type        = list(string)
}
variable "port" {
  description = "port value"
  type = number
  default = 3000
}
variable "security_group_id" {
  description = "Security group ID for EC2 instances"
  type        = string
}

variable "target_group_arn" {
  description = "Target group ARN"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "key_pair_name" {
  description = "EC2 Key Pair name"
  type        = string
  default     = ""
}

variable "instance_profile" {
  description = "IAM instance profile name"
  type        = string
}
