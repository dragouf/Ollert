var Attachment = (function () {
    function Attachment(id, name, date, type, size) {
        this.id = id;
        this.name = ko.observable(name);
        this.date = ko.observable(date);
        this.type = ko.observable(type);
        this.size = ko.observable(size);
    }
    return Attachment;
})();
//# sourceMappingURL=Attachment.js.map