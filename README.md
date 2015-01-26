Ollert
==================

Trello like application with :

**Backend**
* C# 5.0 (using await/async paradigm)
* MVC 5
* SignalR 2.0
* Entity Framework 6 (code first and migrations)

**FrontEnd**
* TypeScript
* SignalR 2.0 (HTML5 websocket)
* Knockout
* Chrome Notification

*** Description
Create rooms and boards and then organize your tasks by pinning cards on appriopriate board.

Everything is replicated instantly on every connected user with websocket connections.

*** Installation
* In visual studio package manager console restore package files then run :

add-migration Init
update*database

start the project.
Login with david and 123456

*** Screenshot

**Room view**
![GitHub Logo](/docs/Capture.PNG)

**Boards with pinned cards**
![GitHub Logo](/docs/Capture2.PNG)

**card edition**
![GitHub Logo](/docs/Capture3.PNG)
