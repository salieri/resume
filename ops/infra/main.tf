# Configure Terraform to use Cloudflare R2 as the backend for storing state files.
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket = local.r2_state_bucket_name
    key    = "terraform/projects/${var.project_name}/envs/${var.env}/terraform.tfstate"

    region                      = "auto"   # required by backend; not an AWS region in this case
    endpoints                   = { s3 = "https://${var.cloudflare_account_id}.r2.cloudflarestorage.com" }

    access_key = var.cloudflare_r2_access_key_id
    secret_key = var.cloudflare_r2_secret_access_key

    use_path_style              = true

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
