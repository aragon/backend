FROM node:lts-alpine

# Create non-root user and use it as the default user
RUN addgroup -S app && adduser -S app -G app -s /sbin/nologin && mkdir -p /app && chown -R app:app /app
USER app
WORKDIR /app

# Copy necessary build files
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.build.json ./tsconfig.build.json

# Build the project
RUN yarn install --frozen-lockfile --prod
RUN yarn build

CMD [ "yarn", "start"]