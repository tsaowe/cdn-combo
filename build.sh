#!/usr/bin/env sh

# origin command `docker build -t cdn-combo-image .`

imageName="cdn-combo-image"

# if has $1, use it as image name
if [ -n "$1" ]; then
    imageName="$1"
fi

# build image
docker build -t $imageName .
