FROM node:8-alpine
RUN mkdir -p /root/console
WORKDIR /root/console
COPY . /root/console
RUN mv dist/server.js server/server.js \
    && mv dist/fonts fonts
EXPOSE 8000
CMD ["npm", "run", "serve"]