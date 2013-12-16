class BoardsList {
    boards: KnockoutObservableArray<BoardDetails>;
        currentUser: User;
    users: Array<User>;

    dialogNewBoard: KnockoutObservable<BoardDetails>;

    // Method
    modalAddSalle: () => void;
    addSalle: () => void;
    deleteSalle: (data: BoardDetails) => boolean;

    constructor(boards: Array<BoardDetails>, currentUser: User, users: Array<User>) {
        var self = this;

        this.boards = ko.observableArray(boards);
        this.currentUser = currentUser;
        this.users = users;

        this.dialogNewBoard = ko.observable(new BoardDetails(-1, '', null, self.currentUser, self.users, 0, 0, 0));

        // Methods
        this.modalAddSalle = () => {
            $('#modal-ajout').modal('show');
        }
        this.addSalle = () => {
            OllertApi.addBoard(self.dialogNewBoard(), self.currentUser, function (jsonData) {
                // AJAX CALLBACK
                self.dialogNewBoard().id = jsonData.Id;
                self.boards.push(self.dialogNewBoard());
                self.dialogNewBoard(new BoardDetails(-1, '', null, self.currentUser, self.users, 0, 0, 0));
            });
            $('#modal-ajout').modal('hide');
        }
        this.deleteSalle = (data: BoardDetails) => {
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
        }
    }
}