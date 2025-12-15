#!/bin/bash

SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"

if [ ! -f "${SCRIPT_PATH}/utils.sh" ]
then
  SCRIPT_PATH="$(cd "$(dirname "${0}")" && pwd -P)"

  if [ ! -f "${SCRIPT_PATH}/utils.sh" ]
  then
    echo "Error: could not resolve 'utils.sh'"
    exit 1
  fi
fi

source "${SCRIPT_PATH}/utils.sh"
resolve_environment "${1}"
import_env_vars

