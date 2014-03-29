NGINX_DIR=/usr/share/nginx/www
TS=$(shell find public/ts -name "*.ts" -print)

nginx: $(TS)
	mkdir -p $(NGINX_DIR)/scuffle
	mkdir -p $(NGINX_DIR)/scuffle/img
	mkdir -p $(NGINX_DIR)/scuffle/js
	mkdir -p $(NGINX_DIR)/scuffle/lib
	tsc lib/phaser.d.ts public/ts/*.ts --out public/ts/scuffle.js
	cp -rf public/html/*  $(NGINX_DIR)/scuffle
	cp -rf public/img/*   $(NGINX_DIR)/scuffle/img
	cp -rf public/ts/*.js $(NGINX_DIR)/scuffle/js
	cp -rf lib/*          $(NGINX_DIR)/scuffle/lib

clean:
	rm -f public/ts/scuffle.js
