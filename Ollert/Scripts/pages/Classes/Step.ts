class Step {
    id: number;
    title: KnockoutObservable<string>;
    estimation: KnockoutObservable<number>;
    isDone: KnockoutObservable<boolean>;

    listCss: KnockoutComputed<string>;

    // Methods
    toggleDone: () => void;
    toggleInputDone: () => void;
    toReadableTime: () => string;
    editStep: () => void;

    constructor(id: number, title: string, estimation: number, isDone: boolean) {
        this.id = id;
        this.title = ko.observable(title);
        this.estimation = ko.observable(estimation);
        this.isDone = ko.observable(isDone);

        // Computed
        this.listCss = ko.computed(function () {
            return this.isDone() ? 'item-green selected' : 'item-pink';
        }, this);

        // Methods
        this.toggleDone = () => {
            if (this.isDone())
                this.isDone(false);
            else
                this.isDone(true);

            this.editStep();
        }

        this.toggleInputDone = () => {
            this.editStep();
            return true;
        }

        this.toReadableTime = () => {
            var seconds = this.estimation();
            var numyears = Math.floor(seconds / 31536000);
            var numdays = Math.floor((seconds % 31536000) / 86400);
            var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
            var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
            var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
            var output = (numyears > 0 ? numyears + " y " : '') + (numdays > 0 ? numdays + " d" : '') + (numhours > 0 ? numhours + " h" : '') + (numminutes > 0 ? numminutes + " m" : '') + (numseconds > 0 ? numseconds + " s" : '');
            return output.length == 0 ? '<non estimé>' : output;
        }

        // SAUVEGARDE SERVEUR
        this.editStep = () => {
            OllertApi.updateStep(this, -1);
        }
    }
}