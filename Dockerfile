FROM node:5.6

# if package.json hasn't updated, docker should use
# same image built for this first part, better caching
ADD package.json /betasmartz-ui/package.json
RUN cd /betasmartz-ui && npm install

# Bundle app source
ADD . /betasmartz-ui
WORKDIR /betasmartz-ui
RUN npm install

EXPOSE  3000

CMD ["npm", "start"]
