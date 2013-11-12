
install:
	npm install     # Install node modules
	bower install   # Install bower components
	bower update
	grunt build     # Build & test client app
