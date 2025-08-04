# -------------------------------------------------------------------
# infrastructure/modules/ec2/outputs.tf
output "launch_template_id" {
  description = "Launch template ID"
  value       = aws_launch_template.app.id
}

output "autoscaling_group_name" {
  description = "Auto Scaling Group name"
  value       = aws_autoscaling_group.app.name
}