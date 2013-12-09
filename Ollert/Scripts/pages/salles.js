// Models
var File = function (id, name, date, type, size) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.type = type;
    this.size = size;
};
var Card = function (id, demande, titre, description, user, isArchive, messages, currentUser, files, lastViewed, steps) {
    var self = this;
    self.id = id;
    self.demande = ko.observable(demande);
    self.titre = ko.observable(titre);
    self.description = ko.observable(description);    
    self.user = user;
    self.currentUser = currentUser;
    self.messages = ko.observableArray(messages);
    self.files = ko.observableArray(files);
    self.lastViewed = ko.observable(lastViewed);
    self.steps = ko.observableArray(steps);
    self.isArchive = ko.observable(isArchive);

    self.estimation = ko.computed(function () {
        var estimationTotale = 0;
        $.each(self.steps(), function (index, step) {
            if (step.estimation() > 0)
                estimationTotale += parseInt(step.estimation());
        });

        return estimationTotale /*> 0 ? estimationTotale : '<non éstimé>'*/;
    }, self);

    self.isOwner = function (data) {
        return data.user().id == currentUser.id;

        return false;
    };

    self.deleteMessage = function (data) {
        $.ajax({
            url: '/api/Message/' + data.id,
            type: 'DELETE',
            dataType: 'json',
            success: function (jsonData) {
                var msgToDeleteIndex = -1;
                $.each(self.messages(), function (index, msg) {
                    if (msg.id == data.id)
                        msgToDeleteIndex = index;
                });

                if (msgToDeleteIndex >= 0)
                    self.messages.splice(msgToDeleteIndex, 1);
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

    self.UnreadMessages = ko.computed(function () {
        var unread = new Array();
        $.each(self.messages(), function (index, msg) {
            if (msg.date() > self.lastViewed())
                unread.push(msg);
        });
        return unread;
    }, self);

    self.totalFiles = ko.computed(function () {
        return self.files().length;
    }, self);

    self.totalMessages = ko.computed(function () {
        return self.messages().length;
    }, self);

    self.totalUnreadMessages = ko.computed(function () {
        var nbNew = 0;
        $.each(self.messages(), function (index, msg) {
            if (msg.date() > self.lastViewed())
                nbNew++;
        });
        return nbNew;
    }, self);

    self.totalUnseenFiles = ko.computed(function () {
        var nbNew = 0;
        $.each(self.files(), function (index, file) {
            if (file.date > self.lastViewed())
                nbNew++;
        });
        return nbNew;
    }, self);

    self.hasUnseenFilesOrMsg = ko.computed(function () {
        return self.totalUnreadMessages() > 0 || self.totalUnseenFiles();
    }, self);

    self.totalUnseenFilesAndMsg = ko.computed(function () {
        return self.totalUnseenFiles() + self.totalUnreadMessages();
    }, self);

    this.toReadableTime = function () {
        var seconds = parseInt(this.estimation());
        var numyears = Math.floor(seconds / 31536000);
        var numdays = Math.floor((seconds % 31536000) / 86400);
        var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
        var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
        var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
        var output = (numyears > 0 ? numyears + " y " : '') + (numdays > 0 ? numdays + " d" : '') + (numhours > 0 ? numhours + " h" : '') + (numminutes > 0 ? numminutes + " m" : '') + (numseconds > 0 ? numseconds + " s" : '');
        return output.length == 0 ? '<non estimé>' : output;
    };

    this.hasTime = ko.computed(function () {
        return parseInt(this.estimation()) > 0;
    }, this);

    this.timeText = ko.computed(function () {
        return "Cette carte est éstimée a " + this.toReadableTime() + " de travail";
    }, this);

    this.messagesText = ko.computed(function () {
        return "Cette carte contient " + this.totalUnreadMessages().toString() + " messages";
    }, this);

    this.unseenFilesOrMsgText = ko.computed(function () {
        return "Cette carte contient " + this.totalUnreadMessages().toString() + " messages non lu et " + this.totalUnseenFiles() + " nouveaux fichiers";
    }, this);

    this.attachementsText = ko.computed(function () {
        return "Cette carte a " + this.totalFiles().toString() + " attachements";
    }, this);

    self.newMessage = ko.observable(new Message(1, "", self.currentUser, null, self.lastViewed));

    self.uploadFilePath = ko.computed(function () {
        return '/Api/Fichier/' + self.id;
    }, self);

    self.uploadId = function () {
        return 'dropzone-' + self.id;
    }

    self.addMessage = function (data) {
        var currentDate = moment();
        self.newMessage().date(currentDate);


        var messageServeur = {
            Texte: self.newMessage().text(),
            Carte: { Id: self.id }
        };

        // Sauvegarde le message
        $.ajax({
            url: '/api/Message',
            type: 'POST',
            dataType: 'json',
            data: messageServeur,
            success: function (jsonData) {
                // change la date de vue de la carte pour eviter la notification
                self.lastViewed(moment());
                // Change la date de vue de la carte
                var carteServeur = {
                    Id: self.id,
                    NumeroDemande: self.demande(),
                    Titre: self.titre(),
                    Description: self.description(),
                    LastTimeViewed: moment().format()
                };

                $.ajax({
                    url: '/api/Carte/' + self.id,
                    type: 'PUT',
                    dataType: 'json',
                    data: carteServeur,
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
                // Met a jour l'id du message
                self.newMessage().id = jsonData.Id;
                // Ajoute a la liste
                self.messages.push(self.newMessage());

                // Rebind avec un nouveeau message
                self.newMessage(new Message(1, "", self.currentUser, currentDate, self.lastViewed));

                //$('.dialogs,.comments').slimScroll({
                //    height: '300px'
                //});
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
        
    self.editEstimation = function () {
        $('#add-step-input').focus();
    };

    // inline edit titre
    self.editingTitre = ko.observable(false);
    self.previousTitre = '';
    self.editTitre = function () {
        self.previousTitre = self.titre();
        self.editingTitre(true);
    };
    self.saveTitre = function () {
        self.editingTitre(false);
        self.saveEditedCard();
    };
    self.cancelTitre = function () {
        self.titre(self.previousTitre);
        self.editingTitre(false);
    };
    self.clearTitre = function () {
        self.titre(null);
        $('#edit-titre').focus();
    };

    // inline edit description
    self.editingDescription = ko.observable(false);
    self.previousDescription = '';
    self.editDescription = function () {
        self.previousDescription = self.description();
        self.editingDescription(true);
    };
    self.saveDescription = function () {
        self.editingDescription(false);
        self.saveEditedCard();
    };
    self.cancelDescription = function () {
        self.description(self.previousDescription);
        self.editingDescription(false);
    };

    self.saveEditedCard = function () {
        // Sauvegarde le changement sur le serveur
        var carteServeur = {
            Id: self.id,
            NumeroDemande: self.demande(),
            Titre: self.titre(),
            Description: self.description(),
            LastTimeViewed: self.lastViewed().format()
        };
        $.ajax({
            url: '/api/Carte/' + self.id,
            type: 'PUT',
            dataType: 'json',
            data: carteServeur,
            success: function (jsonData) {
                // Envoi le changement au serveur signalr

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

    self.percentComplete = ko.computed(function () {       
        if (self.steps().length > 0)
        {
            var stepsDone = 0;
            var stepsTotal = self.estimation();

            $.each(self.steps(), function (index, step) {
                if(step.isDone())
                    stepsDone += step.estimation();
            });

            return stepsDone * 100 / stepsTotal;
        }            
        else
            return 0;
    }, self);

    self.newStep = ko.observable( new Step(-1, '', false, null) );
    self.addStep = function (data) {
        var etapeServeur = {
            Titre: self.newStep().title(),
            Estimation: self.newStep().estimation(),
            Carte: { Id: self.id }
        };

        // Sauvegarde le message
        $.ajax({
            url: '/api/Etape',
            type: 'POST',
            dataType: 'json',
            data: etapeServeur,
            success: function (jsonData) {
                // change la date de vue de la carte pour eviter la notification
                self.lastViewed(moment());
                // Change la date de vue de la carte
                var carteServeur = {
                    Id: self.id,
                    NumeroDemande: self.demande(),
                    Titre: self.titre(),
                    Description: self.description(),
                    LastTimeViewed: moment().format()
                };

                $.ajax({
                    url: '/api/Carte/' + self.id,
                    type: 'PUT',
                    dataType: 'json',
                    data: carteServeur,
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
                // Met a jour l'id de l'etape
                self.newStep().id = jsonData.Id;
                // Ajoute a la liste
                self.steps.push(self.newStep());

                // Rebind avec une nouvelle etape
                self.newStep(new Step(-1, '', false, null));

                // Reapplique le javascript
                initializeEtapes();
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
    self.deleteStep = function (data) {
        $.ajax({
            url: '/api/Etape/' + data.id,
            type: 'DELETE',
            dataType: 'json',
            success: function (jsonData) {
                var stepIndex = -1;
                $.each(self.steps(), function (index, step) {
                    if (step.id == data.id)
                        stepIndex = index;
                });

                if (stepIndex >= 0)
                    self.steps.splice(stepIndex, 1);
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

    self.archiveCard = function (data) {
        self.isArchive(!self.isArchive());
        var carteServeur = {
            Id: self.id,
            NumeroDemande: self.demande(),
            Titre: self.titre(),
            Description: self.description(),
            LastTimeViewed: self.lastViewed().format(),
            Archive: self.isArchive()
        };

        $.ajax({
            url: '/api/Carte/' + self.id,
            type: 'PUT',
            dataType: 'json',
            data: carteServeur,
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
    }
};
var Table = function (id, name, cards, parent) {
    var self = this;
    self.allCards = ko.observableArray(cards);
    self.name = name;
    self.id = id;
    self.allCards.id = id;    
    self.parent = ko.observable(parent);

    self.cards = ko.observableArray();
    self.cards.id = id;
    self.listCards = ko.computed(function () {
        var cartes = new Array();

        if (self.parent() != null) {
            $.each(self.allCards(), function (index, card) {
                if (self.parent().displayArchive() && card.isArchive())
                    cartes.push(card);
                else if(!self.parent().displayArchive() && !card.isArchive())
                    cartes.push(card);
            });
        }

        self.cards(cartes);
        //return cartes;
    }, self);    

    self.deleteCard = function (data, event) {
        event.stopImmediatePropagation();
        $.ajax({
            url: '/api/Carte/' + data.id,
            type: 'DELETE',
            dataType: 'json',
            success: function (jsonData) {
                var indexToRemove = -1;
                // Envoi du nouveau message au serveur signalr
                $.each(self.cards(), function (index, card) {
                    if (card.id == data.id)
                        indexToRemove = index;
                });

                if (indexToRemove >= 0)
                    self.allCards.splice(indexToRemove, 1);
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

    self.hasCards = ko.computed(function () {
        return self.cards().length > 0;
    }, self);

    self.totalTime = ko.computed(function () {
        var total = 0;
        $.each(self.cards(), function (index, el) {
            total += parseInt(el.estimation());
        });

        var seconds = total;
        var numyears = Math.floor(seconds / 31536000);
        var numdays = Math.floor((seconds % 31536000) / 86400);
        var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
        var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
        var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
        return (numyears > 0 ? numyears + " y " : '') + (numdays > 0 ? numdays + " d" : '') + (numhours > 0 ? numhours + " h" : '') + (numminutes > 0 ? numminutes + " m" : '') + (numseconds > 0 ? numseconds + " s" : '');
    }, self);
};
var Step = function (id, titre, isDone, estimation) {
    this.id = id;
    this.title = ko.observable(titre);
    this.estimation = ko.observable(estimation);
    this.isDone = ko.observable(isDone);

    this.listCss = ko.computed(function () {
        return this.isDone() ? 'item-green selected' : 'item-pink';
    }, this);

    this.toggleDone = function (data) {
        if (this.isDone())
            this.isDone(false);
        else
            this.isDone(true);

        this.editStep();
    };

    this.toggleInputDone = function (data) {
        this.editStep();
        return true;
    };

    this.editStep = function () {
        var etapeServeur = {
            Id: this.id,
            Titre: this.title(),
            Estimation: this.estimation(),
            Terminee: this.isDone(),
            Carte: { Id: this.id }
        };

        $.ajax({
            url: '/api/Etape/' + this.id,
            type: 'PUT',
            dataType: 'json',
            data: etapeServeur,
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

    this.toReadableTime = function () {
        var seconds = parseInt(this.estimation());
        var numyears = Math.floor(seconds / 31536000);
        var numdays = Math.floor((seconds % 31536000) / 86400);
        var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
        var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
        var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
        var output = (numyears > 0 ? numyears + " y " : '') + (numdays > 0 ? numdays + " d" : '') + (numhours > 0 ? numhours + " h" : '') + (numminutes > 0 ? numminutes + " m" : '') + (numseconds > 0 ? numseconds + " s" : '');
        return output.length == 0 ? '<non estimé>' : output;
    };
};

var BoardModel = function (currentUser) {
    var self = this;
    self.tables = ko.observableArray();
    self.currentUser = ko.observable(currentUser);

    self.displayArchive = ko.observable(false);
    self.displayArchive.subscribe(function () {
        if (self.displayArchive())
            $('body').addClass('archive');
        else
            $('body').removeClass('archive');
    });

    self.groupedTablesIndexs = function () {
        var indexes = new Array();
        for (var i = 0; i < self.tables().length; i = i + 6) {
            indexes.push(i);
        }

        return indexes;
    };

    self.dialogNewTable = ko.observable(new Table(-1, '', null, self));
    self.modalAddTable = function (data) {
        $('#modal-ajout-table').modal('show');
    };
    self.addTable = function () {
        var tableauServeur = {
            Id: self.dialogNewTable().id,
            Nom: self.dialogNewTable().name,
            Salle: { Id: $('#SalleId').val(), Proprietaire: { Id: -1 } }
        };

        // Sauvegarde le message
        $.ajax({
            url: '/api/Tableau',
            type: 'POST',
            dataType: 'json',
            data: tableauServeur,
            success: function (jsonData) {
                self.dialogNewTable().id = jsonData.Id;
                self.tables.push(self.dialogNewTable());
                self.dialogNewTable(new Table(-1, '', null, self));
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

        $('#modal-ajout-table').modal('hide');
    };

    self.dialogNewCard = ko.observable(new Card(0, null, null, "", self.currentUser(), false, null, self.currentUser(), null, moment()));
    self.dialogCurrentCard = ko.observable();
    self.dialogCurrentTable = ko.observable();
    self.addCard = function () {
        if (self.dialogNewCard().description() == '') {
            self.dialogNewCard().description('<pas de description>');
        }

        // sauvegarde la nouvelle carte
        var carteServeur = {
            NumeroDemande: self.dialogNewCard().demande(),
            Titre: self.dialogNewCard().titre(),
            Description: self.dialogNewCard().description(),
            LastTimeViewed: moment().format(),
            Tableau: { Id: self.dialogCurrentTable().id }
        };
        $.ajax({
            url: '/api/Carte',
            type: 'POST',
            dataType: 'json',
            data: carteServeur,
            success: function (jsonData) {
                // Change la date de vue de l' utilisateur pour eviter les alertes
                self.currentUser().lastViewed(moment());

                // Met a jour l'id de la carte
                var nouvelleCarte = self.dialogNewCard();
                nouvelleCarte.id = jsonData.Id;
                // Ajoute a la liste
                self.dialogCurrentTable().allCards.push(nouvelleCarte);

                // Rebind avec une nouvelle carte
                self.dialogNewCard(new Card(0, null, null, "", self.currentUser(), false, null, self.currentUser(), null, moment()));

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
    self.openCardDetails = function (data) {
        self.dialogCurrentTable(data);
        $('#modal-ajout').modal('show');
    };
    self.editCard = function (data) {
        self.dialogCurrentCard(data);
        // Change la date de vue de la carte
        var carteServeur = {
            Id: self.dialogCurrentCard().id,
            NumeroDemande: self.dialogCurrentCard().demande(),
            Titre: self.dialogCurrentCard().titre(),
            Description: self.dialogCurrentCard().description(),
            LastTimeViewed: moment().format()
        };

        $.ajax({
            url: '/api/Carte/' + self.dialogCurrentCard().id,
            type: 'PUT',
            dataType: 'json',
            data: carteServeur,
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

        self.dialogCurrentCard().lastViewed(moment());

        $('#modal-visualisation').modal('show');
        //$('.dialogs,.comments').slimScroll({
        //    height: '300px'
        //});

        initializeEtapes();
            
        var dropzoneObject = new Dropzone("#dropzone-" + data.id, {
            paramName: 'file',
            method: 'POST',
            maxFilesize: 50, // MB
            addRemoveLinks: true,
            dictDefaultMessage: '<span class="bolder"><i class="icon-caret-right red"></i> Drop files</span> to upload  <span class="smaller-80 grey">(or click)</span> <br />  <i class="upload-icon icon-cloud-upload blue icon-3x"></i>',
            dictResponseError: 'Erreur d\'upload!',
            dictRemoveFile: 'supprimer',
            dictCancelUpload: 'annuler',
            init: function () {
                this.on("removedfile", function (file) {
                    $.ajax({
                        url: '/api/Fichier/' + file.id,
                        type: 'DELETE',
                        dataType: 'json',
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
                    var fileIndex = 0;
                    $.each(data.files(), function (index, f) {
                        if (f.id == file.id)
                            fileIndex = index;
                    });
                    data.files.splice(fileIndex, 1);
                });

                this.on("success", function (file, response) {
                    file.id = response.id;
                    data.files.push(new File(response.Id, response.Nom, moment(response.DateEnvoi), response.Type, response.FileSize));
                });

                this.on("sending", function (file, xhr, formData) {
                    formData.append('cardId', data.id);
                });
            },
            //change the previewTemplate to use Bootstrap progress bars
            previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n<div class=\"dz-details\">\n<div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"progress progress-small progress-striped active\"><div class=\"progress-bar progress-bar-success\" data-dz-uploadprogress></div></div>\n  <div class=\"dz-success-mark\"><span></span></div>\n  <div class=\"dz-error-mark\"><span></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
        });

        // Add files
        $.each(data.files(), function (index, f) {
            mockFile = {
                id: f.id,
                name: f.name,
                size: f.size
            };

            // Call the default addedfile event handler
            dropzoneObject.emit("addedfile", mockFile);

            // And optionally show the thumbnail of the file:
            dropzoneObject.emit("thumbnail", mockFile, "/Board/DownloadFile/" + f.id);
        });

        $('.dz-details').click(function () {
            var alt = $(this).find('img').attr('alt');
            $(this).find('img').attr('title', alt);
            var url = $(this).find('img').attr('src') + '?download=true';
            window.open(url, "_blank")
        });
    };
    // drag and drop api
    self.movingCard = function (arg) {
        // sauvegarde le deplacement sur el serveur
        // retire de la source 
        var indexOldCard = -1;
        var ancienTableau = null;
        var nouveauTableau = null;
        $.each(self.tables(), function (index, table) {
            if (table.id == arg.sourceParent.id) {
                ancienTableau = table;
                $.each(table.allCards(), function (index, card) {
                    if (card.id == arg.item.id)
                        indexOldCard = index;
                });
                
            }
            else if (table.id == arg.targetParent.id)
            {
                nouveauTableau = table;
            }
        });
        if (indexOldCard >= 0)
            ancienTableau.allCards().splice(indexOldCard, 1);

        // et ajoute a la target
        if (nouveauTableau != null) {
            nouveauTableau.allCards.push(arg.item);
        }
    
        var deplacementServeur = {
            CarteId: arg.item.id,
            AncienTableauId: arg.sourceParent.id,
            NouveauTableauId: arg.targetParent.id
        };
        $.ajax({
            url: '/api/Tableau/' + arg.item.id,
            type: 'PUT',
            dataType: 'json',
            data: deplacementServeur,
            success: function (jsonData) {
                // Envoi le deplacement au serveur signalr   

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

    // SignalR
    // messages
    $.connection.ollertHub.client.newMessage = function (message) {
        $.each(self.tables(), function (indexTable, table) {
            $.each(table.cards(), function (indexCard, card) {
                if (message.CarteId == card.id) {
                    var messageServeur = new Message(message.Id, message.Texte, new User(message.Utilisateur.Id, message.Utilisateur.UserName), moment(message.CreateOn), card.lastViewed);
                    card.messages.push(messageServeur);
                }
            });
        });       
    };
    $.connection.ollertHub.client.deleteMessage = function (message) {
        var indexMessage = null;
        $.each(self.tables(), function (indexTable, table) {
            $.each(table.cards(), function (indexCard, card) {
                if (card.id == message.CarteId) {
                    $.each(card.messages(), function (indexMsg, msg) {
                        if (msg.id == message.Id)
                            indexMessage = indexMsg;
                    });

                    if (indexMessage != null)
                        card.messages.splice(indexMessage, 1);
                }
            });
        });
    };
    // deplacements
    $.connection.ollertHub.client.newMove = function (move) {
        var carte = null;
        var carteIndex = null;
        $.each(self.tables(), function (indexTable, table) {
            if (table.id == move.AncienTableauId) {
                $.each(table.cards(), function (indexCard, card) {
                    if (card.id == move.CarteId) {
                        carte = card;
                        carteIndex = indexCard;
                    }
                });

                // Retire la carte de son ancien emplacement
                table.allCards.splice(carteIndex, 1);
            }

        });

        $.each(self.tables(), function (indexTable, table) {
            if (table.id == move.NouveauTableauId) {
                table.allCards.push(carte);
            }
        });
    };
    // cartes
    $.connection.ollertHub.client.newCard = function (carte) {
        $.each(self.tables(), function (indexTable, table) {
            if (table.id == carte.TableauId) {
                var newCard = new Card(carte.Id, carte.NumeroDemande, carte.Titre, carte.Description, null, carte.Archive, null, self.currentUser(), null, moment(carte.LastTimeViewed), null);
                table.allCards.push(newCard);
            }
        });
    };
    $.connection.ollertHub.client.changeCard = function (carte) {
        $.each(self.tables(), function (indexTable, table) {
            if (carte.TableauId == table.id) {
                $.each(table.allCards(), function (indexCard, card) {
                    if (card.id == carte.Id) {
                        card.demande(carte.NumeroDemande);
                        card.titre(carte.Titre);
                        card.isArchive(carte.Archive);
                        card.description(carte.Description);
                    }
                });
            }
        });
    };
    $.connection.ollertHub.client.deleteCard = function (carte) {
        var indexCarte = null;
        var tableLocal = null;
        $.each(self.tables(), function (indexTable, table) {
            $.each(table.cards(), function (indexCard, card) {
                if (card.id == carte.Id) {
                    indexCarte = indexCard;
                    tableLocal = table;
                }
            });
        });

        if (indexCarte != null)
            tableLocal.allCards.splice(indexCarte, 1);
    };
    // fichiers
    $.connection.ollertHub.client.addFile = function (fichier) {
        $.each(self.tables(), function (indexTable, table) {
            $.each(table.cards(), function (indexCard, card) {
                if (card.id == fichier.CarteId) {
                    card.files.push(new File(fichier.Id, fichier.Nom, moment(fichier.DateEnvoi), fichier.Type, fichier.FileSize));
                }
            });
        });
    };
    $.connection.ollertHub.client.deleteFile = function (fichier) {
        var indexFichier = null;
        $.each(self.tables(), function (indexTable, table) {
            $.each(table.cards(), function (indexCard, card) {
                if (card.id == fichier.CarteId) {
                    $.each(card.files(), function (indexFile, file) {
                        if (file.id == fichier.Id)
                            indexFichier = indexFile;
                    });

                    if (indexFichier != null)
                        card.files.splice(indexFichier, 1);
                }
            });
        });
    };
    // etapes
    $.connection.ollertHub.client.addStep = function (etape) {
        $.each(self.tables(), function (indexTable, table) {
            $.each(table.cards(), function (indexCard, card) {
                if (card.id == etape.CarteId) {
                    card.steps.push(new Step(etape.Id, etape.Titre, etape.Terminee, etape.Estimation));
                }
            });
        });
    };
    $.connection.ollertHub.client.deleteStep = function (etape) {
        var indexEtape = null;
        $.each(self.tables(), function (indexTable, table) {
            $.each(table.cards(), function (indexCard, card) {
                if (card.id == etape.CarteId) {
                    $.each(card.steps(), function (indexStep, step) {
                        if (step.id == etape.Id)
                            indexEtape = indexStep;
                    });

                    if (indexEtape != null)
                        card.steps.splice(indexEtape, 1);
                }
            });
        });
    }; 
    $.connection.ollertHub.client.changeStep = function (etape) {
        $.each(self.tables(), function (indexTable, table) {
            $.each(table.cards(), function (indexCard, card) {
                if (card.id == etape.CarteId) {
                    $.each(card.steps(), function (indexStep, step) {
                        if (step.id == etape.Id) {
                            step.title(etape.Titre);
                            step.estimation(etape.Estimation);
                            step.isDone(etape.Terminee);
                        }
                    });
                }
            });
        });
    };

    // CHARGEMENT
    self.loadData = function (jsonData) {
        var initialTables = new Array();
        $.each(jsonData, function (index, tableau) {
            var cartes = new Array();
            $.each(tableau.Cartes, function (index, carte) {
                var messages = new Array();
                $.each(carte.Messages, function (index, message) {
                    var newMessage = new Message(message.Id, message.Texte, new User(message.Utilisateur.Id, message.Utilisateur.UserName), moment(message.CreateOn), ko.observable(moment(carte.LastTimeViewed)));
                    messages.push(newMessage);
                });

                var fichiers = new Array();
                $.each(carte.Fichiers, function (index, fichier) {
                    fichiers.push(new File(fichier.Id, fichier.Nom, moment(fichier.DateEnvoi), fichier.Type, fichier.FileSize));
                });

                var steps = new Array();
                $.each(carte.Etapes, function (index, etape) {
                    steps.push(new Step(etape.Id, etape.Titre, etape.Terminee, etape.Estimation));
                });

                var newCard = new Card(carte.Id, carte.NumeroDemande, carte.Titre, carte.Description, null, carte.Archive, messages, currentUser, fichiers, moment(carte.LastTimeViewed), steps);
                cartes.push(newCard);
            });

            initialTables.push(new Table(
                tableau.Id,
                tableau.Nom,
                cartes,
                self
            ));

            self.tables(initialTables);
        });
    };
};

///////////////////////////// INITIALIZATION
function initializeSalle(globalFunctions) {
    $.get('/Board/CurrentUser', function (userJson) {
        var currentUser = new User(userJson.Id, userJson.UserName, moment(userJson.LastViewed));
        var salleId = $('#SalleId').val();

        $.ajax({
            url: '/api/Tableau/' + salleId,
            type: 'GET',
            dataType: 'json',
            success: function (jsonData) {
                var vm = new BoardModel(currentUser);
                vm.loadData(jsonData);
                ko.bindingHandlers.sortable.afterMove = vm.movingCard;
                ko.applyBindings(vm, $('#salle-content').get(0));

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

    });
}

function initializeEtapes() {
    //Android's default browser somehow is confused when tapping on label which will lead to dragging the task
    //so disable dragging when clicking on label
    var agent = navigator.userAgent.toLowerCase();
    if ("ontouchstart" in document && /applewebkit/.test(agent) && /android/.test(agent))
        $('.ui-sortable').on('touchstart', function (e) {
            var li = $(e.target).closest('.ui-sortable li');
            if (li.length == 0) return;
            var label = li.find('label.inline').get(0);
            if (label == e.target || $.contains(label, e.target)) e.stopImmediatePropagation();
        });

    //$('.ui-sortable').sortable({
    //    opacity: 0.8,
    //    revert: true,
    //    forceHelperSize: true,
    //    placeholder: 'draggable-placeholder',
    //    forcePlaceholderSize: true,
    //    tolerance: 'pointer',
    //    stop: function (event, ui) {//just for Chrome!!!! so that dropdowns on items don't appear below other items after being moved
    //        $(ui.item).css('z-index', 'auto');
    //    }
    //}
    //);

    //$('.ui-sortable').disableSelection();
}