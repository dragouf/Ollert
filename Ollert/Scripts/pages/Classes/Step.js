var Step = (function () {
    function Step(id, title, estimation, isDone) {
        var _this = this;
        this.id = id;
        this.title = ko.observable(title);
        this.estimation = ko.observable(estimation);
        this.isDone = ko.observable(isDone);

        // Computed
        this.listCss = ko.computed(function () {
            return this.isDone() ? 'item-green selected' : 'item-pink';
        }, this);

        // Methods
        this.toggleDone = function () {
            if (_this.isDone())
                _this.isDone(false);
            else
                _this.isDone(true);

            _this.editStep();
        };

        this.toggleInputDone = function () {
            _this.editStep();
            return true;
        };

        this.toReadableTime = function () {
            var seconds = _this.estimation();
            var numyears = Math.floor(seconds / 31536000);
            var numdays = Math.floor((seconds % 31536000) / 86400);
            var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
            var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
            var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
            var output = (numyears > 0 ? numyears + " y " : '') + (numdays > 0 ? numdays + " d" : '') + (numhours > 0 ? numhours + " h" : '') + (numminutes > 0 ? numminutes + " m" : '') + (numseconds > 0 ? numseconds + " s" : '');
            return output.length == 0 ? '<non estimé>' : output;
        };

        // SAUVEGARDE SERVEUR
        this.editStep = function () {
            OllertApi.updateStep(_this, -1);
        };
    }
    return Step;
})();
//# sourceMappingURL=Step.js.map
