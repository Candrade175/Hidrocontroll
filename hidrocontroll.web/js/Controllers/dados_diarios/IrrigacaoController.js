

(function () {
    angular.module("hidrocontroll.web").controller("IrrigacaoDadosDiariosController", irrigacaoController).filter("dateFilterIrrigacao", dateFilter);

    function irrigacaoController(EntitiesService, $mdMedia, $mdDialog, $filter, store, $rootScope, NgTableParams, $element, DateTimeService,$timeout,PrintService) {
        var self = this;

        initializeData();

        var intervalID = window.setInterval(refresh, 500);

        var success = $mdDialog.alert()
               .title('Sucesso')
               .textContent('A operação foi realizada com sucesso!')
               .ok('Fechar');

        var error = $mdDialog.alert()
               .title('Falha')
               .textContent('Operação não pode ser realizada!')
               .ok('Fechar');

        function initializeData() {
            if (store.get('fazenda'))
                self.codFazendaAtual = store.get('fazenda').IDC_CAD_FAZENDA;
            self.Irrigacao = EntitiesService.irrigacao;
            self.Parcela = EntitiesService.parcela;
            self.Cultura = EntitiesService.cultura;
            self.Motobomba = EntitiesService.motobomba;
            self.PivoCentral = EntitiesService.pivoCentral;
            self.Gotejador = EntitiesService.gotejador;
            self.Reservatorio = EntitiesService.reservatorio;
            self.Tarifa = EntitiesService.tarifa;
            self.$mdMedia = $mdMedia;
            self.excluir = excluir;
            self.create = create;
            self.update = update;
            self.printData = printData;
            self.showhints;
            self.getParcela = getParcela;
            self.getReservatorio = getReservatorio;
            self.getMotobomba = getMotobomba;
            self.refresh = refresh;
            self.searchTerm;
            self.clearSearchTerm;
            self.ParcelasFiltro = [];
            self.buscarParcelaFazenda = buscarParcelaFazenda;


            self.cols = [
            {
                field: "DAT_IRRIGACAO", title: "Data", sortable: "DAT_IRRIGACAO", isDate: true, show: true, type: "valor"
            },
            { field: "CAD_PARCELA_IDC_CAD_PARCELA", title: "Parcela", show: true, type: "valorCompostoParcela" },
            { field: "CAD_MOTOBOMBA_IDC_CAD_MOTOBOMBA", title: "Motobomba", show: true, type: "valorCompostoMotobomba" },
            { field: "CAD_RESERVATORIO_IDC_CAD_RESERVATORIO", title: "Reservatório", show: true, type: "valorCompostoReservatorio" },
            { field: "TMO_IRRIGACAO_PIVO", title: "Irrigação pivô (%)", show: true, type: "valor" },
            { field: "TMO_IRRIGACAO_GOTEJO", title: "Irrigação gotejo (minutos)", show: true, type: "valor" },
            { field: "TMO_IRRIGACAO_INICIO", title: "Início da irrigação (horas)", isTime: true, show: true, type: "valor" },
            { field: "VOL_IRRIGACAO", title: "Irrigação (mm)", show: true, type: "valor" },
            { field: "VOL_CONSUMIDO", title: "Volume consumido (m³)", show: true, type: "valor" },
            { field: "VAR_VALOR_ENERGETICO", title: "Valor energético (R$)", show: true, type: "valor" },
            { field: "VAR_FERTIRRIGACAO", title: "Fertirrigação", show: true, type: "valorBool" },

            { title: "Editar", show: true, type: "comandoEditar", class: 'width-70-px' },
             { title: "Deletar", show: true, type: "comandoDeletar", class: 'width-70-px' }
            ];

            self.tabela = {
                "titulo": "Irrigação",
                "subtitulo": "Dados diários de irrigação:"
            };
            self.tabela.data_inicio = null;
            self.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        };


        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });


        function refresh() {
            if (self.Cultura.list.length * self.Irrigacao.list.length * self.Parcela.list.length * self.Motobomba.list.length * self.Reservatorio.list.length != 0) {
                clearInterval(intervalID);
            }
            try {
                self.list = [];

                self.list = $filter('filter')(self.Irrigacao.list, function (irrigacao) {
                    return getCultura(getParcela(irrigacao.CAD_PARCELA_IDC_CAD_PARCELA).CAD_CULTURA_IDC_CAD_CULTURA).CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;

                });

                self.list = $filter('dateFilterIrrigacao')(self.list, self.tabela.data_inicio, self.tabela.data_fim);
                if (self.ParcelasFiltro.length > 0) {
                    self.list = $filter('filter')(self.list, function (irrigacao) {
                        for (i = 0; i < self.ParcelasFiltro.length; i++)
                            if (irrigacao.CAD_PARCELA_IDC_CAD_PARCELA == self.ParcelasFiltro[i].IDC_CAD_PARCELA)
                                return true;
                        return false;
                    });
                }
                self.list = $filter('orderBy')(self.list, '-DAT_IRRIGACAO');


                self.tableParams = new NgTableParams({}, { dataset: self.list });
                $rootScope.$digest();
            } catch (e) {
            }
        }


        function printData() {
            if (self.list) {
                self.tableParams = new NgTableParams({ count: self.list.length }, { dataset: self.list });
                $timeout(function () {
                    PrintService.imprimirTabela('Irrigações');
                    self.tableParams = new NgTableParams({}, { dataset: self.list });
                });
            }
        };

        function create(ev) {
            self.Irrigacao.clear();
            update(ev);
        };

        function update(ev, item) {
            var method = "$save";


            if (item) {
                item.$select();
                method = "$update";
            };

            showDialog(ev).then(function (resource) {
                console.log(method);
                console.log(resource);
                resource[method](
                    {},
                    function () { //Função de sucesso: objeto foi inserido
                        $mdDialog
                            .show(success).finally(function () {
                                if (resource.IDC_CAD_IRRIGACAO)
                                    for (var i = 0; i < self.Irrigacao.list.length; i++)
                                        if (self.Irrigacao.list[i].IDC_CAD_IRRIGACAO == resource.IDC_CAD_IRRIGACAO)
                                            self.Irrigacao.list[i] = resource;
                                refresh();
                            });
                    },
                    function () { //Função de erro: objeto não pode ser inserido
                        $mdDialog.show(error);
                    }
                );
            });
        };

        function excluir(ev, item) {


            var confirm = $mdDialog.confirm()
                  .title('Deseja realmente excluir o registro do dia ' + item.DAT_IRRIGACAO.getDate() + "/" + (item.DAT_IRRIGACAO.getMonth() + 1) + "/" + item.DAT_IRRIGACAO.getFullYear() + ' parcela ' + getParcela(item.CAD_PARCELA_IDC_CAD_PARCELA).NOM_PARCELA + '?')
                  .textContent('Após a exclusão a operação não poderá ser desfeita.')
                  .ariaLabel('Exclusão de Registro')
                  .targetEvent(ev)
                  .ok('Sim')
                  .cancel('Não');

            //Shows the dialog to the user
            $mdDialog.show(confirm).then(function () {

                //If the interaction completes successfuly 
                //the resource is deleted
                console.log(item);
                item.$delete(
                    {},
                    function () {
                        $mdDialog
                            .show(success).finally(function () {
                                refresh();
                            });
                    },
                    function () {
                        $mdDialog.show(error);
                    }
                );
            });
        };

        function showDialog(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            return $mdDialog.show({
                controller: dialogController,
                templateUrl: 'pages/dados_diarios/dialogs/criar_irrigacao.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        function dialogController($scope, $mdDialog) {

            $scope.selected = jQuery.extend({}, self.Irrigacao.selected);

            $scope.isReservatorioVazio = false;
            $scope.gotejador_max = 900;
            $scope.gotejador_min = 0;
            $scope.pivo_max = 100;
            $scope.pivo_min = 0;

            var data = new Date(0);

            if ($scope.selected.TMO_IRRIGACAO_INICIO) {
                var vetor = $scope.selected.TMO_IRRIGACAO_INICIO.split(':');
                data.setHours(vetor[0]);
                data.setMinutes(vetor[1]);
                $scope.selected.TMO_IRRIGACAO_INICIO = data;
            }

            if ($scope.selected.VAR_FERTIRRIGACAO)
                $scope.selected.VAR_FERTIRRIGACAO = true;
            $scope.selected.CAD_PARCELA = getParcela($scope.selected.CAD_PARCELA_IDC_CAD_PARCELA);
            $scope.selected.CAD_MOTOBOMBA = getMotobomba($scope.selected.CAD_MOTOBOMBA_IDC_CAD_MOTOBOMBA);
            $scope.selected.CAD_RESERVATORIO = getReservatorio($scope.selected.CAD_RESERVATORIO_IDC_CAD_RESERVATORIO);

            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.calculaDados = function () {
                if  ($scope.selected.CAD_PARCELA )
                    if (!$scope.selected.CAD_PARCELA.CAD_GOTEJADOR_IDC_CAD_GOTEJADOR)
                        $scope.selected.TMO_IRRIGACAO_GOTEJO = null;
                    else if (!$scope.selected.CAD_PARCELA.CAD_PIVO_CENTRAL_IDC_CAD_PIVO_CENTRAL)
                        $scope.selected.TMO_IRRIGACAO_PIVO = null;
                if ($scope.selected.CAD_PARCELA && (!$scope.selected.CAD_PARCELA.CAD_GOTEJADOR_IDC_CAD_GOTEJADOR || ($scope.selected.TMO_IRRIGACAO_GOTEJO && $scope.selected.CAD_PARCELA.CAD_GOTEJADOR_IDC_CAD_GOTEJADOR)) &&
                    (!$scope.selected.CAD_PARCELA.CAD_PIVO_CENTRAL_IDC_CAD_PIVO_CENTRAL || ($scope.selected.TMO_IRRIGACAO_PIVO && $scope.selected.CAD_PARCELA.CAD_PIVO_CENTRAL_IDC_CAD_PIVO_CENTRAL)) &&
                    $scope.selected.TMO_IRRIGACAO_INICIO) {
                    pivo = getPivoCentral($scope.selected.CAD_PARCELA.CAD_PIVO_CENTRAL_IDC_CAD_PIVO_CENTRAL);
                    gotejador = getGotejador($scope.selected.CAD_PARCELA.CAD_GOTEJADOR_IDC_CAD_GOTEJADOR);
                    $scope.selected.VOL_CONSUMIDO = 0;
                    $scope.selected.VAR_VALOR_ENERGETICO = 0;

                    if (pivo) {
                        //quantidade
                        $scope.selected.VOL_IRRIGACAO = (100 * pivo.VAR_LAMINA) / $scope.selected.TMO_IRRIGACAO_PIVO;

                        // volume
                        $scope.selected.VOL_CONSUMIDO = ($scope.selected.CAD_PARCELA.ARE_PARCELA * $scope.selected.VOL_IRRIGACAO * 10000) / 1000;

                        //consumo energetico
                        if ($scope.selected.VOL_IRRIGACAO) {
                            perimetro = 2 * Math.PI * (pivo.DIS_RAIO_TOTAL - pivo.VAR_VAO_BALANCO);
                            ttotal = perimetro / (pivo.VEL_100_PIVO * ($scope.selected.TMO_IRRIGACAO_PIVO / 100));
                            percentimetro = ((100 * pivo.VAR_LAMINA) / $scope.selected.VOL_IRRIGACAO);
                            temponecessario = ((100 * ttotal) / percentimetro);
                            horaPivo = DateTimeService.decimalEmHoras(temponecessario);
                            $scope.selected.VAR_VALOR_ENERGETICO = calcularConsumoEnergeticoMotobomba(horaPivo, $scope.selected.CAD_PARCELA, $scope.selected);
                        }

                    } else if (gotejador) {
                        //quantidade
                        $scope.selected.VOL_IRRIGACAO = (gotejador.VAR_LAMINA * $scope.selected.TMO_IRRIGACAO_GOTEJO) / 60;

                        // volume         
                        $scope.selected.VOL_CONSUMIDO = (((((100 / gotejador.VAR_ESPACAMENTO_LINHAS_LATERAIS) * (100 * (1 / gotejador.VAR_ESPACAMENTO_GOTEJADORES))) * gotejador.VAZ_GOTEJADOR) * $scope.selected.CAD_PARCELA.ARE_PARCELA) / 1000) * $scope.selected.TMO_IRRIGACAO_GOTEJO / 60;


                        //consumo energetico
                        horaGotejador = DateTimeService.converterMinutosEmHoras($scope.selected.TMO_IRRIGACAO_GOTEJO);
                        $scope.selected.VAR_VALOR_ENERGETICO = calcularConsumoEnergeticoMotobomba(horaGotejador, $scope.selected.CAD_PARCELA, $scope.selected);

                    }

                    if ($scope.selected.CAD_RESERVATORIO) {
                        if ($scope.selected.CAD_RESERVATORIO.VOL_ATUAL >= $scope.selected.VOL_CONSUMIDO)
                            $scope.selected.VAR_VALOR_ENERGETICO += ($scope.selected.CAD_RESERVATORIO.VAR_VALOR * $scope.selected.VOL_CONSUMIDO);
                        else {
                            $scope.isReservatorioVazio = true;
                        }
                    }

                    $scope.selected.VOL_IRRIGACAO = $scope.selected.VOL_IRRIGACAO.toFixed(2);
                    $scope.selected.VOL_CONSUMIDO = $scope.selected.VOL_CONSUMIDO.toFixed(2);
                    $scope.selected.VAR_VALOR_ENERGETICO = $scope.selected.VAR_VALOR_ENERGETICO.toFixed(2);
                }

            };

            $scope.salvar = function (irrigacao) {

                if (typeof $scope.selected.TMO_IRRIGACAO_INICIO !== 'string')
                    $scope.selected.TMO_IRRIGACAO_INICIO = $scope.selected.TMO_IRRIGACAO_INICIO.getHours() + ":" + $scope.selected.TMO_IRRIGACAO_INICIO.getMinutes();

                if ($scope.selected.CAD_PARCELA) {

                    if (!irrigacaoForm.classList.contains("ng-invalid")) {

                        $scope.selected.CAD_PARCELA = null;
                        $scope.selected.CAD_MOTOBOMBA = null;
                        $scope.selected.CAD_RESERVATORIO = null;
                        $mdDialog.hide(irrigacao);
                    }
                }
                else {
                    $scope.isParcelaInvalida = true;
                    document.getElementById("autocomplete-container-parcela").classList.add('md-input-invalid');
                }
            };

            $scope.getMatchesReservatorio = function (text) {
                var list = $filter('filter')(self.Reservatorio.list, function (reservatorio) {
                    return reservatorio.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });
                list = $filter('filter')(list, text);
                return $filter('orderBy')(list, 'NOM_RESERVATORIO');

            };

            $scope.onchangeSelectedReservatorio = function (reservatorio) {
                try {
                    $scope.isReservatorioVazio = false;
                    $scope.selected.CAD_RESERVATORIO_IDC_CAD_RESERVATORIO = reservatorio.IDC_CAD_RESERVATORIO;
                    $scope.isReservatorioInvalido = false;
                    document.getElementById("autocomplete-container-reservatorio").classList.remove('md-input-invalid');
                    $scope.calculaDados();
                } catch (err) {
                    //Tratamento de exceção
                }
            };

            $scope.getMatchesMotobomba = function (text) {
                var list = $filter('filter')(self.Motobomba.list, function (motobomba) {
                    return motobomba.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });
                list = $filter('filter')(list, text);
                return $filter('orderBy')(list, 'NOM_MOTOBOMBA');

            };

            $scope.onchangeSelectedMotobomba = function (motobomba) {
                try {
                    $scope.selected.CAD_MOTOBOMBA_IDC_CAD_MOTOBOMBA = motobomba.IDC_CAD_MOTOBOMBA;
                    $scope.isMotobombaInvalida = false;
                    $scope.calculaDados();
                    document.getElementById("autocomplete-container-motobomba").classList.remove('md-input-invalid');
                } catch (err) {
                    //Tratamento de exceção
                }
            };


            $scope.getMatchesParcela = function (text) {
                return self.buscarParcelaFazenda(text);

            };

            $scope.onchangeSelectedParcela = function (parcela) {
                try {
                    $scope.selected.CAD_PARCELA_IDC_CAD_PARCELA = parcela.IDC_CAD_PARCELA;
                    $scope.isParcelaInvalida = false;
                    $scope.selected.VOL_IRRIGACAO = null;
                    $scope.selected.VOL_CONSUMIDO = null;
                    $scope.selected.VAR_VALOR_ENERGETICO = null;
                    $scope.calculaDados();
                    document.getElementById("autocomplete-container-parcela").classList.remove('md-input-invalid');

                } catch (err) {
                    //Tratamento de exceção
                }
            };
        };


        function calcularConsumoEnergeticoMotobomba(tempoEmHora, parcela, irrigacao) {
            motobomba = getMotobomba(irrigacao.CAD_MOTOBOMBA_IDC_CAD_MOTOBOMBA);
            consumoEnergetico = 0;
            if (motobomba) {

                var dataInicio;
                var dataFim;

                if (typeof irrigacao.TMO_IRRIGACAO_INICIO === 'string') {
                    dataInicio = new Date(0);
                    var vetor = irrigacao.TMO_IRRIGACAO_INICIO.split(':');
                    dataInicio.setHours(vetor[0]);
                    dataInicio.setMinutes(vetor[1]);
                } else {
                    dataInicio = irrigacao.TMO_IRRIGACAO_INICIO;
                }
                dataFim = clone( dataInicio);
                var vetor = tempoEmHora.split(':');
               dataFim= dataFim.addHours(vetor[0]);
               dataFim = dataFim.addMinutes(vetor[1]);

                var horasInicio = [];
                var horasFim = [];
                if (dataFim.getDay() == dataInicio.getDay()) {
                    horasInicio.push(dataInicio.getHours() + ':' + dataInicio.getMinutes());
                    horasFim.push(dataFim.getHours() + ':' + dataFim.getMinutes());
                } else {
                    diferencaDias = dataFim.getDay() - dataInicio.getDay();
                    while (diferencaDias > 1) {
                        horasInicio.push('00:00');
                        horasFim.push('23:59');
                        diferencaDias--;
                    }
                    horasInicio.push(dataInicio.getHours() + ':' + dataInicio.getMinutes());
                    horasFim.push('23:59');

                    horasInicio.push('00:00');
                    horasFim.push(dataFim.getHours() + ':' + dataFim.getMinutes());
                }
                for (var i = 0; i < self.Tarifa.list.length; i++) {
                    for (var j = 0; j < horasFim.length; j++) {
                        if (DateTimeService.verificaHoraMenorIgual(horasInicio[j], self.Tarifa.list[i].HOR_INICIO_TARIFA)) {
                            if (DateTimeService.verificaHoraMaiorIgual(horasFim[j], self.Tarifa.list[i].HOR_FIM_TARIFA))
                                consumoEnergetico += motobomba.VAR_CONSUMO * self.Tarifa.list[i].VAL_TARIFA * DateTimeService.horasEmDecimal(DateTimeService.subtraiHora(self.Tarifa.list[i].HOR_FIM_TARIFA, self.Tarifa.list[i].HOR_INICIO_TARIFA));
                            else if (DateTimeService.verificaHoraMenorIgual(horasFim[j], self.Tarifa.list[i].HOR_FIM_TARIFA) && DateTimeService.verificaHoraMaiorIgual(horasFim[j], self.Tarifa.list[i].HOR_INICIO_TARIFA))
                                consumoEnergetico += motobomba.VAR_CONSUMO * self.Tarifa.list[i].VAL_TARIFA * DateTimeService.horasEmDecimal(DateTimeService.subtraiHora(horasFim[j], self.Tarifa.list[i].HOR_INICIO_TARIFA));
                        } else {
                            if (DateTimeService.verificaHoraMenorIgual(horasFim[j], self.Tarifa.list[i].HOR_FIM_TARIFA))
                                consumoEnergetico += motobomba.VAR_CONSUMO * self.Tarifa.list[i].VAL_TARIFA * DateTimeService.horasEmDecimal(DateTimeService.subtraiHora(horasFim[j], horasInicio[j]));
                            else if (DateTimeService.verificaHoraMaiorIgual(horasFim[j], self.Tarifa.list[i].HOR_FIM_TARIFA) && DateTimeService.verificaHoraMenorIgual(horasInicio[j], self.Tarifa.list[i].HOR_FIM_TARIFA))
                                consumoEnergetico += motobomba.VAR_CONSUMO * self.Tarifa.list[i].VAL_TARIFA * DateTimeService.horasEmDecimal(DateTimeService.subtraiHora(self.Tarifa.list[i].HOR_FIM_TARIFA, horasInicio[j]));
                        }
                    }
                }
            }
            return consumoEnergetico;

        }



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

        function clone(obj) {
            var copy;

            // Handle the 3 simple types, and null or undefined
            if (null == obj || "object" != typeof obj) return obj;

            // Handle Date
            if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }

            // Handle Array
            if (obj instanceof Array) {
                copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = clone(obj[i]);
                }
                return copy;
            }

            // Handle Object
            if (obj instanceof Object) {
                copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
                }
                return copy;
            }

            throw new Error("Unable to copy obj! Its type isn't supported.");
        }


        function getCultura(id) {
            for (var i = 0; i < self.Cultura.list.length; i++)
                if (self.Cultura.list[i].IDC_CAD_CULTURA == id)
                    return self.Cultura.list[i];
        };

        function getParcela(id) {
            for (var i = 0; i < self.Parcela.list.length; i++)
                if (self.Parcela.list[i].IDC_CAD_PARCELA == id)
                    return self.Parcela.list[i];
        };

        function getMotobomba(id) {
            for (var i = 0; i < self.Motobomba.list.length; i++)
                if (self.Motobomba.list[i].IDC_CAD_MOTOBOMBA == id)
                    return self.Motobomba.list[i];
        };

        function getReservatorio(id) {
            for (var i = 0; i < self.Reservatorio.list.length; i++)
                if (self.Reservatorio.list[i].IDC_CAD_RESERVATORIO == id)
                    return self.Reservatorio.list[i];
        };

        function getPivoCentral(id) {
            for (var i = 0; i < self.PivoCentral.list.length; i++)
                if (self.PivoCentral.list[i].IDC_CAD_PIVO_CENTRAL == id)
                    return self.PivoCentral.list[i];
        };

        function getGotejador(id) {
            for (var i = 0; i < self.Gotejador.list.length; i++)
                if (self.Gotejador.list[i].IDC_CAD_GOTEJADOR == id)
                    return self.Gotejador.list[i];
        };
    };
})();


function dateFilter() {
    return function (items, from, to) {
        var result = [];
        if (from && to) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].DAT_IRRIGACAO >= from && items[i].DAT_IRRIGACAO <= to) {
                    result.push(items[i]);
                }
            }
        } else {
            return items;
        }
        return result;
    };
};