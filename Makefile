test:
	@./node_modules/.bin/mocha

npm-restore-links:
	@ln -f -s node_modules/mocha/bin/mocha node_modules/.bin/mocha 

.PHONY: test npm-link
