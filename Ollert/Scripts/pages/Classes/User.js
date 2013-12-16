var User = (function () {
    function User(id, name, lastViewed) {
        this.id = id;
        this.name = name;
        this.lastViewed = ko.observable(lastViewed);
    }
    User.prototype.avatarPath = function () {
        return "/Board/AvatarImage/" + this.id;
    };
    return User;
})();
//# sourceMappingURL=User.js.map
