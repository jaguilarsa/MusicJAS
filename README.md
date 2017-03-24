# Angular 2 + d3js + django rest framework
## Quick start
**Make sure you have Python version >= 3**, Node version >= 5.0 and NPM >= 3**
```bash
# clone our repo
# --depth 1 removes all but one .git commit history
git clone --depth 1 https://github.com/jaguilarsa/MusicJAS

# change directory to our repo
cd MusicJAS/
```

### django backend
```bash
# active yout virtualenv
# change directory to our api
cd api/

# install python requirements
pip install requirements.txt

# start the server
./manage runserver
```

### angular 2 client
```bash
# change directory to our client
cd ../client/

# install the repo with npm
npm install

# start the server
npm start

# or use Hot Module Replacement
npm run server:dev:hmr
```
go to [http://0.0.0.0:3000](http://0.0.0.0:3000) or [http://localhost:3000](http://localhost:3000) in your browser

### docker
## Description
### TL&DR
> Example of Full stack app with django and Angular 2

### Features
* Server side pagination, filtering and ordering
* Angular 2 responsive chart component with d3js v4
* Angular 2 responsive pagination list component
* Google Material Design

