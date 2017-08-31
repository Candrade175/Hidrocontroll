


(function () {
    angular.module("hidrocontroll.web").controller("ReservatorioDadosDiariosController", reservatorioController).filter("dateFilterReservatorio", dateFilter);

    function reservatorioController(EntitiesService, $mdMedia, $mdDialog, $filter, store, $rootScope, NgTableParams, DateTimeService, $timeout,PrintService) {
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
            self.codFazendaAtual = store.get('fazenda').IDC_CAD_FAZENDA;
            self.ReservatorioDiario = EntitiesService.reservatorioDiario;
            self.Motobomba = EntitiesService.motobomba;
            self.Reservatorio = EntitiesService.reservatorio;
            self.Tarifa = EntitiesService.tarifa;
            self.$mdMedia = $mdMedia;
            self.excluir = excluir;
            self.create = create;
            self.update = update;
            self.printData = printData;
            self.showhints;
            self.getReservatorio = getReservatorio;
            self.getMotobomba = getMotobomba;
            self.refresh = refresh;

            self.cols = [
            {
                field: "DAT_RESERVATORIO_DIARIO", title: "Data", sortable: "DAT_RESERVATORIO_DIARIO", isDate: true, show: true, type: "valor"
            },
            { field: "CAD_MOTOBOMBA_IDC_CAD_MOTOBOMBA", title: "Motobomba", show: true, type: "valorCompostoMotobomba" },
            { field: "CAD_RESERVATORIO_IDC_CAD_RESERVATORIO", title: "Reservatório", show: true, type: "valorCompostoReservatorio" },
            { field: "TMO_INICIO", title: "Início", isTime: true, show: true, type: "valor" },
            { field: "TMO_TERMINO", title: "Término", show: true, type: "valor", isTime: true },
            { field: "VOL_RESERVATORIO_DIARIO", title: "Volume (m³)", show: true, type: "valor" },
            { field: "VAR_CONSUMO", title: "Consumo (R$/m³)", show: true, type: "valor" },

            { title: "Editar", show: true, type: "comandoEditar", class: 'width-70-px' },
             { title: "Deletar", show: true, type: "comandoDeletar", class: 'width-70-px' }
            ];

            self.tabela = {
                "titulo": "Reservatório",
                "subtitulo": "Dados diários de reservatório:"
            };
            self.tabela.data_inicio = null;
            self.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        };

        function refresh() {
            if (self.ReservatorioDiario.list.length * self.Motobomba.list.length * self.Reservatorio.list.length != 0) {
                clearInterval(intervalID);
            }
            try {
                self.list = [];

                self.list = $filter('filter')(self.ReservatorioDiario.list, function (reservatorioDiario) {
                    return getReservatorio(reservatorioDiario.CAD_RESERVATORIO_IDC_CAD_RESERVATORIO).CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });

                self.list = $filter('dateFilterReservatorio')(self.list, self.tabela.data_inicio, self.tabela.data_fim);
                self.list = $filter('orderBy')(self.list, '-DAT_RESERVATORIO_DIARIO');


                self.tableParams = new NgTableParams({}, { dataset: self.list });
                $rootScope.$digest();
            } catch (e) {
            }
        }


        function printData() {
            if (self.list) {
                self.tableParams = new NgTableParams({ count: self.list.length }, { dataset: self.list });
                $timeout(function () {
                    PrintService.imprimirTabela('Reservatórios diários');
                    self.tableParams = new NgTableParams({}, { dataset: self.list });
                });
            }
        };

        function create(ev) {
            self.ReservatorioDiario.clear();
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
                                if (resource.IDC_CAD_RESERVATORIO_DIARIO)
                                    for (var i = 0; i < self.ReservatorioDiario.list.length; i++)
                                        if (self.ReservatorioDiario.list[i].IDC_CAD_RESERVATORIO_DIARIO == resource.IDC_CAD_RESERVATORIO_DIARIO)
                                            self.ReservatorioDiario.list[i] = resource;
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
                  .title('Deseja realmente excluir o registro do dia ' + item.DAT_RESERVATORIO_DIARIO.getDate() + "/" + (item.DAT_RESERVATORIO_DIARIO.getMonth() + 1) + "/" + item.DAT_RESERVATORIO_DIARIO.getFullYear() + ' reservatório ' + getReservatorio(item.CAD_RESERVATORIO_IDC_CAD_RESERVATORIO).NOM_RESERVATORIO + '?')
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
                templateUrl: 'pages/dados_diarios/dialogs/criar_reservatorio.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        function dialogController($scope, $mdDialog, $rootScope) {

            $scope.selected = jQuery.extend({}, self.ReservatorioDiario.selected);
            $scope.getTimeFormated = DateTimeService.getTimeFormated;
            var data = new Date(0);

            if ($scope.selected.TMO_INICIO) {
                var vetor = $scope.selected.TMO_INICIO.split(':');
                data.setHours(vetor[0]);
                data.setMinutes(vetor[1]);
                $scope.selected.TMO_INICIO = data;
            }

            var data1 = new Date(0);

            if ($scope.selected.TMO_TERMINO) {
                var vetor = $scope.selected.TMO_TERMINO.split(':');
                data1.setHours(vetor[0]);
                data1.setMinutes(vetor[1]);
                $scope.selected.TMO_TERMINO = data1;
            }
            $scope.timeValido = true;

            $scope.selected.CAD_MOTOBOMBA = getMotobomba($scope.selected.CAD_MOTOBOMBA_IDC_CAD_MOTOBOMBA);
            $scope.selected.CAD_RESERVATORIO = getReservatorio($scope.selected.CAD_RESERVATORIO_IDC_CAD_RESERVATORIO);

            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };



            $scope.salvar = function (reservatorioDiario) {

                if (typeof $scope.selected.TMO_TERMINO !== 'string')
                    $scope.selected.TMO_TERMINO = $scope.selected.TMO_TERMINO.getHours() + ":" + $scope.selected.TMO_TERMINO.getMinutes();


                if (typeof $scope.selected.TMO_INICIO !== 'string')
                    $scope.selected.TMO_INICIO = $scope.selected.TMO_INICIO.getHours() + ":" + $scope.selected.TMO_INICIO.getMinutes();

                if ($scope.selected.CAD_RESERVATORIO && $scope.selected.CAD_MOTOBOMBA) {

                    if (!reservatorioDiarioForm.classList.contains("ng-invalid")) {

                        $scope.selected.CAD_MOTOBOMBA = null;
                        $scope.selected.CAD_RESERVATORIO = null;
                        $mdDialog.hide(reservatorioDiario);
                    }
                }
                else if (!$scope.selected.CAD_RESERVATORIO) {
                    $scope.isReservatorioInvalido = true;
                    document.getElementById("autocomplete-container-reservatorio").classList.add('md-input-invalid');
                } else if (!$scope.selected.CAD_MOTOBOMBA) {

                    $scope.isMotobombaInvalida = true;
                    document.getElementById("autocomplete-container-motobomba").classList.add('md-input-invalid');
                }
            };

            $scope.calculaVolume = function () {
                if ($scope.timeValido && $scope.selected.CAD_RESERVATORIO_IDC_CAD_RESERVATORIO && $scope.selected.CAD_MOTOBOMBA_IDC_CAD_MOTOBOMBA && $scope.selected.TMO_INICIO && $scope.selected.TMO_TERMINO) {
                    $scope.selected.VOL_RESERVATORIO_DIARIO = 0;
                    motobomba = getMotobomba($scope.selected.CAD_MOTOBOMBA_IDC_CAD_MOTOBOMBA);
                    tempoAbastecimento = DateTimeService.subtraiHora(DateTimeService.getTimeFormated($scope.selected.TMO_TERMINO), DateTimeService.getTimeFormated($scope.selected.TMO_INICIO));
                    tempoAbastecimento = DateTimeService.horasEmDecimal(tempoAbastecimento);

                    $scope.selected.VOL_RESERVATORIO_DIARIO = (tempoAbastecimento * motobomba.VAZ_MOTOBOMBA).toFixed(2);

                }
            };

            $scope.calculaConsumo = function () {
                if ($scope.timeValido && $scope.selected.CAD_RESERVATORIO_IDC_CAD_RESERVATORIO && $scope.selected.CAD_MOTOBOMBA_IDC_CAD_MOTOBOMBA && $scope.selected.TMO_INICIO && $scope.selected.TMO_TERMINO) {

                    var horaInicio = DateTimeService.getTimeFormated($scope.selected.TMO_INICIO);
                    var horaFim = DateTimeService.getTimeFormated($scope.selected.TMO_TERMINO);
                    consumoEnergetico = 0;
                    motobomba = getMotobomba($scope.selected.CAD_MOTOBOMBA_IDC_CAD_MOTOBOMBA);
                    for (var i = 0; i < self.Tarifa.list.length; i++) {
                        if (DateTimeService.verificaHoraMenorIgual(horaInicio, self.Tarifa.list[i].HOR_INICIO_TARIFA)) {
                            if (DateTimeService.verificaHoraMaiorIgual(horaFim, self.Tarifa.list[i].HOR_FIM_TARIFA))
                                consumoEnergetico += motobomba.VAR_CONSUMO * self.Tarifa.list[i].VAL_TARIFA * DateTimeService.horasEmDecimal(DateTimeService.subtraiHora(self.Tarifa.list[i].HOR_FIM_TARIFA, self.Tarifa.list[i].HOR_INICIO_TARIFA));
                            else if (DateTimeService.verificaHoraMenorIgual(horaFim, self.Tarifa.list[i].HOR_FIM_TARIFA) && DateTimeService.verificaHoraMaiorIgual(horaFim, self.Tarifa.list[i].HOR_INICIO_TARIFA))
                                consumoEnergetico += motobomba.VAR_CONSUMO * self.Tarifa.list[i].VAL_TARIFA * DateTimeService.horasEmDecimal(DateTimeService.subtraiHora(horaFim, self.Tarifa.list[i].HOR_INICIO_TARIFA));
                        } else {
                            if (DateTimeService.verificaHoraMenorIgual(horaFim, self.Tarifa.list[i].HOR_FIM_TARIFA))
                                consumoEnergetico += motobomba.VAR_CONSUMO * self.Tarifa.list[i].VAL_TARIFA * DateTimeService.horasEmDecimal(DateTimeService.subtraiHora(horaFim, horaInicio));
                            else if (DateTimeService.verificaHoraMaiorIgual(horaFim, self.Tarifa.list[i].HOR_FIM_TARIFA) && DateTimeService.verificaHoraMenorIgual(horaInicio, self.Tarifa.list[i].HOR_FIM_TARIFA))
                                consumoEnergetico += motobomba.VAR_CONSUMO * self.Tarifa.list[i].VAL_TARIFA * DateTimeService.horasEmDecimal(DateTimeService.subtraiHora(self.Tarifa.list[i].HOR_FIM_TARIFA, horaInicio));
                        }
                    }
                    $scope.selected.VAR_CONSUMO = consumoEnergetico.toFixed(2);
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
                    $scope.selected.CAD_RESERVATORIO_IDC_CAD_RESERVATORIO = reservatorio.IDC_CAD_RESERVATORIO;
                    $scope.isReservatorioInvalido = false;
                    document.getElementById("autocomplete-container-reservatorio").classList.remove('md-input-invalid');
                    $scope.calculaConsumo();
                    $scope.calculaVolume();
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
                    document.getElementById("autocomplete-container-motobomba").classList.remove('md-input-invalid');
                    $scope.calculaConsumo();
                    $scope.calculaVolume();
                } catch (err) {
                    //Tratamento de exceção
                }
            };

            $scope.validaTime = function () {
                if (typeof $scope.selected.TMO_INICIO !== 'string' && typeof $scope.selected.TMO_TERMINO !== 'string' && $scope.selected.TMO_INICIO && $scope.selected.TMO_TERMINO) {
                    if ($scope.selected.TMO_INICIO.getHours() > $scope.selected.TMO_TERMINO.getHours())
                        $scope.timeValido = false;
                    else if ($scope.selected.TMO_INICIO.getHours() < $scope.selected.TMO_TERMINO.getHours())
                        $scope.timeValido = true;
                    else
                        if ($scope.selected.TMO_INICIO.getMinutes() >= $scope.selected.TMO_TERMINO.getMinutes())
                            $scope.timeValido = false;
                        else
                            $scope.timeValido = true;
                    $scope.calculaConsumo();
                    $scope.calculaVolume();
                }
            };
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
    };
})();


function dateFilter() {
    return function (items, from, to) {
        var result = [];
        if (from && to) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].DAT_RESERVATORIO_DIARIO >= from && items[i].DAT_RESERVATORIO_DIARIO <= to) {
                    result.push(items[i]);
                }
            }
        } else {
            return items;
        }
        return result;
    };
};