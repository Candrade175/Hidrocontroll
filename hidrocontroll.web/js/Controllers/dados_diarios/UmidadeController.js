(function () {
    angular.module("hidrocontroll.web").controller("UmidadeDadosDiariosController", umidadeController);

    function umidadeController($http, C, store, $state, $mdDialog) {
        var umidade = this;

        initializeData();

        function initializeData() {
            umidade.tabela = {
                "titulo": "Umidade",
                "subtitulo": "Dados diários de umidade:",
                "cabecalho": ["Data",
                            "Parcela",
                            "10cm",
                            "20cm",
                            "30cm",
                            "40cm",
                            "50cm",
                            "60cm"]
            }; 
            umidade.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();