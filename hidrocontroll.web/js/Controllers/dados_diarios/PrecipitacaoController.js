

(function () {
    angular.module("hidrocontroll.web").controller("PrecipitacaoDadosDiariosController", precipitacaoController).filter("dateFilterPrecipitacao", dateFilter);

    function precipitacaoController(EntitiesService, $mdMedia, $mdDialog, $filter, store, $rootScope, NgTableParams, $element,$timeout,PrintService) {
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
            self.Precipitacao = EntitiesService.precipitacao;
            self.Parcela = EntitiesService.parcela;
            self.Cultura = EntitiesService.cultura;
            self.$mdMedia = $mdMedia;
            self.excluir = excluir;
            self.create = create;
            self.update = update;
            self.printData = printData;
            self.getParcela = getParcela;
            self.showhints;
            self.refresh = refresh;
            self.searchTerm;
            self.clearSearchTerm;
            self.ParcelasFiltro = [];
            self.buscarParcelaFazenda = buscarParcelaFazenda;

            self.cols = [
            {
                field: "DAT_PRECIPITACAO", title: "Data", sortable: "DAT_PRECIPITACAO", isDate: true, show: true, type: "valor"
            },
            { field: "CAD_PARCELA_IDC_CAD_PARCELA", title: "Parcela", show: true, type: "valorCompostoParcela" },
            { field: "VAR_PRECIPITACAO", title: "Precipitação (mm)", show: true, type: "valor" },

            { title: "Editar", show: true, type: "comandoEditar", class: 'width-70-px' },
             { title: "Deletar", show: true, type: "comandoDeletar", class: 'width-70-px' }
            ];

           

            self.tabela = {
                "titulo": "Precipitação",
                "subtitulo": "Dados diários de precipitação:"
            };
            self.tabela.data_inicio = null;
            self.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        };

        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

        function refresh() {
            if (self.Precipitacao.list.length * self.Cultura.list.length * self.Parcela.list.length != 0) {
                clearInterval(intervalID);
            }
            try {
                self.list = [];


                self.list = $filter('filter')(self.Precipitacao.list, function (precipitacao) {
                    return getCultura(getParcela(precipitacao.CAD_PARCELA_IDC_CAD_PARCELA).CAD_CULTURA_IDC_CAD_CULTURA).CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });


                self.list = $filter('dateFilterPrecipitacao')(self.list, self.tabela.data_inicio, self.tabela.data_fim);

                if (self.ParcelasFiltro.length > 0) {
                    self.list = $filter('filter')(self.list, function (precipitacao) {
                        for (i = 0; i < self.ParcelasFiltro.length; i++)
                            if (precipitacao.CAD_PARCELA_IDC_CAD_PARCELA == self.ParcelasFiltro[i].IDC_CAD_PARCELA)
                                return true;
                        return false;
                    });
                }

                self.list = $filter('orderBy')(self.list, '-DAT_PRECIPITACAO');


                self.tableParams = new NgTableParams({}, { dataset: self.list });
                $rootScope.$digest();
            } catch (e) {

            }
        }


        function printData() {
            if (self.list) {
                self.tableParams = new NgTableParams({ count: self.list.length }, { dataset: self.list });
                $timeout(function () {
                    PrintService.imprimirTabela('Precipitações');
                    self.tableParams = new NgTableParams({}, { dataset: self.list });
                });
            }
        };

        function create(ev) {
            self.Precipitacao.clear();
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
                                if (resource.IDC_CAD_PRECIPITACAO)
                                    for (var i = 0; i < self.Precipitacao.list.length; i++)
                                        if (self.Precipitacao.list[i].IDC_CAD_PRECIPITACAO == resource.IDC_CAD_PRECIPITACAO)
                                            self.Precipitacao.list[i] = resource;
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
                  .title('Deseja realmente excluir o registro do dia ' + item.DAT_PRECIPITACAO.getDate() + "/" + (item.DAT_PRECIPITACAO.getMonth() + 1) + "/" + item.DAT_PRECIPITACAO.getFullYear() + ' parcela ' + getParcela(item.CAD_PARCELA_IDC_CAD_PARCELA).NOM_PARCELA + '?')
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
                templateUrl: 'pages/dados_diarios/dialogs/criar_precipitacao.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        function dialogController($scope, $mdDialog) {

            $scope.selected = jQuery.extend({}, self.Precipitacao.selected);

            $scope.selected.CAD_PARCELA = getParcela($scope.selected.CAD_PARCELA_IDC_CAD_PARCELA);


            $scope.selected.CAD_FAZENDA_IDC_CAD_FAZENDA = self.codFazendaAtual;

            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.salvar = function (precipitacao) {
                if ($scope.selected.CAD_PARCELA) {

                    if (!precipitacaoForm.classList.contains("ng-invalid")) {

                        $scope.selected.CAD_PARCELA = null;
                        $mdDialog.hide(precipitacao);
                    }
                }
                else {
                    $scope.isParcelaInvalida = true;
                    document.getElementById("autocomplete-container-parcela").classList.add('md-input-invalid');
                }

            };


            $scope.getMatchesParcela = function (text) {
                return self.buscarParcelaFazenda(text);
            };

            $scope.onchangeSelectedParcela = function (parcela) {
                try {
                    $scope.selected.CAD_PARCELA_IDC_CAD_PARCELA = parcela.IDC_CAD_PARCELA;
                    $scope.isParcelaInvalida = false;
                    document.getElementById("autocomplete-container-parcela").classList.remove('md-input-invalid');
                } catch (err) {
                    //Tratamento de exceção
                }
            };
        };
        function buscarParcelaFazenda(text) {
            var list = $filter('filter')(self.Parcela.list, function (parcela) {
                cultura=getCultura(parcela.CAD_CULTURA_IDC_CAD_CULTURA);
                if (cultura)
                    return cultura.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                else
                    return false;
            });
            list = $filter('filter')(list, text);
            return $filter('orderBy')(list, 'NOM_PARCELA');
        };


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

    };


})();


function dateFilter() {
    return function (items, from, to) {
        var result = [];
        if (from && to) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].DAT_PRECIPITACAO >= from && items[i].DAT_PRECIPITACAO <= to) {
                    result.push(items[i]);
                }
            }
        } else {
            return items;
        }
        return result;
    };
};