# redis-app

## Docker setup

*__The geo spatial operations are not supported on the version of redis created for Windows__* [here](https://redis.io/download). An alternative to Redis on Windows is to host on Docker. [Docker container setup](https://github.com/Majestic3691/redis-tasks/blob/master/docker/README.md)

### Description
Node.js Application to use list, hash and geo spatial operations of redis

## Atom setup
1. Change directory to the root folder and run ```npm install``` in a command window

### Install/Configure application
##### 1. Start a command window
##### 2. Create a directory C:\apps
```
mkdir c:\apps
cd c:\apps
```
##### 3. Clone the repo
```
git clone https://github.com/Majestic3691/redis-tasks
```
##### 4. Change the directory to where the repo was cloned - C:\apps\redis-tasks
```
cd c:\apps\redis-tasks
```
##### 5. Modify the *config.js* to reflect the proper IP for the docker container and password if the redis installation is secured with a password.

##### 6. Execute nodemon
```
z:\>nodemon
[nodemon] 1.14.12
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node app.js`
Server Started at Thu Feb 15 2018 14:34:07 GMT-0600 (Central Standard Time) on Port 3000...
Redis Server Connected at 192.168.1.187:6379...
Authentication was passed to the Redis Server, response was: OK
Redis Server was pinged, response was: PONG
```
##### 7. Start your favorite browser and enter the URL - http://localhost:3000/
##### 8. Try out all three sets of operations...enjoy.

### Technology used
1. [Node.js](https://nodejs.org/)
2. [Pug](https://jade-lang.com/)
2. [ejs](http://ejs.co/)  
3. [nodemon](https://www.npmjs.com/package/nodemon)
3. [Docker](https://www.docker.com/)
4. [Redis](https://redis.io/)
5. [Twitter Bootstrap](https://getbootstrap.com/2.3.2/)
6. [Express](https://expressjs.com)
