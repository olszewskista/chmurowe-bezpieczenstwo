#!/bin/zsh

docker build -t olszewskista/back_bez:latest ./backend/
docker build -t olszewskista/front_bez:latest ./frontend/

docker push olszewskista/back_bez:latest
docker push olszewskista/front_bez:latest