# ConClock

API and distribution server for ConClock clients.

Implements HTTP file server at http://host:9000/ of content in /client folder.

Implements REST API with core resources of:
* /api/time - Time syncronisation

# Standalone Installation

* Install NodeJS
* Install ConClock
  * Unzip conclock.zip into new folder
  * `npm install`
* Run conclock
  * `npm run start`
* Access conclock
  * Browse to http://host:9000/
