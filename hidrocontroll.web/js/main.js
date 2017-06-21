(function () {

    /**
     * Declaração do módulo principal da aplicação com suas dependências
     * 
     * @type {Angular.module}
     */
    var srp = angular.module("hidrocontroll.web", ["ngMaterial", "ui.router", "Model", "angular-storage", "ngMessages"]);

    srp.run(function () {

        Date.prototype.addDays = function (qtdDias) {
            var millisecondsSinc1970 = this.getTime();
            var millisecondsToAdd = qtdDias * 24 * 60 * 60 * 1000;
            return new Date(millisecondsSinc1970 + millisecondsToAdd);
        }
    })

    /**
     * Configuração das rotas da aplicação
     * 
     * @param  {Angular.provider} $stateProvider - Serviço para declaração dos Estados/Rotas
     * @param  {Angular.provider} $urlRouterProvider - Serviço para declaração da Rota padrão
     */
    srp.config(function ($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /login
        //$urlRouterProvider.otherwise("/login");
        $urlRouterProvider.otherwise("/main");
        //
        // Now set up the states
        $stateProvider
            .state('main', {
                url: "/main",
                templateUrl: "pages/main.html",
                controller: "BodyController",
                controllerAs: "body",
                state: "main"
            })

            .state('login', {
                url: "/login",
                templateUrl: "pages/login.html",
                controller: "LoginController",
                controllerAs: "login",
                menu: "Login",
                state: "login"
            })

            //### Dados diários ###
            .state('main.dadosDiarios', {
                menu: "Dados Diários",
                subMenu: [{ "nome": "Clima", "icon": "glyphicon glyphicon-cloud" },
                    { "nome": "Irrigação", "icon": "glyphicon glyphicon-tint" },
                    { "nome": "Umidade", "icon": "glyphicon glyphicon-certificate" },
                    { "nome": "Precipitação", "icon": "glyphicon glyphicon-asterisk" },
                    { "nome": "Reservatório", "icon": "glyphicon glyphicon-th-large" }],
                iconClass: "glyphicon glyphicon-signal"
            })

            .state('main.ClimaDadosDiários', {
                url: "/clima",
                templateUrl: "pages/dados_diarios/clima.html",
                controller: "ClimaDadosController",
                controllerAs: "climaDds"
            })

            .state('main.IrrigaçãoDadosDiários', {
                url: "/irrigacao",
                templateUrl: "pages/dados_diarios/irrigacao.html",
                controller: "IrrigacaoDadosController",
                controllerAs: "irrigacaoDds"
            })

            .state('main.UmidadeDadosDiários', {
                url: "/umidade",
                templateUrl: "pages/dados_diarios/umidade.html",
                controller: "UmidadeDadosController",
                controllerAs: "umidadeDds"
            })

            .state('main.PrecipitaçãoDadosDiários', {
                url: "/precipitacao",
                templateUrl: "pages/dados_diarios/precipitacao.html",
                controller: "PrecipitacaoDadosController",
                controllerAs: "precipitacaoDds"
            })

            .state('main.ReservatórioDadosDiários', {
                url: "/reservatorioDados",
                templateUrl: "pages/dados_diarios/reservatorio.html",
                controller: "ReservatorioDadosController",
                controllerAs: "reservatorioDds"
            })


            //### Equipamentos ###
            .state('main.equipamentosDadosDiários', {
                menu: "Equipamentos",
                subMenu: [{ "nome": "Gotejador", "icon": "glyphicon glyphicon-tint" },
                    { "nome": "Pivô Central", "icon": "glyphicon glyphicon-move" },
                    { "nome": "Outorga", "icon": "glyphicon glyphicon-tasks" },
                    { "nome": "Motobomba", "icon": "glyphicon glyphicon-wrench" },
                    { "nome": "Reservatório", "icon": "glyphicon glyphicon-th-large" }],
                iconClass: "glyphicon glyphicon-magnet"
            })

            .state('main.GotejadorEquipamentos', {
                url: "/gotejador",
                templateUrl: "pages/equipamentos/gotejador.html",
                controller: "GotejadorEquipamentosController",
                controllerAs: "gotejadorEqp"
            })

            .state('main.PivôCentralEquipamentos', {
                url: "/pivoCentral",
                templateUrl: "pages/equipamentos/pivoCentral.html",
                controller: "PivoCentralEquipamentosController",
                controllerAs: "pivoCentralEqp"
            })

            .state('main.OutorgaEquipamentos', {
                url: "/outorga",
                templateUrl: "pages/equipamentos/outorga.html",
                controller: "OutorgaEquipamentosController",
                controllerAs: "outorgaEqp"
            })

            .state('main.MotobombaEquipamentos', {
                url: "/motobomba",
                templateUrl: "pages/equipamentos/motobomba.html",
                controller: "MotobombaEquipamentosController",
                controllerAs: "motobombaEqp"
            })

            .state('main.ReservatórioEquipamentos', {
                url: "/reservatorioEquipamentos",
                templateUrl: "pages/equipamentos/reservatorio.html",
                controller: "ReservatorioEquipamentosController",
                controllerAs: "reservatorioEqp"
            })

            //### Parcelas ###
            .state('main.parcelas', {
                menu: "Parcelas",
                subMenu: [{ "nome": "Cultura", "icon": "glyphicon glyphicon-grain" },
                    { "nome": "Parcelas", "icon": "glyphicon glyphicon-tree-conifer" }],
                iconClass: "glyphicon glyphicon-leaf"
            })

            .state('main.CulturaParcelas', {
                url: "/cultura",
                templateUrl: "pages/parcelas/cultura.html",
                controller: "CulturaParcelasController",
                controllerAs: "culturaPrc"
            })

            .state('main.ParcelasParcelas', {
                url: "/parcelas",
                templateUrl: "pages/parcelas/parcelas.html",
                controller: "ParcelasParcelasController",
                controllerAs: "parcelasPrc"
            })

            //### Relatórios ###
            .state('main.relatorios', {
                menu: "Relatórios",
                subMenu: [{ "nome": "Manejo", "icon": "glyphicon glyphicon-tree-deciduous" },
                    { "nome": "Clima", "icon": "glyphicon glyphicon-cloud" },
                    { "nome": "Cultura", "icon": "glyphicon glyphicon-grain" },
                    { "nome": "Consumo Outorga", "icon": "glyphicon glyphicon-align-left" },
                    { "nome": "Consumo Parcela", "icon": "glyphicon glyphicon-align-center" },
                    { "nome": "Consumo Fertirrigação", "icon": "glyphicon glyphicon-align-right" }],
                iconClass: "glyphicon glyphicon-list-alt"
            })

            .state('main.ManejoRelatórios', {
                url: "/manejo",
                templateUrl: "pages/relatorios/manejo.html",
                controller: "ManejoRelatoriosController",
                controllerAs: "manejoRel"
            })

            .state('main.ClimaRelatórios', {
                url: "/clima",
                templateUrl: "pages/relatorios/clima.html",
                controller: "ClimaRelatoriosController",
                controllerAs: "climaRel"
            })

            .state('main.CulturaRelatórios', {
                url: "/cultura",
                templateUrl: "pages/relatorios/cultura.html",
                controller: "CulturaRelatoriosController",
                controllerAs: "culturaRel"
            })

            .state('main.ConsumoOutorgaRelatórios', {
                url: "/consumoOutorga",
                templateUrl: "pages/relatorios/consumoOutorga.html",
                controller: "ConsumoOutorgaRelatoriosController",
                controllerAs: "consumoOutRel"
            })

            .state('main.ConsumoParcelaRelatórios', {
                url: "/consumoParcela",
                templateUrl: "pages/relatorios/consumoParcela.html",
                controller: "ConsumoParcelaRelatoriosController",
                controllerAs: "consumoPrcRel"
            })

            .state('main.ConsumoFertirrigaçãoRelatórios', {
                url: "/consumoFertirrigacao",
                templateUrl: "pages/relatorios/consumoFertirrigacao.html",
                controller: "ConsumoFertirrigacaoRelatoriosController",
                controllerAs: "consumoFerRel"
            })
    });

    /**
     * Configuração do Serviço de acesso á dados
     * 
     * @param  {Angular.provider} ModelProvider - Serviço customizado de acesso à dados REST
     * @param  {Angular.constant} C - Constantes da aplicação
     */
    srp.config(['ModelProvider', 'C', function (ModelProvider, C) {

        ModelProvider.domain = C.domain;
        ModelProvider.port = C.port;
        ModelProvider.mainUrl = C.mainUrl;
        ModelProvider.id = C.id;
        ModelProvider.protocol = C.protocol;
    }]);

    /**
     * Configuração do Serviço de Ícones do Angular Material
     * 
     * @param  {Angular.provider} $mdIconProvider - Serviço do Angular para inclusão de Ícones
     */
    srp.config(function ($mdIconProvider) {
        // Configure URLs for icons specified by [set:]id.
        $mdIconProvider
             .defaultFontSet('material-icons');
    });

})();