var Ollert;
(function (Ollert) {
    ///////////////////////////// INITIALIZATION
    function initializeBoard() {
        OllertApi.getCurrentUser(function (user) {
            var currentUser = Converter.toModelUser(user);
            var salleId = $('#SalleId').val();

            OllertApi.getLists(salleId, function (serverLists) {
                // AJAX CALLBACK
                var vm = new Board({
                    id: salleId,
                    currentUser: currentUser
                });
                vm.loadData(serverLists);
                ko.bindingHandlers.sortable.afterMove = vm.movingCard;
                ko.applyBindings(vm, $('#salle-content').get(0));

                Ollert.InitializeLayout();
            });
        });
    }
    Ollert.initializeBoard = initializeBoard;

    function initializeListe() {
        OllertApi.getCurrentUser(function (userJson) {
            // AJAX CALLBACK
            var currentUser = Converter.toModelUser(userJson);

            OllertApi.getBoards(function (boardsJson) {
                // AJAX CALLBACK
                OllertApi.getUsers(function (usersJson) {
                    // AJAX CALLBACK
                    var listeSalles = new Array();
                    $.each(boardsJson, function (index, salle) {
                        var participantsIds = new Array();
                        var participants = new Array();
                        $.each(salle.Participants, function (index, userJson) {
                            participantsIds.push(userJson.Id);
                            participants.push(new User(userJson.Id, userJson.UserName, moment(userJson.LastViewed)));
                        });

                        var users = new Array();
                        $.each(usersJson, function (index, userJson) {
                            if (!inArray(userJson.Id, participantsIds))
                                users.push(new User(userJson.Id, userJson.UserName, moment(userJson.LastViewed)));
                        });

                        var proprietaire = new User(salle.Proprietaire.Id, salle.Proprietaire.UserName, moment(salle.Proprietaire.LastViewed));

                        listeSalles.push(new BoardDetails(salle.Id, salle.Nom, participants, proprietaire, users, salle.MessageNonLu, salle.FichierNonVu, salle.TempsRestant));
                    });

                    var users = new Array();
                    $.each(usersJson, function (index, userJson) {
                        users.push(new User(userJson.Id, userJson.UserName, moment(userJson.LastViewed)));
                    });

                    var vm = new BoardsList(listeSalles, currentUser, users);
                    ko.applyBindings(vm, $('#liste-content').get(0));

                    Ollert.InitializeLayout();
                });
            });
        });
    }
    Ollert.initializeListe = initializeListe;

    function InitializeLayout() {
        // Display right settings
        $('#ace-settings-btn').on('click', function () {
            $(this).toggleClass('open');
            $('#ace-settings-box').toggleClass('open');
        });

        // L'utilisateur
        OllertApi.getCurrentUser(function (userJson) {
            var currentUser = Converter.toModelUser(userJson);

            // Les notifications
            OllertApi.getNotifications(function (notifs) {
                var notifications = new Array();
                var messages = new Array();

                $.each(notifs, function (index, note) {
                    var newUser = new User(-1, 'noname', moment());
                    if (note.Createur != null)
                        newUser = Converter.toModelUser(note.Createur);
                    if (newUser.id != currentUser.id) {
                        notifications.push(Converter.toModelNotification(note, currentUser.lastViewed(), newUser));
                    }
                });

                // Les messages
                OllertApi.getMessages(function (jsonMessages) {
                    $.each(jsonMessages, function (index, msg) {
                        if (msg.Utilisateur.Id != currentUser.id) {
                            messages.push(Converter.toModelMessage(msg, ko.observable(moment(msg.DerniereVueCarte))));
                        }
                    });

                    var model = new Layout(notifications, messages, currentUser);
                    ko.applyBindings(model, $('#navbar').get(0));

                    // Start the connection
                    $.connection.hub.start().done(function () {
                        //$.cookie("signalr-conn-id", $.connection.hub.id);
                    });
                });
            });
        });
    }
    Ollert.InitializeLayout = InitializeLayout;

    function initiliazeMobileApp() {
        if (("standalone" in window.navigator) && window.navigator.standalone) {
            var noddy, remotes = false;
            document.addEventListener('click', function (event) {
                noddy = event.target;
                while (noddy.nodeName !== "A" && noddy.nodeName !== "HTML") {
                    noddy = noddy.parentNode;
                }
                if ('href' in noddy && noddy.href.indexOf('http') !== -1 && (noddy.href.indexOf(document.location.host) !== -1 || remotes)) {
                    event.preventDefault();
                    document.location.href = noddy.href;
                }
            }, false);
        }
    }
    Ollert.initiliazeMobileApp = initiliazeMobileApp;

    ///////////////////////////// MODELS
    var ServerBoard = (function () {
        function ServerBoard() {
        }
        return ServerBoard;
    })();
    Ollert.ServerBoard = ServerBoard;
    var ServerAttachment = (function () {
        function ServerAttachment() {
        }
        return ServerAttachment;
    })();
    Ollert.ServerAttachment = ServerAttachment;
    var ServerUser = (function () {
        function ServerUser() {
        }
        return ServerUser;
    })();
    Ollert.ServerUser = ServerUser;
    var ServerMessage = (function () {
        function ServerMessage() {
        }
        return ServerMessage;
    })();
    Ollert.ServerMessage = ServerMessage;

    var ServerCard = (function () {
        function ServerCard() {
        }
        return ServerCard;
    })();
    Ollert.ServerCard = ServerCard;
    var ServerMove = (function () {
        function ServerMove() {
        }
        return ServerMove;
    })();
    Ollert.ServerMove = ServerMove;
    var ServerStep = (function () {
        function ServerStep() {
        }
        return ServerStep;
    })();
    Ollert.ServerStep = ServerStep;
    var ServerList = (function () {
        function ServerList() {
        }
        return ServerList;
    })();
    Ollert.ServerList = ServerList;
    var ServerNotification = (function () {
        function ServerNotification() {
        }
        return ServerNotification;
    })();
    Ollert.ServerNotification = ServerNotification;

    // TOOLS
    function arrayCompare(a1, a2) {
        if (a1.length != a2.length)
            return false;
        var length = a2.length;
        for (var i = 0; i < length; i++) {
            if (a1[i] !== a2[i])
                return false;
        }
        return true;
    }
    function inArray(needle, haystack) {
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
            if (typeof haystack[i] == 'object') {
                if (arrayCompare(haystack[i], needle))
                    return true;
            } else {
                if (haystack[i] == needle)
                    return true;
            }
        }
        return false;
    }
})(Ollert || (Ollert = {}));
//# sourceMappingURL=Ollert.js.map
