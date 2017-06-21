(function () {
    angular.module("hidrocontroll.web").controller("GotejadorEquipamentosController", gotejadorController);

    function gotejadorController($http, C, store, $state, $mdDialog) {
        var gotejador = this;

        initializeData();

        function initializeData() {
            gotejador.tabela = {
                "titulo": "Gotejador",
                "subtitulo": "Informações sobre gotejador:",
                "cabecalho": ["Nome/Descrição",
                            "Vazão (l/h)",
                            "Espaçamento entre gotejadores",
                            "Espaçamento entre linhas laterais",
                            "Largura da faixa molhada",
                            "Uniformidade (%)",
                            "Lâmina (mm)"]
            };

            gotejador.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        }
    };
})();