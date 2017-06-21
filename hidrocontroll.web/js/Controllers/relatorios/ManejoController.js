(function () {
    angular.module("hidrocontroll.web").controller("ManejoRelatoriosController", manejoController);

    function manejoController($http, C, store, $state, $mdDialog) {
        var manejo = this;

        initializeData();

        function initializeData() {
            manejo.tabela = {
                "titulo": "Manejo",
                "subtitulo": "Relatório de manejo:",
                "cabecalho": ["Data",
                            "Necessidade hídrica diária (mm)",
                            "Precipitação (mm)",
                            "Irrigação necessária (mm)",
                            "Irrigação realizada (mm)",
                            "Tempo necessário",
                            "Tempo irrigado (min)",
                            "Percentímetro (%)",
                            "Idade da cultura (dias)",
                            "ETo",
                            "Kc",
                            "Kl",
                            "Ks",
                            "Irrigação desnecessária (mm)"],
                "tipo": ["Detalhado",
                         "Por mês",
                         "Por período"],
                "data": ["Período",
                         "Ciclo"]
            };
            manejo.atributos =     ["Necessidade hídrica",
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
            manejo.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();