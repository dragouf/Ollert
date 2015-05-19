class Message {
    id: number;
    text: KnockoutObservable<string>;
    user: KnockoutObservable<User>;
    date: KnockoutObservable<moment.Moment>;
    cardViewed: KnockoutObservable<moment.Moment>; // observable

    isViewed: KnockoutComputed<boolean>;
    formattedDate: KnockoutComputed<string>;

    constructor(id: number, text: string, user: User, date: moment.Moment, cardViewed: KnockoutObservable<moment.Moment>) {
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
}