(function () {
    angular.module("hidrocontroll.web").controller("ClimaRelatoriosController", climaController);

    function climaController($http, C, store, $state, $mdDialog) {
        var clima = this;

        initializeData();

        function initializeData() {
            clima.tabela = {
                "titulo": "Clima",
                "subtitulo": "Relatório de dados:",
                "cabecalho": ["Data",
                            "Temp. máxima (ºC)",
                            "Temp. mínima (ºC)",
                            "Temp. média (ºC)",
                            "Umidade relativa (%)",
                            "Velocidade do vento (m/s)",
                            "Precipitação total (mm)",
                            "Radiação médio 24h (W/m³)"],
                "data": ["Período",
                         "Ciclo"]
            };
            clima.atributos = ["Necessidade hídrica",
                                    "Precipitação",
                                    "Irrigação necessária",
                                    "Irrigação realizada",
                                    "Tempo necessário",
                                    "Percentímetro",
                                    "Idade da cultura",
                                    "Irrigação desnecessária",
                                    "Dias excedidos",
                                    "Duração de irrigação",
                                    "ETo",
                                    "Kc",
                                    "Kl",
                                    "Ks"];
            clima.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();