#!/bin/bash -e

source ./scripts/env.sh "${1}"

echo "Destroying Terraform configuration for environment: ${ENVIRONMENT}"
helmfile --file ./helmfile.yaml destroy
