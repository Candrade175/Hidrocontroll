(function () {
    angular.module("hidrocontroll.web").controller("ConsumoOutorgaRelatoriosController", consumoOutorgaController);

    function consumoOutorgaController($http, C, store, $state, $mdDialog) {
        var consumo = this;

        initializeData();

        function initializeData() {
            consumo.tabela = {
                "titulo": "Consumo Outorga",
                "subtitulo": "Consumo resumido por outorga:",
                "cabecalho": ["Nome",
                            "Volume (m³)",
                            "Fases"]
            };
            consumo.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();