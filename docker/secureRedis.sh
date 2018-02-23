#!/bin.sh
# Disable CONFIG command
# rename-command CONFIG ""
# Rename CONFIG to unguessable
# rename-command CONFIG 8f23338cfc884d898c85070c9c7693c1
# Set the password
# config set requirepass "majestic"
# auth majestic
# Touch the redis server - should respond PONG
ping
