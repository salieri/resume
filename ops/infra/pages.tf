resource "cloudflare_pages_project" "resume_pages_project" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = "main"
}

resource "cloudflare_pages_domain" "resume_production_domain" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.resume_pages_project.name
  name         = var.resume_zone_id
}

resource "cloudflare_pages_domain" "resume_preview_domain" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.resume_pages_project.name
  name         = "preview.${var.resume_zone_id}"
}

data "cloudflare_zone" "resume_zone" {
  name = var.resume_zone_id
}

# DNS: apex -> production deployment
resource "cloudflare_dns_record" "resume_apex" {
  zone_id = data.cloudflare_zone.resume_zone.id
  name    = "@"
  type    = "CNAME"
  value   = "${cloudflare_pages_project.resume_pages_project.name}.pages.dev"
  proxied = true
  ttl     = 300
}

# DNS: preview subdomain -> branch alias deployment
resource "cloudflare_dns_record" "resume_preview" {
  zone_id = data.cloudflare_zone.resume_zone.id
  name    = "preview"
  type    = "CNAME"
  value   = "preview.${cloudflare_pages_project.resume_pages_project.name}.pages.dev"
  proxied = true
  ttl     = 300
}
