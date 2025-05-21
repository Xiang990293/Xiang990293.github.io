# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

# Build 階段，安裝 Python 及編譯環境
FROM base AS build

RUN apt-get update -qq
RUN apt-get install --no-install-recommends -y \
        python3 python3-pip python3-venv \
        build-essential node-gyp pkg-config python-is-python3
RUN ln -sf python3 /usr/bin/python
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
RUN python3 -m venv /venv

# 複製 package.json 與 requirements.txt
COPY package.json package-lock.json requirements.txt ./

# 安裝 Node.js 套件
RUN npm ci

# 安裝 Python 套件
RUN /venv/bin/pip install --no-cache-dir -r requirements.txt

# 複製應用程式碼
COPY . .

# 最終映像，使用 base 映像，減少大小
FROM base

WORKDIR /app

# 複製 build 階段產物
COPY --from=build /app /app

# 建立資料庫與筆記資料夾
RUN mkdir -p /database /notebooks
VOLUME /database

EXPOSE 3000

ENV NODE_ENV="production"
ENV DATABASE_URL="file:///data/sqlite.db"
ENV PYTHON_PATH="/app/venv/bin/python"

CMD ["node", "server.js"]
