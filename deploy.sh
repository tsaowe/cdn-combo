#!/usr/bin/env sh


# origin command `docker run -d --name cdn-combo-container -p 9999:4000 cdn-combo-image`

docker run -d --name cdn-combo-container -p 9999:4000 cdn-combo-image

echo "Deployed! port 9999, container name: cdn-combo-container"
