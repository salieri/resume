resource "cloudflare_pages_project" "resume_pages_project" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = "main"
}

resource "cloudflare_pages_domain" "resume_production_domain" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.resume_pages_project.name
  name         = var.resume_zone_name
}

data "cloudflare_zone" "resume_zone" {
  filter = {
    name = var.resume_zone_name
    # account = {
    #   id = var.cloudflare_account_id
    # }
  }
}

# DNS: apex -> production deployment
resource "cloudflare_dns_record" "resume_apex" {
  zone_id = data.cloudflare_zone.resume_zone.id
  name    = "@"
  type    = "CNAME"
  proxied = true
  ttl     = 1 # required by Cloudflare
  content = cloudflare_pages_project.resume_pages_project.subdomain
}

