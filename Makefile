VERSION ?= v0.0.4-dev1616
IMG_REG ?= symcn.tencentcloudcr.com/symcn
IMG_CTL := $(IMG_REG)/kunkka-console


docker-push-console:
	docker build -t ${IMG_CTL}:${VERSION}  .
	docker push ${IMG_CTL}:${VERSION}
