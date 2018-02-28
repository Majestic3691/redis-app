REM * Cleanup
docker images prune -q
REM * docker volume prune -f
docker container prune -f
REM * Stop Container
docker stop redis-svr
REM * Remove Container
docker rm -f redis-svr
REM * Remove Image
docker image rm -f redisbase
REM * Create the image and container - deploy
REM * docker volume create --name redis-data
REM * COPY ./data/*.data redis-data
docker build --rm --tag redisbase --iidfile imageID --file docker/Dockerfile .
docker run -d --name redis-svr -p6379:6379 -v redis-data:/usr/share/redis/data redisbase
