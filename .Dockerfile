FROM node:20

WORKDIR /

COPY package*.json .

RUN npm i

COPY . .

ENV TELEGRAM_TOKEN=6461274188:AAGH2HKVuO0fl93YQ7ipeUbjy377AiAB7JI

ENV NOTION_KEY=secret_fl9D3P7zRF9nZQCMmh5tEmlkZ7EeIZb5g2NyaIXIgIN

ENV NOTION_DB_ID=6848a982ae074f4b908b2a191051cf01

CMD [ "npm", "start"]

EXPOSE 7070