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
	1. docker-machine ls - returns names of docker machines
	```
	z:\>docker-machine ls
	NAME        ACTIVE   DRIVER   STATE     URL                        SWARM   DOCKER        ERRORS
	defaultVM   *        hyperv   Running   tcp://192.168.1.211:2376           v18.02.0-ce
	```
	2. Get environment to specific docker machine
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
	3. Set environment
	```
	z:\>& "C:\Program Files\Docker\Docker\Resources\bin\docker-machine.exe" env defaultVM | Invoke-Expression
	```
	4. Create the image, the container and deploy.
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
	5. List containers running on machine
	```
	z:\>docker ps -a
	CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
	66de7f65f072        redisbase           "docker-entrypoint.s…"   19 hours ago        Up 19 hours         0.0.0.0:6379->6379/tcp   redis-svrdocker ps -a
	```




### Create containers

###




#### Create containers
```
docker run -d --name redis-svr -p 6379:6379 redis
docker run --name redis-svr -d redis
```

#### Stop and remove Container
```
docker stop 49f1ba79eb3e
docker rm 49f1ba79eb3e
```

#### Stop all containers
```
docker stop $(docker ps -aq)
```

#### Remove all containers
```
docker rm $(docker ps -aq)
```

#### Remove all images
```
docker rmi $(docker images -q)
```

#### Run detached
```
docker run -d --name redis-svr -p 6379:6379/tcp redis
docker run --name redis-svr -d redis
```

#### Connect redis client to host
```
redis-cli -h 192.168.1.188 -p 6379 ping
```

#### Container
```
docker container exec -t -i 7cc69388ef9e /bin/bash
```

#### Inspect Container
```
docker inspect 7cc69388ef9e      ip: 172.17.0.2    gateway: 172.17.0.1
 PS C:\WINDOWS\system32> docker inspect 7cc69388ef9e
[
    {
        "Id": "7cc69388ef9e6f986db560b848e3e957d9072aee8bb35788d740e41511e1d607",
        "Created": "2018-01-09T22:57:27.823102053Z",
        "Path": "docker-entrypoint.sh",
        "Args": [
            "redis-server"
        ],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 8213,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2018-01-09T22:57:28.109391502Z",
            "FinishedAt": "0001-01-01T00:00:00Z"
        },
        "Image": "sha256:1e70071f4af45af2cc9e1d1300c675c1ce37ee25a8a5cef1f375db5ed461dbab",
        "ResolvConfPath": "/mnt/sda1/var/lib/docker/containers/7cc69388ef9e6f986db560b848e3e957d9072aee8bb35788d740e41511e1d607/resolv.conf",
        "HostnamePath": "/mnt/sda1/var/lib/docker/containers/7cc69388ef9e6f986db560b848e3e957d9072aee8bb35788d740e41511e1d607/hostname",
        "HostsPath": "/mnt/sda1/var/lib/docker/containers/7cc69388ef9e6f986db560b848e3e957d9072aee8bb35788d740e41511e1d607/hosts",
        "LogPath": "/mnt/sda1/var/lib/docker/containers/7cc69388ef9e6f986db560b848e3e957d9072aee8bb35788d740e41511e1d607/7cc69388ef9e6f986db560b848e3e957d9072aee8bb35788d7
40e41511e1d607-json.log",
        "Name": "/redis-svr",
        "RestartCount": 0,
        "Driver": "aufs",
        "Platform": "linux",
        "MountLabel": "",
        "ProcessLabel": "",
        "AppArmorProfile": "",
        "ExecIDs": [
            "f8a8c896c31f59cc402b38197cc5ab008f7e4d8b8a0131735b35faff2942ced0",
            "7ab9af23d04864d2dcc5a8950f6e69d5fcf8492ad348669618b5edac9f9c43d0"
        ],
        "HostConfig": {
            "Binds": null,
            "ContainerIDFile": "",
            "LogConfig": {
                "Type": "json-file",
                "Config": {}
            },
            "NetworkMode": "default",
            "PortBindings": {},
            "RestartPolicy": {
                "Name": "no",
                "MaximumRetryCount": 0
            },
            "AutoRemove": false,
            "VolumeDriver": "",
            "VolumesFrom": null,
            "CapAdd": null,
            "CapDrop": null,
            "Dns": [],
            "DnsOptions": [],
            "DnsSearch": [],
            "ExtraHosts": null,
            "GroupAdd": null,
            "IpcMode": "shareable",
            "Cgroup": "",
            "Links": null,
            "OomScoreAdj": 0,
            "PidMode": "",
            "Privileged": false,
            "PublishAllPorts": false,
            "ReadonlyRootfs": false,
            "SecurityOpt": null,
            "UTSMode": "",
            "UsernsMode": "",
            "ShmSize": 67108864,
            "Runtime": "runc",
            "ConsoleSize": [
                50,
                120
            ],
            "Isolation": "",
            "CpuShares": 0,
            "Memory": 0,
            "NanoCpus": 0,
            "CgroupParent": "",
            "BlkioWeight": 0,
            "BlkioWeightDevice": [],
            "BlkioDeviceReadBps": null,
            "BlkioDeviceWriteBps": null,
            "BlkioDeviceReadIOps": null,
            "BlkioDeviceWriteIOps": null,
            "CpuPeriod": 0,
            "CpuQuota": 0,
            "CpuRealtimePeriod": 0,
            "CpuRealtimeRuntime": 0,
            "CpusetCpus": "",
            "CpusetMems": "",
            "Devices": [],
            "DeviceCgroupRules": null,
            "DiskQuota": 0,
            "KernelMemory": 0,
            "MemoryReservation": 0,
            "MemorySwap": 0,
            "MemorySwappiness": null,
            "OomKillDisable": false,
            "PidsLimit": 0,
            "Ulimits": null,
            "CpuCount": 0,
            "CpuPercent": 0,
            "IOMaximumIOps": 0,
            "IOMaximumBandwidth": 0
        },
        "GraphDriver": {
            "Data": null,
            "Name": "aufs"
        },
        "Mounts": [
            {
                "Type": "volume",
                "Name": "89375a2327f3bcf489f47b8b65bf48b27e3ffae9917d73176a9edf83a18fe700",
                "Source": "/mnt/sda1/var/lib/docker/volumes/89375a2327f3bcf489f47b8b65bf48b27e3ffae9917d73176a9edf83a18fe700/_data",
                "Destination": "/data",
                "Driver": "local",
                "Mode": "",
                "RW": true,
                "Propagation": ""
            }
        ],
        "Config": {
            "Hostname": "7cc69388ef9e",
            "Domainname": "",
            "User": "",
            "AttachStdin": false,
            "AttachStdout": false,
            "AttachStderr": false,
            "ExposedPorts": {
                "6379/tcp": {}
            },
            "Tty": false,
            "OpenStdin": false,
            "StdinOnce": false,
            "Env": [
                "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                "GOSU_VERSION=1.10",
                "REDIS_VERSION=4.0.6",
                "REDIS_DOWNLOAD_URL=http://download.redis.io/releases/redis-4.0.6.tar.gz";,
                "REDIS_DOWNLOAD_SHA=769b5d69ec237c3e0481a262ff5306ce30db9b5c8ceb14d1023491ca7be5f6fa"
            ],
            "Cmd": [
                "redis-server"
            ],
            "ArgsEscaped": true,
            "Image": "redis",
            "Volumes": {
                "/data": {}
            },
            "WorkingDir": "/data",
            "Entrypoint": [
                "docker-entrypoint.sh"
            ],
            "OnBuild": null,
            "Labels": {}
        },
        "NetworkSettings": {
            "Bridge": "",
            "SandboxID": "9f36c188e9f5319f42771af8dc58bfbb7f861b0fe9461524e7f46bfa40255b2b",
            "HairpinMode": false,
            "LinkLocalIPv6Address": "",
            "LinkLocalIPv6PrefixLen": 0,
            "Ports": {
                "6379/tcp": null
            },
            "SandboxKey": "/var/run/docker/netns/9f36c188e9f5",
            "SecondaryIPAddresses": null,
            "SecondaryIPv6Addresses": null,
            "EndpointID": "375e7323264d9233b77865c417b96a1d2443e5db2a8ac2d3961b612014cf0696",
            "Gateway": "172.17.0.1",
            "GlobalIPv6Address": "",
            "GlobalIPv6PrefixLen": 0,
            "IPAddress": "172.17.0.2",
            "IPPrefixLen": 16,
            "IPv6Gateway": "",
            "MacAddress": "02:42:ac:11:00:02",
            "Networks": {
                "bridge": {
                    "IPAMConfig": null,
                    "Links": null,
                    "Aliases": null,
                    "NetworkID": "5089ab0aa5008016bee23f32b35ec5f72929f67e2f688ca1eaffe8072e3c6ab7",
                    "EndpointID": "375e7323264d9233b77865c417b96a1d2443e5db2a8ac2d3961b612014cf0696",
                    "Gateway": "172.17.0.1",
                    "IPAddress": "172.17.0.2",
                    "IPPrefixLen": 16,
                    "IPv6Gateway": "",
                    "GlobalIPv6Address": "",
                    "GlobalIPv6PrefixLen": 0,
                    "MacAddress": "02:42:ac:11:00:02",
                    "DriverOpts": null
                }
            }
        }
    }
]
```

```
docker inspect be52e2b94e4f       ip: 172.17.0.3    gateway: 172.17.0.1
```

Verify port on container using ID
docker port 7cc69388ef9e 6379/tcp
```
PS C:\Users\Michael> docker port 7cc69388ef9e 6379/tcp
Error: No public port '6379/tcp' published for 7cc69388ef9e
```
Verify port on container using name
docker port redis-svr 6379/tcp
```
PS C:\Users\Michael> docker port redis-svr 6379/tcp
Error: No public port '6379/tcp' published for redis-svr
```

#### Get container environment
```
docker container exec be52e2b94e4f env
```

#### Interactive redis-client
```
docker container exec -i be52e2b94e4f /usr/local/bin/redis-cli -h 172.17.0.2

docker container exec -i 7cc69388ef9e /usr/local/bin/redis-cli ping
PS C:\Users\Michael> docker container exec -i 7cc69388ef9e /usr/local/bin/redis-cli ping
PONG
#### Interactive shell
```
docker container exec -t -i be52e2b94e4f /bin/bash
```

#### Start Redis-cli
```
/usr/local/bin/redis-cli
```

#### Monitor
```
/usr/local/bin/redis-cli client setname Monitor
/usr/local/bin/redis-cli monitor
```

#### Client List
```
/usr/local/bin/redis-cli client list
```

#### Information
```
/usr/local/bin/redis-cli info

```

### Verify installation/Configuration (within the container)
#### Execute bash from within the Docker container
```
PS C:\Users\Michael> docker container exec -t -i 7cc69388ef9e /bin/bash
root@7cc69388ef9e:/data#
```

#### Verify the redis server is operational
```
root@7cc69388ef9e:/data# /usr/local/bin/redis-cli  127.0.0.1:6379> ping
PONG


#### Verify the GEO data is loaded in Redis
```
127.0.0.1:6379> geopos Texas Amoco
1) 1) "-95.19020587205886841"
   2) "29.23135112784979839"
127.0.0.1:6379>
```

docker container exec -t -i redis-svr /usr/local/bin/redis-cli ping
docker container exec -t -i redis-svr /usr/local/bin/redis-cli geopos Texas Amoco
docker container exec -t -i redis-svr /usr/local/bin/redis-cli lrange tasks 0 -1

Redis GEO dataset
cat /home/LoadAirportData.cmd | /usr/local/bin/redis-cli --pipe -h 172.17.0.2

Redis Mass load
https://redis.io/topics/mass-insert

Copy file into container
EXAMPLE - docker cp <file> <mycontainer>:/<file>
```
docker cp C:\Projects\AWS\github\redis-tasks\data\LoadAirportDataReady.cmd be52e2b94e4f:/home/LoadAirportData.cmd
```

#### From Host, Test connection to Redis in Docker
```
docker run -it --rm redis redis-cli ping
Reply> pong
docker run -it --rm redis-svr /usr/local/bin/redis-cli
docker run -it --rm redis-svr /usr/local/bin/redis-cli
```

Need netcat for the file2resp.sh script to function
apt-get install netcat

**ISSUE - Texas data set is 84547 and REDIS_INLINE_MAX_SIZE is set to 65536
Need to figure out how to send more that 64k in transmission


Linking Containers
We may also choose to use container links to provide access to our Redis database, create multiple Redis clients to securely transfer or share information about one container to another.
First, let’s create a container called redis1 running redis image, where flag –d specifies the container to run on background, meaning you will not an image in Figure 1.
> docker run –d --name redis1 redis
> docker run –d --name redis_svr redis
Second comes to the linking part. The key part is ‘--link redis1:redis’, linking container client1 and redis1 together. Another unseen part is –it flag, which can be separated as -i and -t, must be used together for interactive processes like a shell. sh at the end allows us to go into the shell and run both Redis server and redis-cli.
> docker run -it -p 6379:6379 --link redis_svr:redis --name redis_client1 redis sh
In similar manner in a new terminal, a second Redis client can be created and link to redis1 container as well. Here, we will allow Docker to assign a host port to the container instead of still specifying it as 6379.
> docker run -it -p 6379 --link redis_svr:redis --name redis_client2 redis sh
Now both client1 and client2 are linked to redis1, we can go into the redis-cli environment and see how information is shared between two clients. Play with basic Redis commands such as GET and SET, and you will find out that the key-value pair set in client1 can be retained in client2.
# redis-cli –h redis
client1
redis:6379> SET key1 value1
OK
client2
Redis:6379> GET key1
value1
This subsection is based on the Docker Tutorial Series: Part 8: Linking Containers. If interested, please see https://rominirani.com/docker-tutorial-series-part-8-linking-containers-69a4e5bf50fb#.s7izi6ujd for further information.
To conclude with, linking containers with –p flag should be one of the powerful ways to run Redis server using Docker and connect it to your Node.js code. However, there are other ways such as linking Ubuntu with Redis to ‘Dockerize a Redis service’ https://docs.docker.com/engine/examples/running_redis_service/#/run-the-service. You may want to explore this approach depending on the need. For basic uses of Redis as NoSQL Data Structure Server, setting up linking client containers seems to be sufficient.



UsageRun redis-serverRun redis-server with persistent data directory. (creates dump.rdb)Run redis-server with persistent data directory and password.Run redis-cli
//run detached -d
docker run -d --name redis -p 6379:6379 dockerfile/redis
docker run -d -p 6379:6379 -v <data-dir>:/data --name redis dockerfile/redis
docker run -d -p 6379:6379 -v <data-dir>:/data --name redis dockerfile/redis redis-server /etc/redis/redis.conf --requirepass <password>
docker run -it --rm --link redis:redis dockerfile/redis bash -c 'redis-cli -h redis'


> docker run –p 6379:6379 redis

The port number inside the container does not need to match the port number exposed on the outside of the container. Hence we may also run

> docker run –p 6379 redis
A random host port number will be assigned to the container, and it can be found out by running
>docker port $CONTAINER ID
6379/tcp -> 0.0.0.0:32770


CLIENT Configuration
$ docker-machine env defaultVM
$ @FOR /f "tokens=*" %i IN ('docker-machine env defaultVM') DO @%i


#### Enable authentication
```
127.0.0.1:6379> config set requirepass "majestic"
OK
```

#### Authenticate the session
```
127.0.0.1:6379> auth "majestic"
OK
```


#### References
##### [Redis on Docker in Windows](https://blogs.msdn.microsoft.com/uk_faculty_connection/2017/02/21/containers-redis-running-redis-on-windows-with-docker/)

https://store.docker.com/images/redis?tab=description
