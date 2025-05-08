# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.18.0
ARG PYTHON_VERSION=3.12
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
        python${PYTHON_VERSION} python3-pip python3-venv \
        build-essential node-gyp pkg-config python-is-python3 && \
    ln -sf python${PYTHON_VERSION} /usr/bin/python3 && \
    ln -sf python3 /usr/bin/python && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install node modules
COPY package-lock.json package.json ./
COPY requirements.txt ./
RUN npm ci
RUN npm install
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .



# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Setup sqlite3 on a separate volume & Copy notebooks folder into /notebooks
RUN mkdir -p /database /notebooks
VOLUME /database

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000

# Set production environment
ENV NODE_ENV="production"
ENV DATABASE_URL="file:///data/sqlite.db"
CMD [ "node", "server.js" ]
