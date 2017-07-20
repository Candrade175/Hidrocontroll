(function () {
    angular.module("hidrocontroll.web").controller("ConsumoFertirrigacaoRelatoriosController", consumoFertirrigacaoController);

    function consumoFertirrigacaoController($http, C, store, $state, $mdDialog) {
        var consumo = this;

        initializeData();

        function initializeData() {
            consumo.tabela = {
                "titulo": "Consumo Fertirrigação",
                "subtitulo": "Consumo resumido por fertirrigação:",
                "cabecalho": ["Data",
                            "Parcela",
                            "Irrigação pivô (%)",
                            "Irrigação gotejo (minutos)",
                            "Início da irrigação (horas)",
                            "Irrigação (mm)",
                            "Volume consumido (m³)",
                            "Valor energético (R$)",
                            "Fertirrigação"]
            };
            consumo.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();