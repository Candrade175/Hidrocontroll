(function () {
    angular.module("hidrocontroll.web").controller("MotobombaEquipamentosController", motobombaController);

    function motobombaController($http, C, store, $state, $mdDialog) {
        var motobomba = this;

        initializeData();

        function initializeData() {
            motobomba.tabela = {
                "titulo": "Motobomba",
                "subtitulo": "Informações sobre motobomba:",
                "cabecalho": ["Nome",
                            "Potência (CV)",
                            "Consumo (Kw/h)",
                            "Vazão (m³/h)",
                            "Tarifas"]
            };

            motobomba.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();