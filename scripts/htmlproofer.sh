#/bin/bash

set -eu

bundle exec htmlproofer \
  --assume-extension "_site" \
  --log-level "debug" \
  --file-ignore "*.xml,README.md" \
  --http-status-ignore "999" \
  --only-4xx \
  --check-favicon \
  --check-html \
  --check-opengraph \
  --timeframe "1d" \
  --trace
