var Message = (function () {
    function Message(id, text, user, date, cardViewed) {
        var self = this;
        this.id = id;
        this.text = ko.observable(text);
        this.user = ko.observable(user);
        this.date = ko.observable(date);
        this.cardViewed = cardViewed;
        // Computed
        this.isViewed = ko.computed(function () {
            if (self.cardViewed() != null)
                return self.date() > self.cardViewed();
            else
                return true;
        }, self);
        this.formattedDate = ko.computed(function () {
            var formattedDate = '';
            if (self.date() != null) {
                formattedDate = self.date().calendar();
            }
            return formattedDate;
        }, self);
    }
    return Message;
})();
//# sourceMappingURL=Message.js.map