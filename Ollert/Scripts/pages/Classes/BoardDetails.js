var BoardDetails = (function () {
    function BoardDetails(id, nom, participants, proprietaire, users, unseenMessage, unseenFiles, timeLeft) {
        var _this = this;
        var self = this;
        this.id = id;
        this.name = nom;
        this.users = ko.observableArray(users);
        this.proprietaire = ko.observable(proprietaire);
        this.participants = ko.observableArray(participants);
        this.isShow = ko.observable(false);
        this.unseenMessage = ko.observable(unseenMessage);
        this.unseenFiles = ko.observable(unseenFiles);
        this.timeLeft = ko.observable(timeLeft);
        // Computed
        this.salleUrl = ko.computed(function () {
            return "/Board/Salle/" + self.id.toString();
        }, self);
        // Methods
        this.showUsers = function () {
            _this.isShow(!_this.isShow());
        };
        this.timeLeftHumanReadable = function () {
            var seconds = _this.timeLeft();
            var numyears = Math.floor(seconds / 31536000);
            var numdays = Math.floor((seconds % 31536000) / 86400);
            var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
            var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
            var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
            var output = (numyears > 0 ? numyears + " y " : '') + (numdays > 0 ? numdays + " d" : '') + (numhours > 0 ? numhours + " h" : '') + (numminutes > 0 ? numminutes + " m" : '') + (numseconds > 0 ? numseconds + " s" : '');
            return output;
        };
        // SERVEUR
        this.addParticipant = function (data) {
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
            OllertApi.updateBoard(self);
        };
        this.removeParticipant = function (data) {
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
            // MAJ serveur
            OllertApi.updateBoard(_this);
            return false;
        };
    }
    return BoardDetails;
})();
//# sourceMappingURL=BoardDetails.js.map