#!/bin/bash -e

git add . && \
git commit -am "Lauching Jekyll Personal Static Website" && \
git push https://github.com/raphaelbittan/raphaelbittan.github.io.git --all
