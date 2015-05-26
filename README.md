Ollert
==================

Trello like application with :

**Backend**
* C# 5.0 (using await/async paradigm)
* MVC 5 with Web API 2
* SignalR 2.0
* Entity Framework 6 (code first and migrations)

**FrontEnd**
* TypeScript 1.4
* SignalR 2.0 (HTML5 websocket)
* Knockout
* Chrome Notification

### Description
Create rooms and boards and then organize your tasks by pinning cards on appriopriate board.

Everything is replicated instantly on every connected user UI with websocket connections.

### Installation
* In visual studio package manager console restore package files then run :

>add-migration Init

>update-database

start the project.

Login with david and 123456

### Developement
- ./api folder contains most of the backend API code 
- ./Scripts/pages/Classes folder contains most of the javascript (typescript) frontend code
- ./Hubs folder contains backend websocket (SignalR) code
- ./Views folder contains html parts (Razor)
- ./Controllers contains contains basic response to url request but most of the UI is generate through javascript/REST API


### Screenshot

**Room view**
![GitHub Logo](/docs/Capture.PNG)

**Boards with pinned cards**
![GitHub Logo](/docs/Capture2.PNG)

**Card edition**
![GitHub Logo](/docs/Capture3.PNG)
