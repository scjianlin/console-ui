VERSION ?= v0.0.1

#image url
IMG_REG ?= symcn.tencentcloudcr.com/symcn
IMG_CTL := $(IMG_REG)/console

# This repo's root import path (under GOPATH).
ROOT := github.com/gostship/console

setup:
	docker volume create nodemodules

install:
	docker-compose -f docker-compose.builder.yaml run --rm install

dev:
	docker-compose up

build:
# 	docker-compose -f docker-compose.builder.yaml run --rm build
	yarn config set registry https://registry.npm.taobao.org && yarn
	yarn build
#	yarn serve

docker-build:
	docker build -t ${IMG_CTL}:${VERSION} -f Dockerfile .

yarn-%:
	docker-compose -f docker-compose.builder.yaml run --rm base yarn $*


docker-push:
	docker push ${IMG_CTL}:${VERSION}
