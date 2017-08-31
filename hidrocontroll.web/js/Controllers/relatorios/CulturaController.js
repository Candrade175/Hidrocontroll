


(function () {
    angular.module("hidrocontroll.web").controller("CulturaRelatoriosController", manejoController).filter("dateFilterCulturaRelatorio", dateFilter);

    function manejoController(EntitiesService, $mdMedia, $mdDialog, $filter, store, $rootScope, NgTableParams, $element, $timeout, PrintService) {
        var self = this;

        initializeData();

        function initializeData() {
            self.intervalID;
            self.codFazendaAtual = store.get('fazenda').IDC_CAD_FAZENDA;
            self.Manejo = EntitiesService.manejo;
            self.Parcela = EntitiesService.parcela;
            self.Cultura = EntitiesService.cultura;
            self.limparTodosAtributos = limparTodosAtributos;
            self.marcarTodosAtributos = marcarTodosAtributos;
            self.limparTodosParcelas = limparTodosParcelas;
            self.marcarTodosParcelas = marcarTodosParcelas;
            self.buscarParcelaFazenda = buscarParcelaFazenda;
            self.buscarCulturaFazenda = buscarCulturaFazenda;
            self.searchTerm;
            self.clearSearchTerm;
            self.ParcelasFiltro = [];
            self.data = null;
            self.tipo = null;
            self.atributosMarcados = [];
            self.iniciaBusca = iniciaBusca;
            self.tablesParams = [];
            self.culturaFiltro = null;
            self.imprimeTabela = imprimeTabela;

            self.cabecalho = {
                "titulo": "Manejo",
                "subtitulo": "Relatório de manejo:",

                "tipo": ["Por quinzena",
                         "Por mês"],
                "data": ["Período",
                         "Por ciclo"]
            };


            self.atributos = [
                            "Necessidade hídrica (mm)",
                            "Precipitação (mm)",
                            "Irrigação realizada (mm)",
                            "Irrigação desnecessária (mm)",
                            "Tempo irrigado (min)",
                            "ETo",
                            "Estresse Ultrapassado (dias)"
            ];

            self.cols = [
                { field: "DATA", title: "Data", sortable: "DATA", show: true, type: "valor" },
                { field: "VOL_CONSUMO_DIARIO", sortable: "VOL_CONSUMO_DIARIO", filter: { VOL_CONSUMO_DIARIO: "number" }, title: "Necessidade hídrica (mm)", show: false, type: "valor" },
                { field: "VAR_PRECIPITACAO", sortable: "VAR_PRECIPITACAO", filter: { VAR_PRECIPITACAO: "number" }, title: "Precipitação (mm)", show: false, type: "valor" },
                { field: "VOL_IRRIGACAO_REALIZADA", sortable: "VOL_IRRIGACAO_REALIZADA", filter: { VOL_IRRIGACAO_REALIZADA: "number" }, title: "Irrigação realizada (mm)", show: false, type: "valor" },
                { field: "VOL_IRRIGACAO_DESNECESSARIA", filter: { VOL_IRRIGACAO_DESNECESSARIA: "number" }, sortable: "VOL_IRRIGACAO_DESNECESSARIA", title: "Irrigação desnecessária (mm)", show: false, type: "valor" },
                { field: 'TMO_IRRIGADO_PIVO', sortable: "TMO_IRRIGADO_PIVO", filter: { TMO_IRRIGADO_PIVO: "number" }, title: "Tempo irrigado (min)", show: false, type: "valor" },
                { field: 'TMO_IRRIGADO_GOTEJO', sortable: "TMO_IRRIGADO_GOTEJO", filter: { TMO_IRRIGADO_GOTEJO: "number" }, title: "Tempo irrigado (min)", show: false, type: "valor" },
                { field: "VAR_ETO", sortable: "VAR_ETO", filter: { VAR_ETO: "number" }, title: "ETo", show: false, type: "valor" },
                { field: "VAR_EXTRESSE_ULTRAPASSADO", sortable: "VAR_EXTRESSE_ULTRAPASSADO", filter: { VAR_EXTRESSE_ULTRAPASSADO: "number" }, title: "Estresse Ultrapassado (dias)", show: false, type: "valor" }
            ];

        };

        function imprimeTabela(index, NomeParcela) {
            if (self.lists[index]) {
                self.tablesParams[index] = new NgTableParams({ count: self.lists[index].length }, { dataset: self.lists[index] });
                $timeout(function () {
                    PrintService.imprimirTabelaRelatorio(NomeParcela, index);
                    self.tableParams = new NgTableParams({}, { dataset: self.list });
                });
                self.tablesParams[index] = new NgTableParams({}, { dataset: self.lists[index] });
            }
        };


        function limparTodosAtributos() {
            self.atributosMarcados = [];
        };

        function marcarTodosAtributos() {
            self.atributosMarcados = self.atributos;
        };

        function limparTodosParcelas() {
            self.ParcelasFiltro = [];
        };

        function marcarTodosParcelas() {
            self.ParcelasFiltro = buscarParcelaFazenda(self.searchTerm);
        };

        self.clearSearchTerm = function () {
            self.searchTerm = '';
        };

        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });


        function iniciaBusca() {
            self.tablesParams = [];
            self.nomesParcelas = [];
            self.lists = [];
            for (i = 1; i < self.cols.length; i++)
                self.cols[i].show = false;
            if (self.Manejo.list.length * self.Cultura.list.length * self.Parcela.list.length) {
                clearInterval(self.intervalID);
            }
            if (self.atributosMarcados.length * self.ParcelasFiltro.length != 0 && self.tipo != null && self.data != null) {
                if ((self.data == 'Período' && self.cabecalho.data_inicio != null && self.cabecalho.data_fim != null) || self.data == 'Por ciclo') {

                    for (var i = 0; i < self.ParcelasFiltro.length; i++) {
                        self.cols[5].show = false;
                        self.cols[6].show = false;
                        list = self.Manejo.list;

                        list = $filter('filter')(list, function (manejo) {
                            return self.ParcelasFiltro[i].IDC_CAD_PARCELA == manejo.CAD_PARCELA_IDC_CAD_PARCELA;
                        });

                        list = $filter('orderBy')(list, '-DAT_MANEJO');

                        if (self.data == 'Período')
                            list = $filter('dateFilterCulturaRelatorio')(list, self.cabecalho.data_inicio, self.cabecalho.data_fim);

                        if (self.tipo == 'Por mês')
                            list = somaMeses(list);
                        else if (self.tipo == 'Por quinzena') 
                            list = somaQuinzenas(list);

                        for (j = 0; j < self.atributosMarcados.length; j++) {

                            if (self.atributosMarcados[j] == self.cols[1].title)
                                self.cols[1].show = true;
                            else if (self.atributosMarcados[j] == self.cols[2].title)
                                self.cols[2].show = true;
                            else if (self.atributosMarcados[j] == self.cols[3].title)
                                self.cols[3].show = true;
                            else if (self.atributosMarcados[j] == self.cols[4].title)
                                self.cols[4].show = true;
                            else if (self.atributosMarcados[j] == self.cols[5].title)
                                if (self.ParcelasFiltro[i].CAD_GOTEJADOR_IDC_CAD_GOTEJADOR)
                                    self.cols[5].show = true;
                                else
                                    self.cols[6].show = true;
                            else if (self.atributosMarcados[j] == self.cols[7].title)
                                self.cols[7].show = true;
                            else if (self.atributosMarcados[j] == self.cols[8].title)
                                self.cols[8].show = true;
                        }

                        self.tablesParams.push(new NgTableParams({}, {
                            dataset: list
                        }));
                        self.nomesParcelas.push(self.ParcelasFiltro[i].NOM_PARCELA);
                        self.lists.push(list);
                    }

                }
            }
        };

        function somaManejos(m1, m2) {
            m1.VOL_CONSUMO_DIARIO += m2.VOL_CONSUMO_DIARIO;
            m1.VAR_PRECIPITACAO += m2.VAR_PRECIPITACAO;
            m1.VOL_IRRIGACAO_NECESSARIA += m2.VOL_IRRIGACAO_NECESSARIA;
            m1.VOL_IRRIGACAO_REALIZADA += m2.VOL_IRRIGACAO_REALIZADA;
            m1.VAR_ETO += m2.VAR_ETO;
            if (m1.TMO_IRRIGADO_PIVO)
                m1.TMO_IRRIGADO_PIVO += m2.TMO_IRRIGADO_PIVO;
            else if (m1.TMO_IRRIGADO_GOTEJO)
                m1.TMO_IRRIGADO_GOTEJO += m2.TMO_IRRIGADO_GOTEJO;
            m1.VOL_IRRIGACAO_DESNECESSARIA += m2.VOL_IRRIGACAO_DESNECESSARIA;
            m1.VAR_EXTRESSE_ULTRAPASSADO += m2.VAR_EXTRESSE_ULTRAPASSADO;
            return m1;
        }

        function somaMeses(list) {
            if (list && list.length > 0) { 
                list[0].DATA = (list[0].DAT_MANEJO.getMonth() + 1) + '/' + list[0].DAT_MANEJO.getFullYear();
                for (i = 0; i < list.length - 1; i++) {
                    if (list[i].DAT_MANEJO.getMonth() == list[i + 1].DAT_MANEJO.getMonth() && list[i].DAT_MANEJO.getFullYear() == list[i + 1].DAT_MANEJO.getFullYear()) {
                        list[i].DATA = (list[i].DAT_MANEJO.getMonth() + 1) + '/' + list[i].DAT_MANEJO.getFullYear();
                        somaManejos(list[i], list[i + 1]);
                        list.splice(i + 1, 1);
                    }
                }
            }
            return list;
        }


        function somaQuinzenas(list) {
            if (list && list.length > 0) {
                if (list[0].DAT_MANEJO.getDate() <= 15)
                    list[0].DATA = '1ª/' + (list[0].DAT_MANEJO.getMonth() + 1) + '/' + list[0].DAT_MANEJO.getFullYear();
                else
                    list[0].DATA = '2ª/' + (list[0].DAT_MANEJO.getMonth() + 1) + '/' + list[0].DAT_MANEJO.getFullYear();
                for (i = 0; i < list.length - 1; i++) {
                   
         
                    if (list[i].DAT_MANEJO.getMonth() == list[i + 1].DAT_MANEJO.getMonth() && list[i].DAT_MANEJO.getFullYear() == list[i + 1].DAT_MANEJO.getFullYear()) {

                        if (list[i].DAT_MANEJO.getDate() <= 15) {
                            somaManejos(list[i], list[i + 1]);
                            list.splice(i + 1, 1);
                            list[i].DATA = '1ª/' + (list[i].DAT_MANEJO.getMonth() + 1) + '/' + list[i].DAT_MANEJO.getFullYear();

                        } else if (list[i].DAT_MANEJO.getDate() > 15) {
                            somaManejos(list[i], list[i + 1]);
                            list.splice(i + 1, 1);
                            list[i].DATA = '2ª/' + (list[i].DAT_MANEJO.getMonth() + 1) + '/' + list[i].DAT_MANEJO.getFullYear();
                        }
                    }
                }
            }
            return list;
        }

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
                if (self.culturaFiltro)
                    return self.culturaFiltro.IDC_CAD_CULTURA == parcela.CAD_CULTURA_IDC_CAD_CULTURA;
                return false;
            });
            list = $filter('filter')(list, text);
            return $filter('orderBy')(list, 'NOM_PARCELA');
        };

        function buscarCulturaFazenda(text) {
            var list = $filter('filter')(self.Cultura.list, function (cultura) {
                return cultura.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
            });
            list = $filter('filter')(list, text);
            return $filter('orderBy')(list, 'NOM_CULTURA');
        };
    };


})();

function dateFilter() {
    return function (items, from, to) {
        var result = [];
        if (from && to) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].DAT_MANEJO >= from && items[i].DAT_MANEJO <= to) {
                    result.push(items[i]);
                }
            }
        } else {
            return items;
        }
        return result;
    };
};