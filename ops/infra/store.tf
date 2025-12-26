resource "cloudflare_r2_bucket" "tf_state_bucket" {
  account_id = var.cloudflare_account_id
  name       = "resume-terraform-state"
  location   = "WNAM"
}
