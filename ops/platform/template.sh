#!/bin/bash -e

source ./scripts/env.sh "${1}"

echo "Printing Terraform configuration for environment: ${ENVIRONMENT}"
helmfile --file ./helmfile.yaml template
