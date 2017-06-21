(function () {
    angular.module("hidrocontroll.web").controller("PrecipitacaoDadosController", precipitacaoController);

    function precipitacaoController($http, C, store, $state, $mdDialog) {
        var precipitacao = this;

        initializeData();

        function initializeData() {
            precipitacao.tabela = {
                "titulo": "Precipitação",
                "subtitulo": "Dados diários de precipitação:",
                "cabecalho": ["Data",
                            "Parcela",
                            "Precipitação (mm)"]
            };
            precipitacao.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();