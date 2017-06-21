(function () {
    angular.module("hidrocontroll.web").controller("ReservatorioEquipamentosController", reservatorioController);

    function reservatorioController($http, C, store, $state, $mdDialog) {
        var reservatorio = this;

        initializeData();

        function initializeData() {
            reservatorio.tabela = {
                "titulo": "Reservatório",
                "subtitulo": "Informações sobre reservatório:",
                "cabecalho": ["Nome",
                            "Volume atual",
                            "Valor (m³/R$)"]
            };

            reservatorio.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();