(function () {
    angular.module("hidrocontroll.web").controller("ReservatorioDadosController", reservatorioController);

    function reservatorioController($http, C, store, $state, $mdDialog) {
        var reservatorio = this;

        initializeData();

        function initializeData() {
            reservatorio.tabela = {
                "titulo": "Reservatório",
                "subtitulo": "Dados diários de reservatório:",
                "cabecalho": ["Data",
                            "Reservatório",
                            "Motobomba",
                            "Início",
                            "Término",
                            "Volume (m³)",
                            "Consumo (R$/m³)"]
            };
            reservatorio.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();