resource "cloudflare_r2_bucket" "tf_state_bucket" {
  account_id = var.cloudflare_account_id
  name       = local.r2_state_bucket_name
  location   = "auto"
}
