# 1. Bazna slika
FROM node:18-alpine

# 2. Radna direktorija u kontejneru
WORKDIR /app

# 3. Kopiraj package fajlove
COPY package*.json ./

# 4. Instaliraj dependencije
RUN npm install

# 5. Kopiraj ostatak projekta
COPY . .

# 6. Buildaj aplikaciju
RUN npm run build

# 7. Pokreni aplikaciju
CMD ["sh", "-c", "node dist/seed/seed.js && node dist/main"]


# 8. Otvori port
EXPOSE 3000
