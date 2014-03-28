NGINX_DIR=/usr/share/nginx/www
TS=$(shell find public/ts -name "*.ts" -print)
JS=$(TS:.ts=.js)

nginx: $(TS) $(JS)
	mkdir -p $(NGINX_DIR)/scuffle
	mkdir -p $(NGINX_DIR)/scuffle/js
	mkdir -p $(NGINX_DIR)/scuffle/lib
	cp -rf public/html/* $(NGINX_DIR)/scuffle
	cp -rf public/ts/*.js $(NGINX_DIR)/scuffle/js
	cp -rf lib/* $(NGINX_DIR)/scuffle/lib

clean:
	rm -f $(JS)

%.js: %.ts
	tsc $^
