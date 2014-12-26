.DELETE_ON_ERROR:
.INTERMEDIATE: react-async.prod.js

BIN = ../node_modules/.bin
PATH := $(BIN):$(PATH)
NAME = ReactAsync
NODE_PATH := ./src/node_modules/:$(NODE_PATH)
TARGETS = \
	react-async.js

build: $(TARGETS)

release:
	(cd src && git fetch --all && git checkout $(VERSION))
	git tag $(VERSION)
	git commit -m "$(VERSION)"
	git push origin master
	git push --tags origin master

react-async.prod.js:
	$(call browserify,production)

react-async.min.js: react-async.prod.js
	@cat $< | uglifyjs -cm > $@

react-async.js:
	$(call browserify,development)

clean:
	@rm -f $(TARGETS)

define browserify
	@mkdir -p $(@D)
	@cat ./shim.begin.js > $@
	@NODE_PATH=$(NODE_PATH) NODE_ENV=$(1) browserify -r ./:__main__ \
		| sed -E 's/function\(require/function(__browserify__/g' \
		| sed -E 's/require\(/__browserify__(/g' \
		>> $@
	@cat ./shim.end.js >> $@
endef
