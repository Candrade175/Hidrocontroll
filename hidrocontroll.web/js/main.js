﻿(function () {

    /**
     * Declaração do módulo principal da aplicação com suas dependências
     * 
     * @type {Angular.module}

     */
    var isLogado = false;
    var srp = angular.module("hidrocontroll.web", ["ngMaterial", "ui.router", "Model", "angular-storage", "ngMessages", 'ngTable']);

    srp.run(function () {
        
        Date.prototype.addDays = function (qtdDias) {
            var millisecondsSinc1970 = this.getTime();
            var millisecondsToAdd = qtdDias * 24 * 60 * 60 * 1000;
            return new Date(millisecondsSinc1970 + millisecondsToAdd);
        }
        Date.prototype.addMinutes = function (qtdMinutes) {
            var millisecondsSinc1970 = this.getTime();
            var millisecondsToAdd = qtdMinutes * 60 * 1000;
            return new Date(millisecondsSinc1970 + millisecondsToAdd);
        }
        Date.prototype.addHours = function (qtdHours) {
            var millisecondsSinc1970 = this.getTime();
            var millisecondsToAdd = qtdHours * 60 * 60 * 1000;
            return new Date(millisecondsSinc1970 + millisecondsToAdd);
        }
    })


    function isLogado (store){
        if (store.get('user'))
            return true;
        else
            return false;
    }
    /**
     * Configuração das rotas da aplicação
     * 
     * @param  {Angular.provider} $stateProvider - Serviço para declaração dos Estados/Rotas
     * @param  {Angular.provider} $urlRouterProvider - Serviço para declaração da Rota padrão
     */
    srp.config(function ($stateProvider, $urlRouterProvider) {
        
        //
        // For any unmatched url, redirect to /login
        
        $urlRouterProvider.otherwise("/login");
       // console.log(store.get('user'));

        //$urlRouterProvider.otherwise("/main");
        //
        // Now set up the states
        $stateProvider
            .state('main', {
                url: "/main",
                templateUrl: "pages/main.html",
                resolve: {
                    security: ['$q','store', function($q,store){
                        if (!store.get('user'))
                           return $q.reject("Not Authorized");
                    }]
                },
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

             .state('main.Fazendas', {
                 url: "/Fazendas",
                 templateUrl: "pages/fazendas/fazenda.html",
                 controller: "FazendaController",
                 controllerAs: "fazendas",
                 menu: "Fazendas",
                 icon: "glyphicon glyphicon-signal"
             })



            //### Dados diários ###
            .state('main.DadosDiários', {
                menu: "Dados Diários",
                subMenu: [{ "nome": "Clima", "icon": "fa fa-thermometer-quarter" },
                    { "nome": "Irrigação", "icon": "fa fa-shower" },
                    { "nome": "Umidade", "icon": "glyphicon glyphicon-tint" },
                    { "nome": "Precipitação", "icon": "glyphicon glyphicon-cloud" },
                    { "nome": "Reservatório", "icon": "glyphicon glyphicon-th-large" },
                    { "nome": "Calcular", "icon": "fa fa-calculator" }],
                icon: "glyphicon glyphicon-signal"
            })

            

            .state('main.DadosDiáriosClima', {

                url: "/Clima",
                templateUrl: "pages/dados_diarios/clima.html",
                controller: "ClimaDadosDiariosController",
                controllerAs: "climaDds"
            })

            .state('main.DadosDiáriosIrrigação', {
                url: "/irrigacao",
                templateUrl: "pages/dados_diarios/irrigacao.html",
                controller: "IrrigacaoDadosDiariosController",
                controllerAs: "irrigacaoDds"
            })

            .state('main.DadosDiáriosUmidade', {
                url: "/umidade",
                templateUrl: "pages/dados_diarios/umidade.html",
                controller: "UmidadeDadosDiariosController",
                controllerAs: "umidadeDds"
            })

            .state('main.DadosDiáriosPrecipitação', {
                url: "/precipitacao",
                templateUrl: "pages/dados_diarios/precipitacao.html",
                controller: "PrecipitacaoDadosDiariosController",
                controllerAs: "precipitacaoDds"
            })

            .state('main.DadosDiáriosReservatório', {
                url: "/reservatorioDiario",
                templateUrl: "pages/dados_diarios/reservatorio.html",
                controller: "ReservatorioDadosDiariosController",
                controllerAs: "reservatorioDds"
            })

            .state('main.DadosDiáriosCalcular', {
                url: "/Calcular",
                templateUrl: "pages/dados_diarios/manejo.html",
                controller: "ManejoDadosDiariosController",
                controllerAs: "manejoDds"
            })

            //### Cadastros ###
            .state('main.Cadastros', {
                menu: "Cadastros",
                subMenu: [{ "nome": "Cultura", "icon": "glyphicon glyphicon-grain" },
                    { "nome": "Fases de Cultura", "icon": "glyphicon glyphicon-grain" },
                    { "nome": "Solo", "icon": "glyphicon glyphicon-grain" },
                    { "nome": "Equipamentos", "icon": "glyphicon glyphicon-tasks",
                       "subSubMenu": [{ "nome": "Gotejador", "icon": "glyphicon glyphicon-tint" },
                                    { "nome": "Modelo Pivô Central", "icon": "glyphicon glyphicon-move" },
                                    { "nome": "Pivô Central", "icon": "glyphicon glyphicon-move" },
                                    { "nome": "Motobomba", "icon": "glyphicon glyphicon-wrench" }]},
                    { "nome": "Outorga", "icon": "glyphicon glyphicon-tasks" },
                    { "nome": "Fases de Outorga", "icon": "glyphicon glyphicon-grain" },
                    { "nome": "Reservatório/Rebombeamento", "icon": "glyphicon glyphicon-th-large" },

                    { "nome": "Tarifa", "icon": "glyphicon glyphicon-th-large" }],

                icon: "glyphicon glyphicon-leaf"
            })


             .state('main.CadastrosCultura', {
                 url: "/cultura",
                 templateUrl: "pages/cadastros/cultura.html",
                 controller: "CulturaCadastrosController",
                 controllerAs: "culturaCdt"
             })

            .state('main.CadastrosFasesde Cultura', {
                url: "/faseCultura",
                templateUrl: "pages/cadastros/faseCultura.html",
                controller: "FaseCulturaCadastrosController",
                controllerAs: "faseCulturaCdt"
            })

            .state('main.CadastrosSolo', {
                url: "/solo",
                templateUrl: "pages/cadastros/solo.html",
                controller: "SoloCadastrosController",
                controllerAs: "soloCdt"
            })

             .state('main.CadastrosTarifa', {
                 url: "/tarifa",
                 templateUrl: "pages/cadastros/tarifa.html",
                 controller: "TarifaCadastrosController",
                 controllerAs: "tarifaCdt"
             })


            .state('main.CadastrosReservatório/Rebombeamento', {
                url: "/reservatorio",
                templateUrl: "pages/cadastros/reservatorio.html",
                controller: "ReservatorioCadastrosController",
                controllerAs: "reservatorioCdt"
            })

            .state('main.CadastrosOutorga', {
                url: "/outorga",
                templateUrl: "pages/cadastros/outorga.html",
                controller: "OutorgaCadastrosController",
                controllerAs: "outorgaCdt"
            })

            .state('main.CadastrosFasesde Outorga', {
                url: "/faseOutorga",
                templateUrl: "pages/cadastros/faseOutorga.html",
                controller: "FaseOutorgaCadastrosController",
                controllerAs: "faseOutorgaCdt"
            })


            .state('main.CadastrosEquipamentosGotejador', {
                url: "/gotejador",
                templateUrl: "pages/cadastros/equipamentos/gotejador.html",
                controller: "GotejadorCadastrosEquipamentosController",
                controllerAs: "gotejadorEqp"
            })

            .state('main.CadastrosEquipamentosModeloPivô Central', {
                url: "/modeloPivoCentral",
                templateUrl: "pages/cadastros/equipamentos/modeloPivoCentral.html",
                controller: "ModeloPivoCentralCadastrosEquipamentosController",
                controllerAs: "modeloPivoCentralEqp"
            })


            .state('main.CadastrosEquipamentosPivôCentral', {
                url: "/pivoCentral",
                templateUrl: "pages/cadastros/equipamentos/pivoCentral.html",
                controller: "PivoCentralCadastrosEquipamentosController",
                controllerAs: "pivoCentralEqp"
            })


            .state('main.CadastrosEquipamentosMotobomba', {
                url: "/motobomba",
                templateUrl: "pages/cadastros/equipamentos/motobomba.html",
                controller: "MotobombaCadastrosEquipamentosController",
                controllerAs: "motobombaEqp"
            })


            


            //### Parcelas ###

            .state('main.Parcelas', {
                url: "/parcelas",
                menu: "Parcelas",
                icon: "glyphicon glyphicon-signal",
                templateUrl: "pages/parcelas/parcelas.html",
                controller: "ParcelasController",
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
                icon: "glyphicon glyphicon-list-alt"
            })

            .state('main.RelatóriosManejo', {
                url: "/manejo",
                templateUrl: "pages/relatorios/manejo.html",
                controller: "ManejoRelatoriosController",
                controllerAs: "manejoRel"
            })

            .state('main.ClimaRelatórios', {
                url: "/relatorioClima",
                templateUrl: "pages/relatorios/gotejador.html",
                controller: "ClimaRelatoriosController",
                controllerAs: "gotejadorRel"
            })

            .state('main.CulturaRelatórios', {
                url: "/relatorioCultura",
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