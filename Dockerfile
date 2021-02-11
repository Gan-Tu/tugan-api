FROM node:12
# Copy license
COPY LICENSE ./LICENSE 
# Install & cache node packages
COPY package.json ./
COPY package-lock.json ./
RUN npm install
# Copy code assets
COPY views ./views
COPY bin ./bin
COPY app.js ./
COPY routes ./routes
# Copy non-code static assets
COPY public ./public
COPY README.md ./
# Run command
ENV PORT 8080
CMD ["npm", "start"]