var OllertApi;
(function (OllertApi) {
    // Card
    function updateCard(card, done) {
        var carteServeur = Converter.toServerCard(card, -1);

        var ajaxSettings = {
            url: '/api/Carte/' + card.id,
            type: 'PUT',
            dataType: 'json',
            data: carteServeur
        };

        $.ajax(ajaxSettings).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.updateCard = updateCard;
    function addCard(card, listId, done) {
        // sauvegarde la nouvelle carte
        var carteServeur = Converter.toServerCard(card, listId);

        $.ajax({
            url: '/api/Carte',
            type: 'POST',
            dataType: 'json',
            data: carteServeur
        }).done(function (serverData) {
            done(serverData.Id);
        }).fail(Global.ShowConnectionError);
    }
    OllertApi.addCard = addCard;
    function deleteCard(cardId, done) {
        $.ajax({
            url: '/api/Carte/' + cardId,
            type: 'DELETE',
            dataType: 'json'
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.deleteCard = deleteCard;

    // Deplacement
    function moveCard(cardId, sourceListId, targetListId) {
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
        }).fail(Global.ShowConnectionError);
    }
    OllertApi.moveCard = moveCard;

    // List
    function getLists(boardId, done) {
        $.ajax({
            url: '/api/Tableau/' + boardId,
            type: 'GET',
            dataType: 'json'
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.getLists = getLists;
    function addList(list, done) {
        var ajaxSettings = {
            url: '/api/Tableau',
            type: 'POST',
            dataType: 'json',
            data: Converter.toServerList(list)
        };

        $.ajax(ajaxSettings).done(function (serverData) {
            done(serverData.Id);
        }).fail(Global.ShowConnectionError);
    }
    OllertApi.addList = addList;
    function deleteList(listId, done) {
        $.ajax({
            url: '/api/Tableau/' + listId,
            type: 'DELETE',
            dataType: 'json'
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.deleteList = deleteList;

    // File
    function deleteFile(fileId) {
        $.ajax({
            url: '/api/Fichier/' + fileId,
            type: 'DELETE',
            dataType: 'json'
        }).fail(Global.ShowConnectionError);
    }
    OllertApi.deleteFile = deleteFile;

    // User
    function getCurrentUser(done) {
        $.ajax({
            url: '/Board/CurrentUser',
            type: 'GET',
            dataType: 'json'
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.getCurrentUser = getCurrentUser;
    function updateUserLastSeen() {
        $.ajax({
            url: '/Board/UserLastSeen/',
            type: 'GET',
            dataType: 'json'
        }).fail(Global.ShowConnectionError);
    }
    OllertApi.updateUserLastSeen = updateUserLastSeen;
    function getUsers(done) {
        $.ajax({
            url: '/api/User',
            type: 'GET',
            dataType: 'json'
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.getUsers = getUsers;

    // Step
    function updateStep(step, cardId) {
        var etapeServeur = Converter.toServerStep(step, cardId);
        $.ajax({
            url: '/api/Etape/' + step.id,
            type: 'PUT',
            dataType: 'json',
            data: etapeServeur
        }).fail(Global.ShowConnectionError);
    }
    OllertApi.updateStep = updateStep;
    function addStep(step, cardId, done) {
        var etapeServeur = Converter.toServerStep(step, cardId);

        // Sauvegarde le message
        $.ajax({
            url: '/api/Etape',
            type: 'POST',
            dataType: 'json',
            data: etapeServeur
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.addStep = addStep;
    function deleteStep(stepId, done) {
        $.ajax({
            url: '/api/Etape/' + stepId,
            type: 'DELETE',
            dataType: 'json'
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.deleteStep = deleteStep;

    // Message
    function deleteMessage(messageId, done) {
        $.ajax({
            url: '/api/Message/' + messageId,
            type: 'DELETE',
            dataType: 'json'
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.deleteMessage = deleteMessage;
    function addMessage(message, cardId, done) {
        var messageServeur = Converter.toServerMessage(message, cardId);

        // Sauvegarde le message
        $.ajax({
            url: '/api/Message',
            type: 'POST',
            dataType: 'json',
            data: messageServeur
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.addMessage = addMessage;
    function getMessages(done) {
        $.ajax({
            url: '/api/Message',
            type: 'GET',
            dataType: 'json'
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.getMessages = getMessages;

    // Notification
    function getNotifications(done) {
        $.ajax({
            url: '/api/Notification',
            type: 'GET',
            dataType: 'json'
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.getNotifications = getNotifications;

    // Board
    function updateBoard(board, done) {
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
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.updateBoard = updateBoard;
    function addBoard(board, currentUser, done) {
        var salleServeur = Converter.toServerBoard(board, currentUser.id);

        // Sauvegarde le message
        $.ajax({
            url: '/api/Salle',
            type: 'POST',
            dataType: 'json',
            data: salleServeur
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.addBoard = addBoard;
    function deleteBoard(boardId, done) {
        $.ajax({
            url: '/api/Salle/' + boardId,
            type: 'DELETE',
            dataType: 'json'
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.deleteBoard = deleteBoard;
    function getBoards(done) {
        $.ajax({
            url: '/api/Salle',
            type: 'GET',
            dataType: 'json'
        }).done(done).fail(Global.ShowConnectionError);
    }
    OllertApi.getBoards = getBoards;
})(OllertApi || (OllertApi = {}));
//# sourceMappingURL=OllertApi.js.map
