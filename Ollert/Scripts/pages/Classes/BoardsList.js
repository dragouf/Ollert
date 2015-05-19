var BoardsList = (function () {
    function BoardsList(boards, currentUser, users) {
        var self = this;
        this.boards = ko.observableArray(boards);
        this.currentUser = currentUser;
        this.users = users;
        this.dialogNewBoard = ko.observable(new BoardDetails(-1, '', null, self.currentUser, self.users, 0, 0, 0));
        // Methods
        this.modalAddSalle = function () {
            $('#modal-ajout').modal('show');
        };
        this.addSalle = function () {
            OllertApi.addBoard(self.dialogNewBoard(), self.currentUser, function (jsonData) {
                // AJAX CALLBACK
                self.dialogNewBoard().id = jsonData.Id;
                self.boards.push(self.dialogNewBoard());
                self.dialogNewBoard(new BoardDetails(-1, '', null, self.currentUser, self.users, 0, 0, 0));
            });
            $('#modal-ajout').modal('hide');
        };
        this.deleteSalle = function (data) {
            OllertApi.deleteBoard(data.id, function () {
                // AJAX CALLBACK
                var indexSalle = -1;
                $.each(self.boards(), function (index, salle) {
                    if (salle.id == data.id)
                        indexSalle = index;
                });
                if (indexSalle >= 0)
                    self.boards.splice(indexSalle, 1);
            });
            return false;
        };
    }
    return BoardsList;
})();
//# sourceMappingURL=BoardsList.js.map