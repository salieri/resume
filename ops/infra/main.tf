# Configure Terraform to use Cloudflare R2 as the backend for storing state files.
terraform {
  required_version = ">= 1.14"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.15"
    }
  }

  backend "s3" {
    bucket = "resume-terraform-state"
    key    = "terraform/envs/production/terraform.tfstate"

    region         = "auto" # required by backend; not an AWS region in this case
    use_path_style = true

    # avoid AWS-specific validation/metadata/account calls
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
