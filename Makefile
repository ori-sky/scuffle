CLIENT_OUT=public/ts/scuffle.js
SERVER_OUT=server/scuffled.js
CLIENT_LIB=lib/phaser.d.ts lib/socket.io.client.d.ts
SERVER_LIB=lib/node.d.ts lib/socket.io.d.ts
COMMON_TS=common/*.ts
CLIENT_TS=$(shell find public/ts -name "*.ts" -print)
SERVER_TS=$(shell find server -name "*.ts" -print)
DEPLOY_DIR=/usr/share/nginx/www
.PHONY: all client server deploy clean

all: client server
client: $(CLIENT_OUT)
server: $(SERVER_OUT)

$(CLIENT_OUT): $(CLIENT_LIB) $(COMMON_TS) $(CLIENT_TS)
	tsc $^ --out $@

$(SERVER_OUT): $(SERVER_LIB) $(COMMON_TS) $(SERVER_TS)
	tsc $^ --out $@

deploy:
	mkdir -p $(DEPLOY_DIR)/scuffle
	mkdir -p $(DEPLOY_DIR)/scuffle/css
	mkdir -p $(DEPLOY_DIR)/scuffle/img
	mkdir -p $(DEPLOY_DIR)/scuffle/js
	mkdir -p $(DEPLOY_DIR)/scuffle/lib
	cp -rf public/html/*  $(DEPLOY_DIR)/scuffle
	cp -rf public/css/*   $(DEPLOY_DIR)/scuffle/css
	cp -rf public/img/*   $(DEPLOY_DIR)/scuffle/img
	cp -rf public/ts/*.js $(DEPLOY_DIR)/scuffle/js
	cp -rf lib/*.js       $(DEPLOY_DIR)/scuffle/lib

clean:
	rm -f $(CLIENT_OUT) $(SERVER_OUT)
