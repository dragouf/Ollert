module OllertApi {
    // Card
    export function updateCard(card: Card, done?: () => any) {
        var carteServeur = Converter.toServerCard(card, -1);

        var ajaxSettings = {
            url: '/api/Carte/' + card.id,
            type: 'PUT',
            dataType: 'json',
            data: carteServeur
        };

        $.ajax(ajaxSettings)
            .done(done)
            .fail(Global.ShowConnectionError);
    }
    export function addCard(card: Card, listId: number, done: (cardId: number) => any) {
        // sauvegarde la nouvelle carte
        var carteServeur = Converter.toServerCard(card, listId);

        $.ajax({
            url: '/api/Carte',
            type: 'POST',
            dataType: 'json',
            data: carteServeur
        })
            .done(function (serverData) {
                done(serverData.Id);
            })
            .fail(Global.ShowConnectionError);
    }
    export function deleteCard(cardId: number, done: () => any) {
        $.ajax({
            url: '/api/Carte/' + cardId,
            type: 'DELETE',
            dataType: 'json'
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }

    // Deplacement
    export function moveCard(cardId: number, sourceListId: number, targetListId: number) {
        var ServerMove = {
            CarteId: cardId,
            AncienTableauId: sourceListId,
            NouveauTableauId: targetListId
        };

        $.ajax({
            url: '/api/Tableau/' + cardId,
            type: 'PUT',
            dataType: 'json',
            data: ServerMove
        })
            .fail(Global.ShowConnectionError);
    }

    // List
    export function getLists(boardId: number, done: (serverLists: Array<Ollert.ServerList>) => any) {
        $.ajax({
            url: '/api/Tableau/' + boardId,
            type: 'GET',
            dataType: 'json'
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }
    export function addList(list: List, done: (listId: number) => any) {
        var ajaxSettings = {
            url: '/api/Tableau',
            type: 'POST',
            dataType: 'json',
            data: Converter.toServerList(list)
        }

        $.ajax(ajaxSettings)
            .done(function (serverData) {
                done(serverData.Id);
            })
            .fail(Global.ShowConnectionError);
    }
    export function deleteList(listId:number, done: () => any) {
        $.ajax({
            url: '/api/Tableau/' + listId,
            type: 'DELETE',
            dataType: 'json'
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }

    // File
    export function deleteFile(fileId: number) {
        $.ajax({
            url: '/api/Fichier/' + fileId,
            type: 'DELETE',
            dataType: 'json'
        })
        .fail(Global.ShowConnectionError);
    }

    // User
    export function getCurrentUser(done: (user: Ollert.ServerUser) => any) {
        $.ajax({
            url: '/Board/CurrentUser',
            type: 'GET',
            dataType: 'json'
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }
    export function updateUserLastSeen() {
        $.ajax({
            url: '/Board/UserLastSeen/',
            type: 'GET',
            dataType: 'json'
        })
            .fail(Global.ShowConnectionError);
    }
    export function getUsers(done: (users: Array<Ollert.ServerUser>) => any) {
        $.ajax({
            url: '/api/User',
            type: 'GET',
            dataType: 'json'
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }

    // Step
    export function updateStep(step: Step, cardId: number) {
        var etapeServeur = Converter.toServerStep(step, cardId);
        $.ajax({
            url: '/api/Etape/' + step.id,
            type: 'PUT',
            dataType: 'json',
            data: etapeServeur
        })
            .fail(Global.ShowConnectionError);
    }
    export function addStep(step: Step, cardId: number, done: (serverStep: Ollert.ServerStep) => any) {
        var etapeServeur = Converter.toServerStep(step, cardId);
        // Sauvegarde le message
        $.ajax({
            url: '/api/Etape',
            type: 'POST',
            dataType: 'json',
            data: etapeServeur
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }
    export function deleteStep(stepId: number, done: () => any) {
        $.ajax({
            url: '/api/Etape/' + stepId,
            type: 'DELETE',
            dataType: 'json'
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }

    // Message
    export function deleteMessage(messageId: number, done: () => any){
        $.ajax({
            url: '/api/Message/' + messageId,
            type: 'DELETE',
            dataType: 'json'
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }
    export function addMessage(message: Message, cardId: number, done: (serverMessage: Ollert.ServerMessage) => any) {
        var messageServeur = Converter.toServerMessage(message, cardId); 

        // Sauvegarde le message
        $.ajax({
            url: '/api/Message',
            type: 'POST',
            dataType: 'json',
            data: messageServeur
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }
    export function getMessages(done: (messages: Array<Ollert.ServerMessage>) => any) {
        $.ajax({
            url: '/api/Message',
            type: 'GET',
            dataType: 'json'
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }

    // Notification
    export function getNotifications(done: (notifications: Ollert.ServerNotification) => any) {
        $.ajax({
            url: '/api/Notification',
            type: 'GET',
            dataType: 'json'
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }

    // Board
    export function updateBoard(board: BoardDetails, done?: () => any) {
        var participantsServeur = new Array();
        $.each(board.participants(), function (index, participant) {
            participantsServeur.push({
                Participant: {
                    Id: participant.id,
                    UserName: participant.name
                }
            });
        });

        var salleServeur = {
            Id: board.id,
            Nom: board.name,
            ParticipantsSalle: participantsServeur
        };

        // Sauvegarde le message
        $.ajax({
            url: '/api/Salle/' + board.id,
            type: 'PUT',
            dataType: 'json',
            data: salleServeur
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }
    export function addBoard(board: BoardDetails, currentUser: User, done: (serverBoard: Ollert.ServerBoard) => any) {
        var salleServeur = Converter.toServerBoard(board, currentUser.id);

        // Sauvegarde le message
        $.ajax({
            url: '/api/Salle',
            type: 'POST',
            dataType: 'json',
            data: salleServeur
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }
    export function deleteBoard(boardId: number, done: () => any) {
        $.ajax({
            url: '/api/Salle/' + boardId,
            type: 'DELETE',
            dataType: 'json'
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }
    export function getBoards(done: (boards: Array<Ollert.ServerBoard>) => any) {
        $.ajax({
            url: '/api/Salle',
            type: 'GET',
            dataType: 'json'
        })
            .done(done)
            .fail(Global.ShowConnectionError);
    }
} 