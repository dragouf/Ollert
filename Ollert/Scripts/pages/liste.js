var Salle = function (id, nom) {
    this.id = id;
    this.name = nom;
    this.salleUrl = ko.computed(function () {
        return "/Board/Salle/" + this.id;
    }, this);
}
var ListeModel = function (salles) {
    this.salles = ko.observableArray(salles);
}

function initializeListe(globalFunctions) {
    $.ajax({
        url: '/api/Salle',
        type: 'GET',
        dataType: 'json',
        success: function (salles) {
            var listeSalles = new Array();
            $.each(salles, function (index, salle) {
                listeSalles.push(new Salle(salle.Id, salle.Nom));
            });

            var vm = new ListeModel(listeSalles);
            ko.applyBindings(vm, $('#liste-content').get(0));

            globalFunctions();
        },
        statusCode: {
            400: function () {
                ShowConnectionError();
            },
            404: function () {
                ShowConnectionError();
            },
            500: function () {
                ShowConnectionError();
            }
        }
    });
}