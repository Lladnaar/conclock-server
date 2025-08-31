# ConClock Server

API and distribution server for [ConClock Clients](https://github.com/Lladnaar/conclock-client).

Implements HTTP file server at http://host:9000/ of content in /app folder.

Implements REST API with core resources of:
* /api/time - Time syncronisation

# Standalone Installation

* Install NodeJS
* Install ConClock Server
  * Create conclock folder
  * `node init`
  * Unzip conclock-server into conclock folder
  * `npm install`
* Install ConClock Clients
  * Unzip conclock-client into conclock/app folder
* Run conclock
  * 'npm run'
* Access conclock
  * Browse to http://host:9000/
