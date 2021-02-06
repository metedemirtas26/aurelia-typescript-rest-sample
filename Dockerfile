# use latest version of nodejs
FROM node:12.2.0 as build

# install chrome for protractor tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

# install aurelia-cli to build the app & http-server to serve static contents
RUN npm i -g http-server
RUN npm i -g aurelia-cli

# set working directory to app
# henceforth all commands will run inside this folder
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install

# copy the rest of files and folders & install dependencies
COPY . ./
RUN npm run build --output-path=dist

# use nginx as the http server to serve contents
FROM nginx:1.16.0-alpine
WORKDIR /usr/share/nginx/html
# copy files from previous container/stage into the new one
# from /app/dist to working directory
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]" ]

