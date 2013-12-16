module Ollert { 
    ///////////////////////////// INITIALIZATION
    export function initializeBoard() {
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

    export function initializeListe() {
        OllertApi.getCurrentUser(function (userJson) {
            // AJAX CALLBACK
            var currentUser = Converter.toModelUser(userJson);

            OllertApi.getBoards(function (boardsJson) {
                // AJAX CALLBACK
                OllertApi.getUsers(function (usersJson) {
                    // AJAX CALLBACK
                    var listeSalles = new Array<BoardDetails>();
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

    export function InitializeLayout() {
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

    export function initiliazeMobileApp() {
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

    ///////////////////////////// MODELS
    export class ServerBoard {
        Id: number;
        Nom: string;
        Proprietaire: ServerUser;
        Participants: Array<ServerUser>;
        MessageNonLu: number;
        TempsRestant: number;
        FichierNonVu: number;
    }
    export class ServerAttachment {
        Id: number;
        Nom: string;
        DateEnvoi: string;
        Type: string;
        FileSize: number;
        CarteId: number;
    }
    export class ServerUser {
        Id: number;
        UserName: string;
        LastViewed: string;
    }
    export class ServerMessage {
        Id: number;
        Texte: string;
        Utilisateur: ServerUser;
        CreateOn: string;
        CarteId: number;
        DerniereVueCarte: string;
    }

    export class ServerCard {
        Id: number;
        NumeroDemande: number;
        Titre: string;
        Description: string;
        Archive: boolean;
        LastTimeViewed: string;
        TableauId: number;
        Etapes: Array<ServerStep>;
        Messages: Array<ServerStep>;
        Fichiers: Array<ServerStep>;
    }
    export class ServerMove {
        CarteId: number;
        AncienTableauId: number;
        NouveauTableauId: number;
    }
    export class ServerStep {
        Id: number;
        Titre: string;
        Terminee: boolean;
        Estimation: number;
        CarteId: number;
    }
    export class ServerList {
        Id: number;
        Nom: string;
        Position: number;
        Cartes: Array<ServerCard>;
        SalleId: number;
    }
    export class ServerNotification {
        Id: number;
        Type: string;
        Titre: string;
        Texte: string;
        Date: string;
        Createur: ServerUser;
    }

    // TOOLS
    function arrayCompare(a1, a2) {
        if (a1.length != a2.length) return false;
        var length = a2.length;
        for (var i = 0; i < length; i++) {
            if (a1[i] !== a2[i]) return false;
        }
        return true;
    }
    function inArray(needle, haystack) {
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
            if (typeof haystack[i] == 'object') {
                if (arrayCompare(haystack[i], needle)) return true;
            } else {
                if (haystack[i] == needle) return true;
            }
        }
        return false;
    }
}