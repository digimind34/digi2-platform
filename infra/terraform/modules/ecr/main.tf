# This variable receives a list of ECR repository names
variable "repositories" {
  type = list(string)
}

# Create one AWS ECR repository for each name in the repositories list
resource "aws_ecr_repository" "this" {
  # Convert the list into a set so Terraform can create multiple repositories
  for_each = toset(var.repositories)

  # Repository name, for example: digi2-backend
  name = each.value

  # MUTABLE allows image tags to be overwritten during learning/dev
  image_tag_mutability = "MUTABLE"

  # Scan Docker images when they are pushed to ECR
  image_scanning_configuration {
    scan_on_push = true
  }
}

# Output repository URLs after Terraform creates them
output "repository_urls" {
  value = {
    for name, repo in aws_ecr_repository.this : name => repo.repository_url
  }
}