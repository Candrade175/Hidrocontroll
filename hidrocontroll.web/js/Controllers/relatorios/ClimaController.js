(function () {
    angular.module("hidrocontroll.web").controller("ClimaRelatoriosController", climaController).filter("dateFilterClimaRelatorio", dateFilter);

    function climaController(EntitiesService, $mdMedia, $mdDialog, $filter, store, $rootScope, NgTableParams, $element, $timeout, PrintService) {
        var self = this;

        initializeData();

        function initializeData() {
            if (store.get('fazenda'))
                self.codFazendaAtual = store.get('fazenda').IDC_CAD_FAZENDA;
            self.Clima = EntitiesService.clima;
            self.Parcela = EntitiesService.parcela;
            self.Cultura = EntitiesService.cultura;
            self.limparTodosAtributos = limparTodosAtributos;
            self.marcarTodosAtributos = marcarTodosAtributos;
            self.buscarParcelaFazenda = buscarParcelaFazenda;
            self.data = null;
            self.atributosMarcados = [];
            self.iniciaBusca = iniciaBusca;
            self.imprimeTabela = imprimeTabela;



            self.cabecalho = {
                "titulo": "Clima",
                "subtitulo": "Relatório de clima:",

                "data": ["Período",
                         "Todos"]
            };
            self.atributos = [
                           "Temp. máxima",
                           "Temp. mínima",
                           "Temp. média",
                           "Umidade relativa",
                           "Velocidade do vento",
                           "Precipitação total",
                           "Radiação médio 24h"];
            self.cols = [
                { field: "DAT_CLIMA", title: "Data", sortable: "DAT_CLIMA", show: true, type: "valorData" },
                { field: "TMP_CLIMA_MAX", title: "Temp. máxima (ºC)", sortable: "TMP_CLIMA_MAX", show: true, filter: { TMP_CLIMA_MAX: "number" }, type: "valor" },
            { field: "TMP_CLIMA_MIN", title: "Temp. mínima (ºC)", sortable: "TMP_CLIMA_MIN", filter: { TMP_CLIMA_MIN: "number" }, show: true, type: "valor" },
            { field: "TMP_CLIMA_MEDIA", title: "Temp. média (ºC)", sortable: "TMP_CLIMA_MEDIA", filter: { TMP_CLIMA_MEDIA: "number" }, show: true, type: "valor" },
            { field: "VAR_UMIDADE_RELATIVA", title: "Umidade relativa (%)", sortable: "VAR_UMIDADE_RELATIVA", filter: { VAR_UMIDADE_RELATIVA: "number" }, show: true, type: "valor" },
            { field: "VEL_VENTO", title: "Velocidade do vento (m/s)", sortable: "VEL_VENTO", filter: { VEL_VENTO: "number" }, show: true, type: "valor" },
            { field: "VAR_PRECIPITACAO_TOTAL", title: "Precipitação total (mm)", sortable: "VAR_PRECIPITACAO_TOTAL", filter: { VAR_PRECIPITACAO_TOTAL: "number" }, show: true, type: "valor" },
            { field: "VAR_RADIACAO", title: "Radiação média 24h (W/m²)", sortable: "VAR_RADIACAO", filter: { VAR_RADIACAO: "number" }, show: true, type: "valor" }
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
                    PrintService.imprimirTabela('Relatório de Climas');
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

        function atualizaData() {
            self.data = null;
            self.cabecalho.data_inicio = null;
            self.cabecalho.data_fim = null;
            if (self.tipo == self.cabecalho.tipo[0] || self.tipo == self.cabecalho.tipo[1])
                self.cabecalho.data = self.cabecalho.dataCompleto;
            else if (self.tipo == self.cabecalho.tipo[2]) {
                self.cabecalho.data = self.cabecalho.dataPeriodo;
                self.data = "Período";
            }
        }


        function iniciaBusca() {
            for (i = 0; i < self.cols.length; i++)
                self.cols[i].show = false;
            if (self.data != null)
                if ((self.data == 'Período' && self.cabecalho.data_inicio != null && self.cabecalho.data_fim != null) || self.data == 'Todos') {
                    self.list = self.Clima.list;

                    self.list = $filter('filter')(self.list, function (clima) {
                        return clima.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                    });
                    if (self.data=='Período')
                        self.list = $filter('dateFilterClimaRelatorio')(self.list, self.cabecalho.data_inicio, self.cabecalho.data_fim);
                    self.list = $filter('orderBy')(self.list, '-DAT_CLIMA');
                   
                    self.cols[0].show = true;
                    for (j = 0; j < self.atributosMarcados.length; j++) {

                        if (self.atributosMarcados[j] == 'Temp. máxima')
                            self.cols[1].show = true;
                        else if (self.atributosMarcados[j] == 'Temp. mínima')
                            self.cols[2].show = true;
                        else if (self.atributosMarcados[j] == 'Temp. média')
                            self.cols[3].show = true;
                        else if (self.atributosMarcados[j] == 'Umidade relativa')
                            self.cols[4].show = true;
                        else if (self.atributosMarcados[j] == 'Velocidade do vento')
                            self.cols[5].show = true;
                        else if (self.atributosMarcados[j] == 'Precipitação total')
                            self.cols[6].show = true;
                        else if (self.atributosMarcados[j] == 'Radiação médio 24h')
                            self.cols[7].show = true;
                    }
                    self.tableParams = new NgTableParams({}, { dataset: self.list });
                }
        };

        function getParcela(id) {
            for (var i = 0; i < self.Parcela.list.length; i++)
                if (self.Parcela.list[i].IDC_CAD_PARCELA == id) {
                    parcela = self.Parcela.list[i];
                    return self.Parcela.list[i];
                }
        };

        function getCultura(id) {
            for (var i = 0; i < self.Cultura.list.length; i++)
                if (self.Cultura.list[i].IDC_CAD_CULTURA == id)
                    return self.Cultura.list[i];
        };

        function buscarParcelaFazenda(text) {
            var list = $filter('filter')(self.Parcela.list, function (parcela) {
                cultura = getCultura(parcela.CAD_CULTURA_IDC_CAD_CULTURA);
                if (cultura)
                    return cultura.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                else
                    return false;
            });
            list = $filter('filter')(list, text);
            return $filter('orderBy')(list, 'NOM_PARCELA');
        };
    };


})();

function dateFilter() {
    return function (items, from, to) {
        var result = [];
        if (from && to) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].DAT_CLIMA >= from && items[i].DAT_CLIMA <= to) {
                    result.push(items[i]);
                }
            }
        } else {
            return items;
        }
        return result;
    };
};

