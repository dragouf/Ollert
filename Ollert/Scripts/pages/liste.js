var Salle = function (id, nom, participants, proprietaire, users) {
    var self = this;
    self.id = id;
    self.name = nom;
    self.users = ko.observableArray(users);
    self.proprietaire = ko.observable(proprietaire);
    self.participants = ko.observableArray(participants);
    self.isShow = ko.observable(false);

    self.showUsers = function () {
        self.isShow(!self.isShow());
    };
    self.salleUrl = ko.computed(function () {
        return "/Board/Salle/" + self.id;
    }, self);
    self.addParticipant = function (data) {
        // Ajoute aux participants
        self.participants.push(data);

        // Retire au dispoibles
        var indexUser = -1;
        $.each(self.users(), function (index, user) {
            if (user.id == data.id)
                indexUser = index;
        });
        if (indexUser >= 0)
            self.users.splice(indexUser, 1);

        self.isShow(false);

        // Ajoute au serveur
        var participantsServeur = new Array();
        $.each(self.participants(), function (index, participant) {
            participantsServeur.push({
                    Participant: {
                        Id: participant.id,
                        UserName: participant.name
                    }
                });
        });
        var salleServeur = {
            Id: self.id,
            Nom: self.name,
            ParticipantsSalle: participantsServeur
        };

        // Sauvegarde le message
        $.ajax({
            url: '/api/Salle/' + self.id,
            type: 'PUT',
            dataType: 'json',
            data: salleServeur,
            success: function (jsonData) {
            },
            statusCode: {
                400: function () {
                    ShowConnectionError();
                },
                404: function () {
                    ShowConnectionError();
                },
                500: function () {
                    ShowConnectionError();
                }
            }
        });
    };
    self.removeParticipant = function (data) {
        // Retire aux participants
        var indexParticipant = -1;
        $.each(self.participants(), function (index, participant) {
            if (participant.id == data.id)
                indexParticipant = index;
        });
        if (indexParticipant >= 0)
            self.participants.splice(indexParticipant, 1);

        // Ajoute aux disponibles
        self.users.push(data);

        // Ajoute au serveur
        var participantsServeur = new Array();
        $.each(self.participants(), function (index, participant) {
            participantsServeur.push({
                Participant: {
                    Id: participant.id,
                    UserName: participant.name
                }
            });
        });
        var salleServeur = {
            Id: self.id,
            Nom: self.name,
            ParticipantsSalle: participantsServeur
        };

        // Sauvegarde le message
        $.ajax({
            url: '/api/Salle/' + self.id,
            type: 'PUT',
            dataType: 'json',
            data: salleServeur,
            success: function (jsonData) {
            },
            statusCode: {
                400: function () {
                    ShowConnectionError();
                },
                404: function () {
                    ShowConnectionError();
                },
                500: function () {
                    ShowConnectionError();
                }
            }
        });

        return false;
    };
}

var ListeModel = function (salles, currentUser, users) {
    var self = this;
    self.salles = ko.observableArray(salles);
    self.currentUser = currentUser;
    self.users = users;

    self.dialogNewSalle = ko.observable(new Salle(-1, '', null, self.currentUser, self.users));
    self.modalAddSalle = function () {
        $('#modal-ajout').modal('show');
    };
    self.addSalle = function () {
        var salleServeur = {
            Id: self.dialogNewSalle().id,
            Nom: self.dialogNewSalle().name,
            Proprietaire: { Id: self.currentUser.id }
        };

        // Sauvegarde le message
        $.ajax({
            url: '/api/Salle',
            type: 'POST',
            dataType: 'json',
            data: salleServeur,
            success: function (jsonData) {
                self.dialogNewSalle().id = jsonData.Id;
                self.salles.push(self.dialogNewSalle());
                self.dialogNewSalle(new Salle(-1, '', null, self.currentUser, self.users));
            },
            statusCode: {
                400: function () {
                    ShowConnectionError();
                },
                404: function () {
                    ShowConnectionError();
                },
                500: function () {
                    ShowConnectionError();
                }
            }
        });

        $('#modal-ajout').modal('hide');
    };
    self.deleteSalle = function (data) {        
        $.ajax({
            url: '/api/Salle/' + data.id,
            type: 'DELETE',
            dataType: 'json',
            success: function (jsonData) {
                var indexSalle = -1;
                $.each(self.salles(), function (index, salle) {
                    if (salle.id == data.id)
                        indexSalle = index;
                });
                if (indexSalle >= 0)
                    self.salles.splice(indexSalle, 1);
            },
            statusCode: {
                400: function () {
                    ShowConnectionError();
                },
                404: function () {
                    ShowConnectionError();
                },
                500: function () {
                    ShowConnectionError();
                }
            }
        });

        return false;
    };
}

function initializeListe(globalFunctions) {
    $.get('/Board/CurrentUser', function (userJson) {
        var currentUser = new User(userJson.Id, userJson.UserName, moment(userJson.LastViewed));
        $.ajax({
            url: '/api/Salle',
            type: 'GET',
            dataType: 'json',
            success: function (salles) {
                $.ajax({
                    url: '/api/User',
                    type: 'GET',
                    dataType: 'json',
                    success: function (usersJson) {                        
                        var listeSalles = new Array();
                        $.each(salles, function (index, salle) {
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

                            listeSalles.push(new Salle(salle.Id, salle.Nom, participants, proprietaire, users));
                        });

                        var users = new Array();
                        $.each(usersJson, function (index, userJson) {
                                users.push(new User(userJson.Id, userJson.UserName, moment(userJson.LastViewed)));
                        });

                        var vm = new ListeModel(listeSalles, currentUser, users);
                        ko.applyBindings(vm, $('#liste-content').get(0));

                        globalFunctions();

                    },
                    statusCode: {
                        400: function () {
                            ShowConnectionError();
                        },
                        404: function () {
                            ShowConnectionError();
                        },
                        500: function () {
                            ShowConnectionError();
                        }
                    }
                });
            },
            statusCode: {
                400: function () {
                    ShowConnectionError();
                },
                404: function () {
                    ShowConnectionError();
                },
                500: function () {
                    ShowConnectionError();
                }
            }
        });
    });
}