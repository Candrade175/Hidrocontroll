(function () {
    angular.module("hidrocontroll.web").controller("CulturaParcelasController", culturaController);

    function culturaController($http, C, store, $state, $mdDialog) {
        var cultura = this;

        initializeData();

        function initializeData() {
            cultura.tabela = {
                "titulo": "Cultura",
                "subtitulo": "Informações sobre cultura:",
                "cabecalho": ["Nome/Variedade",
                            "Fases"]
            };

            cultura.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();