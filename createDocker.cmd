REM * Cleanup
REM * Stop Container
docker stop redis-svr
REM * Remove Container
docker rm -f redis-svr
REM * Remove Image
docker image rm -f redisbase
REM * Create the image and container - deploy
docker build -t redisbase --iidfile imageID -f docker/Dockerfile .
docker run -d --name redis-svr -p6379:6379 redisbase
