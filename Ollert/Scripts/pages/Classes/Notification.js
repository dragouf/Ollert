var Notification = (function () {
    function Notification(data) {
        var self = this;
        this.id = data.id;
        this.type = data.type;
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
    return Notification;
})();
//# sourceMappingURL=Notification.js.map