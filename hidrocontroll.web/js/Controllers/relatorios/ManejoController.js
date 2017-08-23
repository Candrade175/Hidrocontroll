(function () {
    angular.module("hidrocontroll.web").controller("ManejoRelatoriosController", manejoController).filter("dateFilterManejoRelatorio", dateFilter);

    function manejoController(EntitiesService, $mdMedia, $mdDialog, $filter, store, $rootScope, NgTableParams, $element) {
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
            self.alteraAtributos = alteraAtributos;
            self.searchTerm;
            self.clearSearchTerm;
            self.ParcelasFiltro = [];
            self.atualizaData = atualizaData;
            self.data = null;
            self.tipo = null;
            self.atributosMarcados = [];
            self.iniciaBusca = iniciaBusca;
            self.tablesParams = [];

            self.cabecalho = {
                "titulo": "Manejo",
                "subtitulo": "Relatório de manejo:",

                "tipo": ["Detalhado",
                         "Por mês",
                         "Por período"],
                "data": [],
                "dataCompleto": ["Período",
                         "Por ciclo"],
                "dataPeriodo": ["Período"]
            };
            self.atributos;
            self.atributosCompletos = ["Necessidade hídrica",
                                    "Precipitação",
                                    "Irrigação necessária",
                                    "Irrigação realizada",
                                    "Tempo necessário",
                                    "Percentímetro",
                                    "Idade da cultura",
                                    "Irrigação desnecessária",
                                    "Tempo irrigado",
                                    "ETo",
                                    "Kc",
                                    "Kl",
                                    "Ks"];
            self.atributosSomatorio = ["Necessidade hídrica",
                                    "Precipitação",
                                    "Irrigação realizada",
                                    "Irrigação desnecessária",
                                    "Tempo irrigado",
                                    "ETo",
                                    "Estresse Ultrapassado"

            ];

            self.cols = [
                { field: "DAT_MANEJO", title: "Data", sortable: "DAT_MANEJO", show: false, type: "valorData" },
                { valor: '', title: "Período", show: false, type: "valorIntervalo" },
                { field: 'DAT_MANEJO', title: "Mês/Ano", show: false, sortable: "DAT_MANEJO", type: "valorMes" },
                { field: "VOL_CONSUMO_DIARIO", title: "Necessidade hídrica diária (mm)", show: false, type: "valor" },
                { field: "VAR_PRECIPITACAO", title: "Precipitação (mm)", show: false, type: "valor" },
                { field: "VOL_IRRIGACAO_NECESSARIA", title: "Irrigação necessária (mm)", show: false, type: "valor" },
                { field: "VOL_IRRIGACAO_REALIZADA", title: "Irrigação realizada (mm)", show: false, type: "valor" },
                { field: "TMO_MANEJO", title: "Tempo necessário", show: false, type: "valor" },
                { field: 'TMO_IRRIGADO_PIVO', title: "Tempo irrigado (min)", show: false, type: "valor" },
                { field: 'TMO_IRRIGADO_GOTEJO', title: "Tempo irrigado (min)", show: false, type: "valor" },
                { field: "PER_PERCENTIMETRO", title: "Percentímetro (%)", show: false, type: "valor" },
                { field: "VAR_IDADE_PARCELA", title: "Idade da cultura (dias)", show: false, type: "valor" },
                { field: "VAR_ETO", title: "ETo", show: false, type: "valor" },
                { field: "VAR_KC", title: "Kc", show: false, type: "valor" },
                { field: "VAR_KL", title: "Kl", show: false, type: "valor" },
                { field: "VAR_KS", title: "Ks", show: false, type: "valor" },
                { field: "VOL_IRRIGACAO_DESNECESSARIA", title: "Irrigação desnecessária (mm)", show: false, type: "valor" },

                { field: "VAR_EXTRESSE_ULTRAPASSADO", title: "Estresse Ultrapassado (dias)", show: false, type: "valor" }
            ];

        }
        function limparTodosAtributos() {
            self.atributosMarcados = [];
        };

        function marcarTodosAtributos() {
            self.atributosMarcados = self.atributos;
        };

        function limparTodosParcelas() {
            self.ParcelasFiltro = [];
        };

        function alteraAtributos() {
            if (self.tipo == 'Detalhado') {
                self.atributos= self.atributosCompletos;
            } else {
                self.atributos = self.atributosSomatorio;
            }
        }
        function marcarTodosParcelas() {
            self.ParcelasFiltro = buscarParcelaFazenda(self.searchTerm);
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
            buscar();
        }

        function buscar() {
            self.tablesParams = [];
            self.nomesParcelas = [];
            for (i = 0; i < self.cols.length; i++)
                self.cols[i].show = false;
            if (self.Manejo.list.length * self.Cultura.list.length * self.Parcela.list.length) {
                clearInterval(self.intervalID);
            }
            if (self.atributosMarcados.length * self.ParcelasFiltro.length != 0 && self.tipo != null && self.data != null) {
                if ((self.data == 'Período' && self.cabecalho.data_inicio != null && self.cabecalho.data_fim != null) || self.data == 'Por ciclo') {

                    for (var i = 0; i < self.ParcelasFiltro.length; i++) {


                        var list = self.Manejo.list;

                        list = $filter('filter')(list, function (manejo) {
                            return self.ParcelasFiltro[i].IDC_CAD_PARCELA == manejo.CAD_PARCELA_IDC_CAD_PARCELA;
                        });

                        list = $filter('orderBy')(list, '-DAT_MANEJO');

                        if (self.data == 'Período') {
                            list = $filter('dateFilterManejoRelatorio')(list, self.cabecalho.data_inicio, self.cabecalho.data_fim);
                            if (self.tipo == 'Detalhado') {
                                self.cols[0].show = true;
                                list = adicionaLinhaTotal(list, false);
                            } else if (self.tipo == 'Por mês') {
                                self.cols[2].show = true;
                                list = somaMeses(list);
                            } else if (self.tipo == 'Por período') {

                                inicio = self.cabecalho.data_inicio.getDate() + '/' + self.cabecalho.data_inicio.getMonth() + '/' + self.cabecalho.data_inicio.getFullYear();
                                fim = self.cabecalho.data_fim.getDate() + '/' + self.cabecalho.data_fim.getMonth() + '/' + self.cabecalho.data_fim.getFullYear();
                                intervalo = inicio + ' à ' + fim;
                                self.cols[1].show = true;
                                self.cols[1].valor = intervalo;
                                list = adicionaLinhaTotal(list, true);

                            }
                        } else if (self.data == 'Por ciclo') {

                        }



                        for (j = 0; j < self.atributosMarcados.length; j++) {

                            if (self.atributosMarcados[j] == 'Necessidade hídrica')
                                self.cols[3].show = true;
                            else if (self.atributosMarcados[j] == 'Precipitação')
                                self.cols[4].show = true;
                            else if (self.atributosMarcados[j] == 'Irrigação necessária')
                                self.cols[5].show = true;
                            else if (self.atributosMarcados[j] == 'Irrigação realizada')
                                self.cols[6].show = true;
                            else if (self.atributosMarcados[j] == 'Tempo necessário')
                                self.cols[7].show = true;
                            else if (self.atributosMarcados[j] == 'Tempo irrigado')
                                if (self.ParcelasFiltro[i].CAD_GOTEJADOR_IDC_CAD_GOTEJADOR)
                                    self.cols[8].show = true;
                                else
                                    self.cols[9].show = true;
                            else if (self.atributosMarcados[j] == 'Percentímetro')
                                self.cols[10].show = true;
                            else if (self.atributosMarcados[j] == 'Idade da cultura')
                                self.cols[11].show = true;
                            else if (self.atributosMarcados[j] == 'ETo')
                                self.cols[12].show = true;
                            else if (self.atributosMarcados[j] == 'Kc')
                                self.cols[13].show = true;
                            else if (self.atributosMarcados[j] == 'Kl')
                                self.cols[14].show = true;
                            else if (self.atributosMarcados[j] == 'Ks')
                                self.cols[15].show = true;
                            else if (self.atributosMarcados[j] == 'Irrigação desnecessária')
                                self.cols[16].show = true;
                        }

                        self.tablesParams.push(new NgTableParams({}, { dataset: list }));
                        self.nomesParcelas.push(self.ParcelasFiltro[i].NOM_PARCELA);
                    }
                    //  clearInterval(self.intervalID);

                    $rootScope.$digest();

                }
            }
        };
        var parcela = null;

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
                for (i = 0; i < list.length - 1; i++) {
                    if (list[i].DAT_MANEJO.getMonth() == list[i + 1].DAT_MANEJO.getMonth() && list[i].DAT_MANEJO.getFullYear() == list[i + 1].DAT_MANEJO.getFullYear()) {
                        somaManejos(list[i], list[i + 1]);
                        list.splice(i + 1, 1);
                    }
                }
            }
            return list;
        }

        function adicionaLinhaTotal(list, deletarLinhas) {
            if (list && list.length > 0) {
                total = jQuery.extend({}, list[0]);
                for (j = 1; j < list.length; j++) {
                    total = somaManejos(total, list[j]);
                }
                if (deletarLinhas)
                    return [total];
                else {
                    total.DAT_MANEJO = "Total";
                    list.push(total);
                    return list;
                }
            }
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