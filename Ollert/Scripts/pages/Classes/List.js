var List = (function () {
    function List(data) {
        var _this = this;
        var self = this;
        this.id = data.id;
        this.name = data.name;
        this.allCards = ko.observableArray(data.cards);
        this.boardId = data.boardId;
        this.parent = ko.observable(data.parent);
        this.cards = ko.observableArray(new Array());
        this.allCards.id = data.id;
        this.cards.id = data.id;
        this.listCards = ko.computed(function () {
            var cartes = new Array();
            if (self.parent() != null) {
                $.each(self.allCards(), function (index, card) {
                    if (self.parent().displayArchive() && card.isArchive())
                        cartes.push(card);
                    else if (!self.parent().displayArchive() && !card.isArchive())
                        cartes.push(card);
                });
            }
            self.cards(cartes);
            //return cartes;
        }, self);
        this.hasCards = ko.computed(function () {
            return self.cards().length > 0;
        }, self);
        this.totalTime = ko.computed(function () {
            var total = 0;
            $.each(self.cards(), function (index, el) {
                total += el.estimation();
            });
            var seconds = total;
            var numyears = Math.floor(seconds / 31536000);
            var numdays = Math.floor((seconds % 31536000) / 86400);
            var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
            var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
            var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
            return (numyears > 0 ? numyears + " y " : '') + (numdays > 0 ? numdays + " d" : '') + (numhours > 0 ? numhours + " h" : '') + (numminutes > 0 ? numminutes + " m" : '') + (numseconds > 0 ? numseconds + " s" : '');
        }, self);
        // SERVER
        this.deleteCard = function (data, event) {
            var self = _this;
            event.stopImmediatePropagation();
            OllertApi.deleteCard(data.id, function () {
                // AJAX CALLBACK
                self.cards.remove(data);
            });
            return false;
        };
    }
    return List;
})();
//# sourceMappingURL=List.js.map