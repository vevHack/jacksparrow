test:
	@./node_modules/.bin/mocha

npm-restore-links:
	@for f in mocha _mocha ; \
	do \
		ln -f -s -t node_modules/.bin/ \
			`readlink --canonicalize node_modules/mocha/bin/$f` ; \
	done


.PHONY: test npm-link
