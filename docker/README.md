# docker-redis
This is the procedure for creating a new docker machine, load redis container, load the data and connect/verify the installation.

### Remove Docker machine (wish to remove machine)
```
z:\> docker-machine rm -f defaultVM
About to remove defaultVM
WARNING: This action will delete both local reference and remote instance.
Error removing host "defaultVM": exit status 1
Successfully removed defaultVM
```

### Create Docker machine for hosting Redis
```
docker-machine create -d hyperv --hyperv-virtual-switch "Majestic LAN Virtual Switch" defaultVM
```

### Configure environment
#### 1. docker-machine ls - returns names of docker machines
```
z:\>docker-machine ls
NAME        ACTIVE   DRIVER   STATE     URL                        SWARM   DOCKER        ERRORS
defaultVM   *        hyperv   Running   tcp://192.168.1.211:2376           v18.02.0-ce
```
#### 2. Get environment to specific docker machine
```
z:\>docker-machine env defaultVM
SET DOCKER_TLS_VERIFY=1
SET DOCKER_HOST=tcp://192.168.1.211:2376
SET DOCKER_CERT_PATH=C:\Users\Michael\.docker\machine\machines\defaultVM
SET DOCKER_MACHINE_NAME=defaultVM
SET COMPOSE_CONVERT_WINDOWS_PATHS=true
REM Run this command to configure your shell:
REM     @FOR /f "tokens=*" %i IN ('docker-machine env defaultVM') DO @%i
```
#### 3. Set environment
```
z:\>& "C:\Program Files\Docker\Docker\Resources\bin\docker-machine.exe" env defaultVM | Invoke-Expression
```
#### 4. Create the image, the container and deploy.
```
z:\>docker images prune -q
z:\>docker container prune -f
Total reclaimed space: 0B
z:\>docker stop redis-svr
redis-svr
z:\>docker rm -f redis-svr
redis-svr
z:\>docker image rm -f redisbase
Untagged: redisbase:latest
Deleted: sha256:c4dd29c35e011d942e5e6422e619895a6567208324c903ff8215fd19eca84878
z:\>docker build --rm --tag redisbase --iidfile imageID --file docker/Dockerfile .
Sending build context to Docker daemon   25.2MB
Step 1/10 : FROM redis
 ---> 33c26d72bd74
Step 2/10 : LABEL vendor="MTR Consulting"
 ---> Running in 20461b034e2e
Removing intermediate container 20461b034e2e
 ---> 61aa0b6bd241
Step 3/10 : LABEL maintainer="Name <email@email.com>"
 ---> Running in 98767bc4e64d
Removing intermediate container 98767bc4e64d
 ---> 4ffb9ae765eb
Step 4/10 : LABEL com.example.version="0.0.1-beta"
 ---> Running in 751711a3d5a8
Removing intermediate container 751711a3d5a8
 ---> 2351b6be160f
Step 5/10 : LABEL com.example.release-date="2018-02-28"
 ---> Running in 839f92000e64
Removing intermediate container 839f92000e64
 ---> 69c5eea31dc6
Step 6/10 : WORKDIR /usr/share/redis/data
Removing intermediate container b9c7474a0eae
 ---> 865b4f745244
Step 7/10 : COPY ./data/*.data /usr/share/redis/data/
 ---> 61e78ed300b6
Step 8/10 : COPY ./data/loaddata.sh /usr/share/redis/data/
 ---> 2f91e0dc7632
Step 9/10 : COPY ./docker/redis.conf /etc/
 ---> 51e2a62e8ca9
Step 10/10 : RUN   mkdir -p /etc/redis &&   mv /etc/redis.conf /etc/redis &&   ls -lta /etc/redis &&   echo ">> Starting Redis to load data..." &&   redis-server /etc/redis/redis.conf &&   echo ">> /usr/local/bin/redis-cli ping" &&   /usr/local/bin/redis-cli ping &&   echo ">> Loading State Airports..." &&   cat /usr/share/redis/data/StateAirportsSetReady.data | /usr/local/bin/redis-cli --pipe  &&   echo ">> Loading States..." &&   cat /usr/share/redis/data/StatesReady.data | /usr/local/bin/redis-cli --pipe &&   echo ">> Loading Tasks..." &&   cat /usr/share/redis/data/TaskReady.data | /usr/local/bin/redis-cli --pipe &&   echo ">> Loading GEO data..." &&   cat /usr/share/redis/data/GEOAirportDataReady.data | /usr/local/bin/redis-cli --pipe &&   echo ">> Loading Call Log..." &&   cat /usr/share/redis/data/CallReady.data | /usr/local/bin/redis-cli --pipe &&   echo ">> Verify GEO data..." &&   /usr/local/bin/redis-cli geopos Texas Amoco &&   echo ">> Verify Tasks data..." &&   /usr/local/bin/redis-cli lrange tasks 0 -1 &&   echo ">> Verify States..." &&   /usr/local/bin/redis-cli smembers states &&   echo ">> Verify State Airports (Massachusetts Cranland Crowhurst mi)..." &&   /usr/local/bin/redis-cli geodist Massachusetts Cranland Crowhurst mi &&   echo ">> Verify Call Log..." &&   /usr/local/bin/redis-cli hgetall call &&   echo ">> Save the loaded data..." &&   cd /usr/share/redis/data && /usr/local/bin/redis-cli save &&   chown redis:redis /usr/share/redis/data/dump.rdb &&   chmod 660 /usr/share/redis/data/dump.rdb &&   ls -lta /usr/share/redis/data/dump.rdb &&   echo ">> Copy DB Backup to /data..." &&   cp /usr/share/redis/data/dump.rdb /data &&   ls -lta /usr/share/redis/data/dump.rdb &&   echo ">> Shutdown Redis Server..." &&   /usr/local/bin/redis-cli shutdown
 ---> Running in 0eaf92df6227
total 68
drwxr-xr-x  2 root root  4096 Mar  1 19:48 .
drwxr-xr-x 42 root root  4096 Mar  1 19:48 ..
-rwxr-xr-x  1 root root 59689 Feb 28 21:14 redis.conf
>> Starting Redis to load data...
8:C 01 Mar 19:48:32.500 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
8:C 01 Mar 19:48:32.500 # Redis version=4.0.8, bits=64, commit=00000000, modified=0, pid=8, just started
8:C 01 Mar 19:48:32.500 # Configuration loaded
>> /usr/local/bin/redis-cli ping
PONG
>> Loading State Airports...
All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 19380
>> Loading States...
All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 58
>> Loading Tasks...
All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 4
>> Loading GEO data...
All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 61
>> Loading Call Log...
All data transferred. Waiting for the last reply...
Last reply received from server.
errors: 0, replies: 1
>> Verify GEO data...
-95.19020587205886841
29.23135112784979839
>> Verify Tasks data...
Plan SpaceX vacation
Investor Meeting
Award Dinner
Grocery Shopping
>> Verify States...
...Wyoming
Hawaii
Louisiana
Missouri
Guam
North Dakota
Nevada
Nebraska...all states listed
>> Verify State Airports (Massachusetts Cranland Crowhurst mi)...
38.4314
>> Verify Call Log...
name
Joe
company
Caterpillar
phone
3096551235
time
Thursday 09:00
>> Save the loaded data...
OK
-rw-rw---- 1 redis redis 731041 Mar  1 19:48 /usr/share/redis/data/dump.rdb
>> Copy DB Backup to /data...
-rw-rw---- 1 redis redis 731041 Mar  1 19:48 /usr/share/redis/data/dump.rdb
>> Shutdown Redis Server...
Removing intermediate container 0eaf92df6227
 ---> 92b1d88a1b68
Successfully built 92b1d88a1b68
Successfully tagged redisbase:latest
SECURITY WARNING: You are building a Docker image from Windows against a non-Windows Docker host. All files and directories added to build context will have '-rwxr-xr-x' permissions. It is recommended to double check and reset permissions for sensitive files and directories.

z:\>docker run -d --name redis-svr -p6379:6379 -v redis-data:/usr/share/redis/data redisbase
8506a7932f7975b93a16a0745e82762921a2c4f13dc46c18db49cb83b8fa5a91
```
#### 5. List containers running on machine
```
z:\>docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
66de7f65f072        redisbase           "docker-entrypoint.s…"   19 hours ago        Up 19 hours         0.0.0.0:6379->6379/tcp   redis-svrdocker ps -a
```

#### 6. Inspect Host Machine
Make a note of the IP Address of the container - needed for the configuration file of the single page application.
```
z:\>docker-machine inspect defaultVM
{
    "ConfigVersion": 3,
    "Driver": {
        "IPAddress": "192.168.1.211",
        "MachineName": "defaultVM",
...
```

#### 7. Inspect Container
```
z:\>docker inspect redis-svr
```
#### Troubleshooting - Docker

###### Verify port on container using ID
```
z:\> docker port 7cc69388ef9e 6379/tcp
Error: No public port '6379/tcp' published for 7cc69388ef9e
```
###### Verify port on container using name
```
z:\>docker port redis-svr 6379/tcp
Error: No public port '6379/tcp' published for redis-svr
```

###### Get container environment
```
z:\>docker container exec redis-svr env
```

###### Redis-client -verify server is running
```
z:\>docker container exec -i redis-svr /usr/local/bin/redis-cli ping
PONG
```

###### Interactive shell - access to the container file system
```
z:\>docker container exec -t -i redis-svr /bin/bash
```

#### Troubleshooting - Redis

###### Create a monitor for the Redis service
```
z:\>docker container exec -t -i redis-svr /bin/bash
/usr/local/bin/redis-cli client set name Monitor
/usr/local/bin/redis-cli monitor
```

###### List the clients connected to the Redis service
```
z:\>docker container exec -t -i redis-svr /usr/local/bin/redis-cli client list
```

#### Display information for the Redis service
```
z:\>docker container exec -t -i redis-svr /usr/local/bin/redis-cli info
```

#### Verify data installation/Configuration (within the container)

###### Verify the GEO data is loaded
```
z:\> docker container exec -t -i redis-svr /usr/local/bin/redis-cli geopos Texas Amoco
1) 1) "-95.19020587205886841"
   2) "29.23135112784979839"
```

###### Verify the Tasks data is loaded
```
z:\> docker container exec -t -i redis-svr /usr/local/bin/redis-cli lrange tasks 0 -1
```

###### Verify the State data is loaded
```
z:\> docker container exec -t -i redis-svr /usr/local/bin/redis-cli smembers states
```

###### Verify the State Airport data is loaded
```
z:\> docker container exec -t -i redis-svr /usr/local/bin/redis-cli geodist Massachusetts Cranland Crowhurst mi
"38.4314"
```

###### Verify the Call data is loaded
```
z:\> docker container exec -t -i redis-svr /usr/local/bin/redis-cli hgetall call
1) "name"
2) "Joe"
3) "company"
4) "Caterpillar"
5) "phone"
6) "3096551235"
7) "time"
8) "Thursday 09:00"
```

###### Verify a few State Airport list is loaded
```
z:\> docker container exec -t -i redis-svr /usr/local/bin/redis-cli smembers alabama
...lists 275 airports...

z:\> docker container exec -t -i redis-svr /usr/local/bin/redis-cli smembers wyoming
...lists 120 airports...
```

#### References
###### [Redis on Docker in Windows](https://blogs.msdn.microsoft.com/uk_faculty_connection/2017/02/21/containers-redis-running-redis-on-windows-with-docker/)

###### [Redis image Docker Store](https://store.docker.com/images/redis?tab=description/)
