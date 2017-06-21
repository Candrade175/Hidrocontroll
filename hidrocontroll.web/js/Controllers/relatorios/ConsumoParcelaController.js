(function () {
    angular.module("hidrocontroll.web").controller("ConsumoParcelaRelatoriosController", parcelaParcelaController);

    function parcelaParcelaController($http, C, store, $state, $mdDialog) {
        var consumo = this;

        initializeData();

        function initializeData() {
            consumo.tabela = {
                "titulo": "Consumo Parcela",
                "subtitulo": "Consumo resumido por parcela:",
                "cabecalho": ["Plantio",
                            "Parcela",
                            "Cultura",
                            "Área",
                            "Consumo (m³)",
                            "Valor energético (R$)"]
            };
            consumo.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();