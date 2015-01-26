var Board = (function () {
    function Board(data) {
        var _this = this;
        var self = this;

        this.id = data.id;
        this.currentUser = ko.observable(data.currentUser);
        this.lists = ko.observableArray(new Array());

        this.displayArchive = ko.observable(false);
        this.dialogNewList = ko.observable(Global.emptyList(self)); /*TODO: add parent*/
        this.dialogNewCard = ko.observable(Global.emptyCard(self.currentUser()));
        this.dialogCurrentCard = ko.observable(null);
        this.dialogCurrentList = ko.observable(null);

        this.displayArchive.subscribe(function () {
            if (self.displayArchive())
                $('body').addClass('archive');
            else
                $('body').removeClass('archive');
        });

        // Methods
        // Template helpers
        this.groupedListIndexes = function () {
            var indexes = new Array();
            for (var i = 0; i < self.lists().length; i = i + 6) {
                indexes.push(i);
            }

            return indexes;
        };

        // Lists
        this.modalAddTable = function () {
            $('#modal-ajout-table').modal('show');
        };
        this.addTable = function () {
            // Sauvegarde la liste
            OllertApi.addList(_this.dialogNewList(), function (listId) {
                // AJAX CALLBACK
                self.dialogNewList().id = listId;
                self.lists.push(self.dialogNewList());
                self.dialogNewList(Global.emptyList(self));
            });
            $('#modal-ajout-table').modal('hide');
        };
        this.deleteTable = function (data) {
            OllertApi.deleteList(data.id, function () {
                // AJAX CALLBACK
                var tableToDeleteIndex = -1;
                $.each(self.lists(), function (index, table) {
                    if (table.id == data.id)
                        tableToDeleteIndex = index;
                });

                if (tableToDeleteIndex >= 0)
                    self.lists.splice(tableToDeleteIndex, 1);
            });

            return false;
        };

        // Cards
        this.addCard = function () {
            if (self.dialogNewCard().description() == '') {
                self.dialogNewCard().description('<pas de description>');
            }

            OllertApi.addCard(self.dialogNewCard(), self.dialogCurrentList().id, function (cardId) {
                // Change la date de vue de l' utilisateur pour eviter les alertes
                self.currentUser().lastViewed(moment());

                // Met a jour l'id de la carte
                self.dialogNewCard().id = cardId;

                // Ajoute a la liste
                self.dialogCurrentList().allCards.push(self.dialogNewCard());

                // Rebind avec une nouvelle carte
                self.dialogNewCard(Global.emptyCard(self.currentUser()));
            });

            $('#modal-ajout').modal('hide');
        };
        this.openCardDetails = function (data) {
            _this.dialogCurrentList(data);
            $('#modal-ajout').modal('show');
        };
        this.editCard = function (data) {
            self.dialogCurrentCard(data);
            self.dialogCurrentCard().lastViewed(moment());

            // Change la date de vue de la carte
            OllertApi.updateCard(self.dialogCurrentCard());
            $('#modal-visualisation').modal('show');
            Global.initializeEtapes();
            var dropzoneObject = Global.initializeDropzone({
                cardId: data.id,
                fileRemoved: function (file) {
                    // server
                    OllertApi.deleteFile(file.id);

                    // model
                    var fileIndex = 0;
                    $.each(data.attachments(), function (index, f) {
                        if (f.id == file.id)
                            fileIndex = index;
                    });
                    data.attachments.splice(fileIndex, 1);
                },
                success: function (file, response) {
                    file.id = response.Id;
                    data.attachments.push(Converter.toModelAttachment(response));
                },
                sending: function (file, xhr, formData) {
                    formData.append('cardId', data.id);
                }
            });

            // Add files
            $.each(data.attachments(), function (index, f) {
                var mockFile = {
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
                window.open(url, "_blank");
            });
        };

        // drag and drop api
        this.movingCard = function (arg) {
            // sauvegarde le deplacement sur el serveur
            // retire de la source
            var indexOldCard = -1;
            var ancienTableau = null;
            var nouveauTableau = null;
            $.each(self.lists(), function (index, table) {
                if (table.id == arg.sourceParent.id) {
                    ancienTableau = table;
                    $.each(table.allCards(), function (index, card) {
                        if (card.id == arg.item.id)
                            indexOldCard = index;
                    });
                } else if (table.id == arg.targetParent.id) {
                    nouveauTableau = table;
                }
            });
            if (indexOldCard >= 0)
                ancienTableau.allCards().splice(indexOldCard, 1);

            // et ajoute a la target
            if (nouveauTableau != null) {
                nouveauTableau.allCards.push(arg.item);
            }

            OllertApi.moveCard(arg.item.id, arg.sourceParent.id, arg.targetParent.id);
        };

        // CHARGEMENT
        this.loadData = function (serverLists) {
            var initialTables = new Array();
            $.each(serverLists, function (index, tableau) {
                initialTables.push(Converter.toModelList(tableau, self.currentUser(), self));
            });
            self.lists(initialTables);
        };

        // SignalR
        // messages
        $.connection.ollertHub.client.newMessage = function (message) {
            $.each(self.lists(), function (indexTable, table) {
                $.each(table.cards(), function (indexCard, card) {
                    if (message.CarteId == card.id) {
                        var messageServeur = Converter.toModelMessage(message, card.lastViewed);
                        card.messages.push(messageServeur);
                    }
                });
            });
        };
        $.connection.ollertHub.client.deleteMessage = function (message) {
            var indexMessage = null;
            $.each(self.lists(), function (indexTable, table) {
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
            $.each(self.lists(), function (indexTable, table) {
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

            $.each(self.lists(), function (indexTable, table) {
                if (table.id == move.NouveauTableauId) {
                    table.allCards.push(carte);
                }
            });
        };

        // cartes
        $.connection.ollertHub.client.newCard = function (carte) {
            $.each(self.lists(), function (indexTable, table) {
                if (table.id == carte.TableauId) {
                    var newCard = Converter.toModelCard(carte, self.currentUser());
                    table.allCards.push(newCard);
                }
            });
        };
        $.connection.ollertHub.client.changeCard = function (carte) {
            $.each(self.lists(), function (indexTable, table) {
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
            $.each(self.lists(), function (indexTable, table) {
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
            $.each(self.lists(), function (indexTable, table) {
                $.each(table.cards(), function (indexCard, card) {
                    if (card.id == fichier.CarteId) {
                        card.files.push(Converter.toModelAttachment(fichier));
                    }
                });
            });
        };
        $.connection.ollertHub.client.deleteFile = function (fichier) {
            var indexFichier = null;
            $.each(self.lists(), function (indexTable, table) {
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
            $.each(self.lists(), function (indexTable, table) {
                $.each(table.cards(), function (indexCard, card) {
                    if (card.id == etape.CarteId) {
                        card.steps.push(Converter.toModelStep(etape));
                    }
                });
            });
        };
        $.connection.ollertHub.client.deleteStep = function (etape) {
            var indexEtape = null;
            $.each(self.lists(), function (indexTable, table) {
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
            $.each(self.lists(), function (indexTable, table) {
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
    }
    return Board;
})();
//# sourceMappingURL=Board.js.map
