# -------------------------------------------------------------------
# infrastructure/modules/alb/outputs.tf
output "dns_name" {
  description = "Load balancer DNS name"
  value       = aws_lb.main.dns_name
}

output "target_group_arn" {
  description = "Target group ARN"
  value       = aws_lb_target_group.app.arn
}

output "zone_id" {
  description = "Load balancer zone ID"
  value       = aws_lb.main.zone_id
}
