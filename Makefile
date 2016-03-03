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
	mkdir -pv $(DEPLOY_DIR)/scuffle
	mkdir -pv $(DEPLOY_DIR)/scuffle/css
	mkdir -pv $(DEPLOY_DIR)/scuffle/img
	mkdir -pv $(DEPLOY_DIR)/scuffle/audio
	mkdir -pv $(DEPLOY_DIR)/scuffle/js
	mkdir -pv $(DEPLOY_DIR)/scuffle/lib
	cp -rfv public/html/*   $(DEPLOY_DIR)/scuffle
	cp -rfv public/css/*    $(DEPLOY_DIR)/scuffle/css
	cp -rfv public/img/*    $(DEPLOY_DIR)/scuffle/img
	cp -rfv public/audio/*  $(DEPLOY_DIR)/scuffle/audio
	cp -rfv public/js/*     $(DEPLOY_DIR)/scuffle/js
	cp -rfv public/lib/*    $(DEPLOY_DIR)/scuffle/lib

clean:
	rm -f $(CLIENT_OUT) $(SERVER_OUT) $(CLIENT_OUT).optm $(SERVER_OUT).optm
