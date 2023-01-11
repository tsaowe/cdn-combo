#!/usr/bin/env sh


# origin command `docker run -d --name cdn-combo-container -p 9999:4000 cdn-combo-image`

# check if container exists
containerName="cdn-combo-container"
containerId=`docker ps -a | grep $containerName | awk '{print $1}'`

# if container exists, remove it
if [ -n "$containerId" ]; then
    docker rm -f $containerId
fi

docker run -d --name $containerName -p 9999:4000 cdn-combo-image

echo "Deployed! port 9999, container name: cdn-combo-container"
