module Converter {
    // TO SERVER
    export function toServerBoard(board: BoardDetails, currentUserId: number) {
        return {
            Id: board.id,
            Nom: board.name,
            Proprietaire: { Id: currentUserId }
        }
    }
    export function toServerStep(step: Step, cardId: number) {
        return {
            Id: step.id,
            Titre: step.title(),
            Estimation: step.estimation(),
            Terminee: step.isDone(),
            Carte: { Id: cardId }
        };
    }
    export function toServerList(list: List) {
        return {
            Id: list.id,
            Nom: list.name,
            Salle: {
                Id: list.boardId,
                Proprietaire: { Id: -1 }
            }
        };
    }
    export function toServerCard(card: Card, listId: number) {
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
    export function toServerMessage(message: Message, cardId: number) {
        return {
            Texte: message.text(),
            Carte: { Id: cardId }
        };
    }

    // TO LOCAL
    export function toModelAttachment(serverData: Ollert.ServerAttachment) {
        return new Attachment(
            serverData.Id,
            serverData.Nom,
            moment(serverData.DateEnvoi),
            serverData.Type,
            serverData.FileSize)
    }
    export function toModelUser(serverData: Ollert.ServerUser) {
        return new User(
            serverData.Id,
            serverData.UserName,
            moment(serverData.LastViewed),
            serverData.EmailMd5,
            serverData.UseGravatar,
            serverData.Email);
    }
    export function toModelStep(serverData: Ollert.ServerStep) {
        return new Step(
            serverData.Id,
            serverData.Titre,
            serverData.Estimation,
            serverData.Terminee);
    }
    export function toModelMessage(serverData: Ollert.ServerMessage, cardViewed?: KnockoutObservable<Moment>) {
        return new Message(
            serverData.Id,
            serverData.Texte,
            Converter.toModelUser(serverData.Utilisateur),
            moment(serverData.CreateOn),
            cardViewed);
    }
    export function toModelList(serverData: Ollert.ServerList, currentUser?: User, boardInstance?: Board) {
        var cartes = new Array<Card>();
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
   
    export function toModelNotification(serverData: Ollert.ServerNotification, lastUserViewed: Moment, creator: User) {
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
    export function toModelCard(serverData: Ollert.ServerCard, currentUser: User) {
        var steps = new Array<Step>();
        if (serverData.Etapes != null)
        {
            $.each(serverData.Etapes, function (index, etape) {
                steps.push(Converter.toModelStep(etape));
            });
        }

        var messages = new Array<Message>();
        if (serverData.Messages != null) {
            $.each(serverData.Messages, function (index, message) {                    
                messages.push(Converter.toModelMessage(message, ko.observable(moment(serverData.LastTimeViewed))));
            });
        }

        if (serverData.Fichiers != null) {
            var files = new Array<Attachment>();
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
}