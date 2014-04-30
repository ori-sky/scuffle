CLIENT_OUT=public/js/scuffle.js
SERVER_OUT=server/scuffled.js
CLIENT_LIB=lib/phaser.d.ts lib/socket.io.client.d.ts
SERVER_LIB=lib/node.d.ts lib/socket.io.d.ts
COMMON_TS=$(shell find common -name "*.ts" -print)
CLIENT_TS=$(shell find public/ts -name "*.ts" -print)
SERVER_TS=$(shell find server -name "*.ts" -print)
DEPLOY_DIR=/usr/local/nginx/html
.PHONY: all client server deploy clean

all: client server
client: $(CLIENT_OUT)
server: $(SERVER_OUT)

$(CLIENT_OUT): $(CLIENT_LIB) $(COMMON_TS) $(CLIENT_TS)
	tsc $^ --target ES5 --out $@
	ccjs $@ --language_in=ECMASCRIPT5 > $@.optm

$(SERVER_OUT): $(SERVER_LIB) $(COMMON_TS) $(SERVER_TS)
	tsc $^ --target ES5 --out $@
	ccjs $@ --language_in=ECMASCRIPT5 --externs=node > $@.optm

deploy:
	mkdir -p $(DEPLOY_DIR)/scuffle
	mkdir -p $(DEPLOY_DIR)/scuffle/css
	mkdir -p $(DEPLOY_DIR)/scuffle/img
	mkdir -p $(DEPLOY_DIR)/scuffle/audio
	mkdir -p $(DEPLOY_DIR)/scuffle/js
	mkdir -p $(DEPLOY_DIR)/scuffle/lib
	cp -rf public/html/*   $(DEPLOY_DIR)/scuffle
	cp -rf public/css/*    $(DEPLOY_DIR)/scuffle/css
	cp -rf public/img/*    $(DEPLOY_DIR)/scuffle/img
	cp -rf public/audio/*  $(DEPLOY_DIR)/scuffle/audio
	cp -rf public/js/*     $(DEPLOY_DIR)/scuffle/js
	cp -rf public/lib/*    $(DEPLOY_DIR)/scuffle/lib

clean:
	rm -f $(CLIENT_OUT) $(SERVER_OUT) $(CLIENT_OUT).optm $(SERVER_OUT).optm
