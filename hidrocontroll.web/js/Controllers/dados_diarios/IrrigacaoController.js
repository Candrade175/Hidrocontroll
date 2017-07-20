(function () {
    angular.module("hidrocontroll.web").controller("IrrigacaoDadosController", irrigacaoController);

    function irrigacaoController($http, C, store, $state, $mdDialog) {
        var irrigacao = this;

        initializeData();

        function initializeData() {
            irrigacao.tabela = {
                "titulo": "Irrigação",
                "subtitulo": "Dados diários de irrigação:",
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
            irrigacao.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();