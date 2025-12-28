#!/usr/bin/env bash
set -euo pipefail

if command -v tflint >/dev/null 2>&1; then
  exec tflint "$@"
fi

VERSION="${TFLINT_VERSION:-v0.60.0}"
CACHE_DIR="${TFLINT_CACHE_DIR:-${XDG_CACHE_HOME:-$HOME/.cache}/tflint}"
INSTALL_DIR="${CACHE_DIR}/${VERSION}"
BIN_PATH="${INSTALL_DIR}/tflint"

if [ ! -x "$BIN_PATH" ]; then
  mkdir -p "$INSTALL_DIR"

  OS_NAME=$(uname -s | tr '[:upper:]' '[:lower:]')
  case "$OS_NAME" in
    linux|darwin) ;;
    *)
      echo "Unsupported OS for automatic tflint installation: $OS_NAME" >&2
      exit 1
      ;;
  esac

  ARCH_NAME=$(uname -m)
  case "$ARCH_NAME" in
    x86_64|amd64)
      ARCH_NAME="amd64"
      ;;
    arm64|aarch64)
      ARCH_NAME="arm64"
      ;;
    armv7l)
      ARCH_NAME="arm"
      ;;
    *)
      echo "Unsupported architecture for automatic tflint installation: $ARCH_NAME" >&2
      exit 1
      ;;
  esac

  ARCHIVE_NAME="tflint_${OS_NAME}_${ARCH_NAME}.zip"
  DOWNLOAD_URL="https://github.com/terraform-linters/tflint/releases/download/${VERSION}/${ARCHIVE_NAME}"

  TMP_DIR=$(mktemp -d)
  curl -sSL "$DOWNLOAD_URL" -o "$TMP_DIR/tflint.zip"

  python3 - "$TMP_DIR/tflint.zip" "$TMP_DIR" <<'PY'
import sys
import zipfile

zip_path, dest_dir = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(zip_path) as archive:
    archive.extractall(dest_dir)
PY

  mv "$TMP_DIR/tflint" "$BIN_PATH"
  chmod +x "$BIN_PATH"
  rm -rf "$TMP_DIR"
fi

exec "$BIN_PATH" "$@"
