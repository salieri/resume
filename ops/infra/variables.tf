
variable "env" {
  type        = string
  description = "The deployment environment (e.g., production, staging, development)."
}

variable "project_name" {
  type        = string
  description = "The name of the project."
}

variable "resume_zone_id" {
  type        = string
  description = "The domain name of the resume website."
}

variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account ID."
  sensitive   = true
}

variable "cloudflare_api_token" {
  type        = string
  description = "Cloudflare API token."
  sensitive   = true
}

variable "cloudflare_r2_access_key_id" {
  type        = string
  description = "Cloudflare R2 Access Key ID."
  sensitive   = true
}

variable "cloudflare_r2_secret_access_key" {
  type        = string
  description = "Cloudflare R2 Secret Access Key."
  sensitive   = true
}

locals {
  r2_state_bucket_name = "${var.project_name}-terraform-state"
}
