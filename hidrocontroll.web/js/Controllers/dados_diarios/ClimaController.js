(function () {
    angular.module("hidrocontroll.web").controller("ClimaDadosController", climaController);

    function climaController($http, C, store, $state, $mdDialog) {
        var clima = this;

        initializeData();

        function initializeData() {
            clima.tabela = {
                "titulo": "Clima",
                "subtitulo": "Dados diários de clima:",
                "cabecalho": ["Data",
                            "Temp. máxima (ºC)",
                            "Temp. mínima (ºC)",
                            "Temp. média (ºC)",
                            "Umidade relativa (%)",
                            "Velocidade do vento (m/s)",
                            "Precipitação total (mm)",
                            "Radiação média 24h (W/m²)"]
            };
            clima.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();