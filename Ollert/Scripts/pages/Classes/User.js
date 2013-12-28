var User = (function () {
    function User(id, name, lastViewed, emailMd5, useGravatar, email) {
        var _this = this;
        this.id = id;
        this.name = ko.observable(name);
        this.email = ko.observable(email);
        this.emailMd5 = ko.observable(emailMd5);
        this.useGravatar = ko.observable(useGravatar);
        this.lastViewed = ko.observable(lastViewed);

        this.avatarPath = function () {
            return _this.useGravatar ? "http://www.gravatar.com/avatar/" + _this.emailMd5 : "/Board/AvatarImage/" + _this.id;
        };
    }
    return User;
})();
//# sourceMappingURL=User.js.map
