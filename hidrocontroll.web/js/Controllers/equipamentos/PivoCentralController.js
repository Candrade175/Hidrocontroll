(function () {
    angular.module("hidrocontroll.web").controller("PivoCentralEquipamentosController", pivoCentralController);

    function pivoCentralController($http, C, store, $state, $mdDialog) {
        var pivoCentral = this;

        initializeData();

        function initializeData() {
            pivoCentral.tabela = {
                "titulo": "Pivô Central",
                "subtitulo": "Informações sobre pivô central:",
                "cabecalho": ["Nome",
                            "Modelo",
                            "Velocidade a 100% (m/h)",
                            "Tempo máximo diário (h)",
                            "Raio total (m)",
                            "Vão em balanço (m)",
                            "Vazão (m³/h)",
                            "Eficiência (%)",
                            "Lâmina (mm)"]
            };

            pivoCentral.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();