(function () {
    angular.module("hidrocontroll.web").controller("OutorgaEquipamentosController", outorgaController);

    function outorgaController($http, C, store, $state, $mdDialog) {
        var outorga = this;

        initializeData();

        function initializeData() {
            outorga.tabela = {
                "titulo": "Outorga",
                "subtitulo": "Informações sobre outorga:",
                "cabecalho": ["Nome",
                            "Fases"]
            };

            outorga.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();