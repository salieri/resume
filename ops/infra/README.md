## First Run
```bash
# Create resources required by state using `local` state

# 0. Create a copy of `__example.tfvars` named `production.tfvars` and update variables as needed

# 1. Comment out `backend` block in `main.tf`
# 2. Run `terraform init` to initialize the working directory
terraform init -var-file="production.tfvars"

# 3. Run `terraform apply` to create the resources required for remote state
terraform apply -var-file="production.tfvars"

# 4. Uncomment `backend` block in `main.tf`
# 5. Retrieve credentials for remote backend from the created resources:
export AWS_ACCESS_KEY_ID=1234...
export AWS_SECRET_ACCESS_KEY=ca1234...
export AWS_ENDPOINT_URL_S3="https://<ACCOUNT_ID>.r2.cloudflarestorage.com"

# 7. Re-initialize Terraform with the remote backend and migrate state
terraform init -reconfigure -var-file="production.tfvars"
terraform init -migrate-state -var-file="production.tfvars"
terraform apply -var-file="production.tfvars"
```

## Subsequent Runs
```bash
export AWS_ACCESS_KEY_ID=1234...
export AWS_SECRET_ACCESS_KEY=ca1234...
export AWS_ENDPOINT_URL_S3="https://<ACCOUNT_ID>.r2.cloudflarestorage.com"

terraform init -var-file="production.tfvars"
terraform apply -var-file="production.tfvars"
```
