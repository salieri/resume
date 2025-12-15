#!/bin/bash

function resolve_environment() {
  if [ -z "${1}" ]; then
    echo "Usage: $0 <environment>"
    exit 1
  fi

  ENVIRONMENT=${1}
}

function import_env_vars() {
  ENV_FILES=(".env" ".env.${ENVIRONMENT}")

  if [ ! -f ".env.${ENVIRONMENT}" ]; then
    echo "Error: Environment file '.env.${ENVIRONMENT}' does not exist."
    exit 1
  fi

  for ENV_FILE in "${ENV_FILES[@]}"
  do
    if [ -f "${ENV_FILE}" ]
    then
      export $(grep -v '^#' "${ENV_FILE}" | xargs)
    fi
  done
}
