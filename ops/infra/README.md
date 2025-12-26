## First Run
```bash
# Create resources required by state using `local` state

# 1. Comment out `backend` block in `main.tf`
# 2. Run `terraform init` to initialize the working directory
terraform init

# 3. Run `terraform apply` to create the resources required for remote state
terraform apply

# 4. Uncomment `backend` block in `main.tf`
# 5. Update tvars.tf with the `cloudflare_r2_access_key_id` and `cloudflare_r2_secret_access_key` values
# 6. Update tvars.tf with the `cloudflare_r2_access_key_id` and `cloudflare_r2_secret_access_key` values
# 7. Re-initialize Terraform with the remote backend and migrate state
terraform init -reconfigure -migrate-state
terraform apply
```
