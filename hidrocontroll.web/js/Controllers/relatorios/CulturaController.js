(function () {
    angular.module("hidrocontroll.web").controller("CulturaRelatoriosController", culturaController);

    function culturaController($http, C, store, $state, $mdDialog) {
        var cultura = this;

        initializeData();

        function initializeData() {
            cultura.tabela = {
                "titulo": "Cultura",
                "subtitulo": "Relatório de cultura:",
                "cabecalho": ["Data",
                            "Necessidade hídrica quinzenal (mm)",
                            "Precipitação (mm)",
                            "Irrigação necessária (mm)",
                            "Irrigação realizada (mm)",
                            "Irrigação desnecessária",
                            "Dia excedido",
                            "Máxima necessidade hídrica"],
                "tipo": ["Por quinzena",
                         "Por mês"],
                "data": ["Período",
                         "Ciclo"]
            };
            cultura.atributos = ["Necessidade hídrica",
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
            cultura.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();