#!/bin/bash -e

source ./scripts/env.sh "${1}"

echo "Linting Terraform configuration for environment: ${ENVIRONMENT}"
helmfile --file ./helmfile.yaml lint
