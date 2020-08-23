# ----------------- 编译 ------------
FROM node:12.18.3 as builder

WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm config set registry https://registry.npm.taobao.org --global
RUN npm config set disturl http://npm.taobao.org/mirrors/node --global
RUN npm install
COPY . .
RUN npm run build


# ------------ 发布 ----------------
FROM node:12.18.3-alpine3.12

# clone, compile and install pdf2htmlEX and related dependency packages
RUN apk add --no-cache git openssh sudo
RUN git clone https://github.com/pdf2htmlEX/pdf2htmlEX.git --depth 1
RUN cd pdf2htmlEX && git fetch --unshallow
RUN cd pdf2htmlEX && ./buildScripts/buildInstallLocallyAlpine
RUN rm -rf pdf2htmlEX

WORKDIR /usr/src/app

# install dependencies
COPY --from=builder /usr/src/app/package*.json ./
RUN npm config set registry https://registry.npm.taobao.org --global
RUN npm config set disturl http://npm.taobao.org/mirrors/node --global
RUN npm install --only=production
RUN npm install -D sequelize-cli

# 拷贝编译结果
COPY --from=builder /usr/src/app/dist/ dist/
COPY --from=builder /usr/src/app/README.md .

WORKDIR  /usr/src/app/dist

CMD sh ./database/init_db.sh && node .
