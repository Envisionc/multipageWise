FROM registry-vpc.cn-hangzhou.aliyuncs.com/yoowang-front/node:20190424

MAINTAINER navy.chi navy.chi@outlook.com

RUN mkdir /app

COPY . /app

WORKDIR /app

ARG env
ENV deploy=${env}

# Install package
RUN npm install --registry http://172.16.246.183:8082/repository/npm-public
RUN npm run build

# Add Hosts
RUN echo "172.16.246.184  api-dev.yoowang.com" >> /etc/hosts
RUN echo "172.16.246.184  api-fat.yoowang.com" >> /etc/hosts
RUN echo "172.16.246.182  api.yoowang.com" >> /etc/hosts


ENTRYPOINT npm run start