

(function () {
    angular.module("hidrocontroll.web").controller("ConsumoOutorgaRelatoriosController", parcelaController).filter("dateFilterIrrigacaoRelatorio", dateFilter);

    function parcelaController(EntitiesService, $mdMedia, $mdDialog, $filter, store, $rootScope, NgTableParams, $element, $timeout, PrintService) {
        var self = this;

        initializeData();

        function initializeData() {
            if (store.get('fazenda'))
                self.codFazendaAtual = store.get('fazenda').IDC_CAD_FAZENDA;
            self.Parcela = EntitiesService.parcela;
            self.FaseOutorga = EntitiesService.faseOutorga;
            self.Irrigacao = EntitiesService.irrigacao;
            self.Outorga = EntitiesService.outorga;
            self.limparTodosAtributos = limparTodosAtributos;
            self.marcarTodosAtributos = marcarTodosAtributos;
            self.data = null;
            self.atributosMarcados = [];
            self.iniciaBusca = iniciaBusca;
            self.imprimeTabela = imprimeTabela;



            self.cabecalho = {
                "titulo": "Consumo Outorga",
                "subtitulo": "Consumo resumido por Outorga:",

                "tipo": ["Detalhado",
                         "Por mês",
                         "Por período"],
                "data": ["Período",
                         "Todos"]
            };

            self.atributos = [
                            "Volume (m³)",
                            "Fases"
            ];

            self.cols = [
                { field: "NOM_OUTORGA", title: "Nome", sortable: "NOM_OUTORGA", show: true, filter: { NOM_OUTORGA: "text" }, type: "valor" },
                { field: "VOLUME", title: "Volume (m³)", sortable: "VOLUME", sortable: "VOLUME", show: true, filter: { VOLUME: "text" }, type: "valor" },
                { field: "FASES", title: "Fases", sortable: "FASES", filter: { FASES: "number" }, show: true, type: "valor" }   
            ];

        };

        function marcarTodosAtributos() {
            self.atributosMarcados = self.atributos;
        };

        function limparTodosAtributos() {
            self.atributosMarcados = [];
        };

        function imprimeTabela() {
            if (self.list) {
                self.tableParams = new NgTableParams({ count: self.list.length }, { dataset: self.list });
                $timeout(function () {
                    PrintService.imprimirTabela('Relatório de Consumo Outorgas');
                    self.tableParams = new NgTableParams({}, { dataset: self.list });
                });
            }
        };

        self.clearSearchTerm = function () {
            self.searchTerm = '';
        };

        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

        function iniciaBusca() {
            for (i = 1; i < self.cols.length; i++)
                self.cols[i].show = false;
            if (self.data != null)
                if ((self.data == 'Período' && self.cabecalho.data_inicio != null && self.cabecalho.data_fim != null) || self.data == 'Todos') {
                    self.list = self.Outorga.list;

                    self.list = $filter('filter')(self.list, function (outorga) {
                        return outorga.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                    });


                    
                    self.list = $filter('orderBy')(self.list, 'NOM_OUTORGA');

                    self.cols[0].show = true;
                    for (j = 0; j < self.atributosMarcados.length; j++) {

                        if (self.atributosMarcados[j] == self.cols[1].title)
                            self.cols[1].show = true;
                        else if (self.atributosMarcados[j] == self.cols[2].title)
                            self.cols[2].show = true;
                    }
                    self.list = adicionaCampos(self.list);
                    self.tableParams = new NgTableParams({}, { dataset: self.list });
                }
        };


        function adicionaCampos(list) {
            listIrrigacao = self.Irrigacao.list;
            if (self.data == 'Período')
                listIrrigacao = $filter('dateFilterIrrigacaoRelatorio')(listIrrigacao, self.cabecalho.data_inicio, self.cabecalho.data_fim);

            for (var i = 0; i < list.length; i++) {
                list[i].VOLUME = 0;
                list[i].FASES = 0;
                for (var j = 0; j < listIrrigacao.length; j++) {
                    parcela = getParcela(listIrrigacao[j].CAD_PARCELA_IDC_CAD_PARCELA);
                    
                    if (parcela.CAD_OUTORGA_IDC_CAD_OUTORGA)
                        if (parcela.CAD_OUTORGA_IDC_CAD_OUTORGA==list[i].IDC_CAD_OUTORGA)
                            list[i].VOLUME+=listIrrigacao[j].VOL_CONSUMIDO;
                }
                for (var j = 0; j < self.FaseOutorga.list.length; j++)
                    if (self.FaseOutorga.list[j].CAD_OUTORGA_IDC_CAD_OUTORGA == list[i].IDC_CAD_OUTORGA)
                        list[i].FASES += 1;
            }
            return list;
        }

        function getParcela(id) {
            for (var i = 0; i < self.Parcela.list.length; i++)
                if (self.Parcela.list[i].IDC_CAD_PARCELA == id)
                    return self.Parcela.list[i];
        };

        function getCultura(id) {
            for (var i = 0; i < self.Cultura.list.length; i++)
                if (self.Cultura.list[i].IDC_CAD_CULTURA == id)
                    return self.Cultura.list[i];
        };


    };


})();