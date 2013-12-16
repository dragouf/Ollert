class User {
    id: number;
    name: string;
    lastViewed: KnockoutObservable<Moment>;

    constructor(id: number, name: string, lastViewed: Moment) {
        this.id = id;
        this.name = name;
        this.lastViewed = ko.observable(lastViewed);
    }

    avatarPath() {
        return "/Board/AvatarImage/" + this.id;
    }
} 