var Converter;
(function (Converter) {
    // TO SERVER
    function toServerBoard(board, currentUserId) {
        return {
            Id: board.id,
            Nom: board.name,
            Proprietaire: { Id: currentUserId }
        };
    }
    Converter.toServerBoard = toServerBoard;
    function toServerStep(step, cardId) {
        return {
            Id: step.id,
            Titre: step.title(),
            Estimation: step.estimation(),
            Terminee: step.isDone(),
            Carte: { Id: cardId }
        };
    }
    Converter.toServerStep = toServerStep;
    function toServerList(list) {
        return {
            Id: list.id,
            Nom: list.name,
            Salle: {
                Id: list.boardId,
                Proprietaire: { Id: -1 }
            }
        };
    }
    Converter.toServerList = toServerList;
    function toServerCard(card, listId) {
        return {
            Id: card.id,
            NumeroDemande: card.demande(),
            Titre: card.titre(),
            Description: card.description(),
            LastTimeViewed: moment().format(),
            Archive: card.isArchive,
            Tableau: { Id: listId }
        };
    }
    Converter.toServerCard = toServerCard;
    function toServerMessage(message, cardId) {
        return {
            Texte: message.text(),
            Carte: { Id: cardId }
        };
    }
    Converter.toServerMessage = toServerMessage;
    // TO LOCAL
    function toModelAttachment(serverData) {
        return new Attachment(serverData.Id, serverData.Nom, moment(serverData.DateEnvoi), serverData.Type, serverData.FileSize);
    }
    Converter.toModelAttachment = toModelAttachment;
    function toModelUser(serverData) {
        return new User(serverData.Id, serverData.UserName, moment(serverData.LastViewed), serverData.EmailMd5, serverData.UseGravatar, serverData.Email);
    }
    Converter.toModelUser = toModelUser;
    function toModelStep(serverData) {
        return new Step(serverData.Id, serverData.Titre, serverData.Estimation, serverData.Terminee);
    }
    Converter.toModelStep = toModelStep;
    function toModelMessage(serverData, cardViewed) {
        return new Message(serverData.Id, serverData.Texte, Converter.toModelUser(serverData.Utilisateur), moment(serverData.CreateOn), cardViewed);
    }
    Converter.toModelMessage = toModelMessage;
    function toModelList(serverData, currentUser, boardInstance) {
        var cartes = new Array();
        if (serverData.Cartes != null) {
            $.each(serverData.Cartes, function (index, carte) {
                cartes.push(Converter.toModelCard(carte, currentUser));
            });
        }
        return new List({
            id: serverData.Id,
            name: serverData.Nom,
            boardId: serverData.SalleId,
            cards: cartes,
            parent: boardInstance
        });
    }
    Converter.toModelList = toModelList;
    function toModelNotification(serverData, lastUserViewed, creator) {
        return new Notification({
            id: serverData.Id,
            type: serverData.Type,
            title: serverData.Titre,
            text: serverData.Texte,
            date: moment(serverData.Date),
            lastUserViewed: lastUserViewed,
            creator: creator
        });
    }
    Converter.toModelNotification = toModelNotification;
    function toModelCard(serverData, currentUser) {
        var steps = new Array();
        if (serverData.Etapes != null) {
            $.each(serverData.Etapes, function (index, etape) {
                steps.push(Converter.toModelStep(etape));
            });
        }
        var messages = new Array();
        if (serverData.Messages != null) {
            $.each(serverData.Messages, function (index, message) {
                messages.push(Converter.toModelMessage(message, ko.observable(moment(serverData.LastTimeViewed))));
            });
        }
        if (serverData.Fichiers != null) {
            var files = new Array();
            $.each(serverData.Fichiers, function (index, fichier) {
                files.push(Converter.toModelAttachment(fichier));
            });
        }
        return new Card({
            id: serverData.Id,
            demande: serverData.NumeroDemande,
            titre: serverData.Titre,
            description: serverData.Description,
            isArchive: serverData.Archive,
            currentUser: currentUser,
            lastViewed: moment(serverData.LastTimeViewed),
            user: null,
            messages: messages,
            attachments: files,
            steps: steps
        });
    }
    Converter.toModelCard = toModelCard;
})(Converter || (Converter = {}));
//# sourceMappingURL=Converter.js.map