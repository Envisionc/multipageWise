#!/bin/bash

MODULE=$1
ENV=$2

VERSION=`date "+%Y%m%d%H%M%S"`
IMAGE_NAME=${MODULE}:${VERSION}

docker build --build-arg env=${ENV} -t ${IMAGE_NAME} .

docker push ${IMAGE_NAME}