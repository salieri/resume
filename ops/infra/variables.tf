variable "project_name" {
  type        = string
  description = "The name of the project."
}

variable "resume_zone_name" {
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
