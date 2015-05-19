class Attachment {
    id: number;
    name: KnockoutObservable<string>;
    date: KnockoutObservable<moment.Moment>;
    type: KnockoutObservable<string>;
    size: KnockoutObservable<number>;

    constructor(id: number, name: string, date: moment.Moment, type: string, size: number) {
        this.id = id;
        this.name = ko.observable(name);
        this.date = ko.observable(date);
        this.type = ko.observable(type);
        this.size = ko.observable(size);
    }
}