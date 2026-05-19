# Define Terraform version and required providers
terraform {
  required_version = ">= 1.8.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure AWS provider
provider "aws" {
  region = var.aws_region
}

# Create ECR repositories using the reusable ECR module
module "ecr" {
  source = "../../modules/ecr"

  repositories = [
    "digi2-frontend",
    "digi2-backend"
  ]
}