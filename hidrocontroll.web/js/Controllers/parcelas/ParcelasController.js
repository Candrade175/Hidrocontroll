(function () {
    angular.module("hidrocontroll.web").controller("ParcelasController", parcelasController);

    function parcelasController($http, C, store, $state, $mdDialog) {
        var parcelas = this;

        initializeData();

        function initializeData() {
            parcelas.tabela = {
                "titulo": "Parcelas",
                "subtitulo": "Informações sobre parcelas:",
                "cabecalho": ["Nome",
                            "Cultura/Variedade",
                            "Equipamento",
                            "Área (ha)",
                            "Pluviômetro",
                            "Umidade do solo no plantio (%)",
                            "Estresse excedido (mm)",
                            "Outorga"]
            };

            parcelas.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();