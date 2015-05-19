class User {
    id: number;
    name: KnockoutObservable<string>;
    email: KnockoutObservable<string>;
    emailMd5: KnockoutObservable<string>;
    useGravatar: KnockoutObservable<boolean>;
    lastViewed: KnockoutObservable<moment.Moment>;

    avatarPath: () => string;

    constructor(id: number, name: string, lastViewed: moment.Moment, emailMd5: string, useGravatar: boolean, email: string) {
        this.id = id;
        this.name = ko.observable(name);
        this.email = ko.observable(email);
        this.emailMd5 = ko.observable(emailMd5);
        this.useGravatar = ko.observable(useGravatar);
        this.lastViewed = ko.observable(lastViewed);

        this.avatarPath = () => {
            return this.useGravatar ? "http://www.gravatar.com/avatar/" + this.emailMd5 : "/Board/AvatarImage/" + this.id;
        }
    }
} 