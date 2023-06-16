FROM node:14.20.0-alpine3.16 as builder

ARG AuthToken=''

WORKDIR /frontend

ENV PATH /frontend/node_modules/.bin:$PATH

COPY . ./

RUN yarn config set registry 'https://mirrors.huaweicloud.com/repository/npm/' \
  && yarn \
  && export NODE_OPTIONS=--max_old_space_size=3072 \
  && yarn build \
  && npm config set //rjoy-npm.pkg.coding.net/plattech-npm/mkb/:_authToken=$AuthToken \
  && npm publish
