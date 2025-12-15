#!/bin/bash -e

source ./scripts/env.sh "${1}"

echo "Applying Terraform configuration for environment: ${ENVIRONMENT}"

helmfile --file ./helmfile.yaml apply
