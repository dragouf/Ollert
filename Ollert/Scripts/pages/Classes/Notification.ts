interface INotification{
    id: number;
    type: string;
    title: string;
    text: string;
    date: moment.Moment;
    lastUserViewed: moment.Moment;
    creator: User;
}

class Notification {
    id: number;
    type: string;
    title: string;
    text: string;
    date: moment.Moment;
    lastUserViewed: moment.Moment;
    creator: User;

    isNotifViewed: KnockoutComputed<boolean>;
    formattedDate: KnockoutComputed<string>;
    notificationImgUrl: KnockoutComputed<string>;

    constructor(data: INotification) {
        var self = this;

        this.id = data.id;
        this.type = data.type
        this.title = data.title;
        this.text = data.text;
        this.date = data.date;
        this.lastUserViewed = data.lastUserViewed;
        this.creator = data.creator;

        this.isNotifViewed = ko.computed(function () {
            if (self.lastUserViewed != null) {
                return self.date > self.lastUserViewed;
            }
            else
                return true;
        }, self);
        this.formattedDate = ko.computed(function () {
            return self.date.calendar();
        }, self);
        this.notificationImgUrl = ko.computed(function () {
            var imgUrl = Global.getNotifyIconUrl(self.type);
            return imgUrl;
        }, self);
    }
}