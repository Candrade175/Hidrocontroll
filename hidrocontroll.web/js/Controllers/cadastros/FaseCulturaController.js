(function () {
    angular.module("hidrocontroll.web").controller("FaseCulturaCadastrosController", faseCulturaController);

    function faseCulturaController(EntitiesService, $mdMedia, $mdDialog, store, $filter, $rootScope, NgTableParams, $element,$timeout,PrintService) {
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

            self.Cultura = EntitiesService.cultura;
            self.FaseCultura = EntitiesService.faseCultura;
            self.$mdMedia = $mdMedia;
            self.excluir = excluir;
            self.refresh = refresh;
            self.create = create;
            self.update = update;
            self.getCultura = getCultura;
            self.printData = printData;
            self.buscador = "";
            self.showhints;
            self.buscarCulturaFazenda = buscarCulturaFazenda;
            self.searchTerm;
            self.clearSearchTerm;
            self.CulturasFiltro = [];
            self.cols = [
              {
                  field: "NOM_FASE_CULTURA", title: "Nome", sortable: "NOM_FASE_CULTURA", show: true, filter: { NOM_FASE_CULTURA: "text" }, type: "valor"
              },
              { field: "NUM_INICIO", title: "Início (dias)", sortable: "NUM_INICIO", show: true, type: "valor" },
              { field: "NUM_FIM", title: "Fim (dias)", sortable: "NUM_FIM", show: true, type: "valor" },
              { field: "VAR_KC", title: "Kc", show: true, type: "valor" },
              { field: "PRF_RAIZ", title: "Profundidade da raiz", show: true, type: "valor" },
              { field: "ARE_SOMBREADA", title: "Área sombreada", show: true, type: "valor" },
              { field: "VAR_PREF_RADICULAR", title: "Pref. Radicular", show: true, type: "valor" },
              { field: "CAD_CULTURA_IDC_CAD_CULTURA", title: "Cultura", show: true, type: "valorComposto" },
              { title: "Editar", show: true, type: "comandoEditar", class: 'width-70-px' },
              { title: "Deletar", show: true, type: "comandoDeletar", class: 'width-70-px' }
            ];

            self.tableParams = new NgTableParams({}, { dataset: self.FaseCultura.list });
            self.tabela = {
                "titulo": "Fases de Cultura",
                "subtitulo": "Cadastro de fases de Cultura:"
            };


        };

        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

        function refresh() {
            if (self.FaseCultura.list.length != 0) {
                clearInterval(intervalID);
            }
            try {
                self.list = [];

                self.list = $filter('filter')(self.FaseCultura.list, function (faseCultura) {
                    return getCultura(faseCultura.CAD_CULTURA_IDC_CAD_CULTURA).CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });

                if (self.CulturasFiltro.length > 0) {
                    self.list = $filter('filter')(self.list, function (faseCultura) {
                        for (i = 0; i < self.CulturasFiltro.length; i++)
                            if (faseCultura.CAD_CULTURA_IDC_CAD_CULTURA == self.CulturasFiltro[i].IDC_CAD_CULTURA)
                                return true;
                        return false;
                    });
                }


                self.list = $filter('orderBy')(self.list, 'NOM_FASE_CULTURA');
                

                self.tableParams = new NgTableParams({}, { dataset:self.list });
                $rootScope.$digest();
            } catch (e) {
            }
        }


        function printData() {

            if (self.list) {
                self.tableParams = new NgTableParams({ count: self.list.length }, { dataset: self.list });
                $timeout(function () {
                    PrintService.imprimirTabela('Fases Cultura');
                    self.tableParams = new NgTableParams({}, { dataset: self.list });
                });
            }
        };



        function create(ev) {
            self.FaseCultura.clear();
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
                                if (resource.IDC_CAD_FASE_CULTURA)
                                    for (var i = 0; i < self.FaseCultura.list.length; i++)
                                        if (self.FaseCultura.list[i].IDC_CAD_FASE_CULTURA == resource.IDC_CAD_FASE_CULTURA)
                                            self.FaseCultura.list[i] = resource;
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
                  .title('Deseja realmente excluir o registro "' + item.NOM_FASE_CULTURA + '"?')
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
                templateUrl: 'pages/cadastros/dialogs/criar_faseCultura.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        function dialogController($scope, $mdDialog) {
            $scope.kc_max = 3;
            $scope.kc_min = 0;
            $scope.inicio_min = 0;
            $scope.raiz_max = 200;
            $scope.raiz_min = 0;
            $scope.area_max = 1;
            $scope.area_min = 0;

            $scope.selected = jQuery.extend({}, self.FaseCultura.selected);
            $scope.isCulturaInvalida = false;
            $scope.selected.CAD_CULTURA = getCultura($scope.selected.CAD_CULTURA_IDC_CAD_CULTURA);

            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.salvar = function (faseCultura) {
                if ($scope.selected.CAD_CULTURA) {
                    $scope.selected.CAD_CULTURA_IDC_CAD_CULTURA = $scope.selected.CAD_CULTURA.IDC_CAD_CULTURA;
                    $scope.selected.CAD_CULTURA = null;

                    if (!faseCulturaForm.classList.contains("ng-invalid")) {
                        $mdDialog.hide(faseCultura);
                    }
                }
                else {
                    $scope.isCulturaInvalida = true;
                    document.getElementById("autocomplete-container-cultura").classList.add('md-input-invalid');
                }


            };

            $scope.getMatchesCultura = function (text) {
                
                return self.buscarCulturaFazenda(text);
            };

            $scope.onchangeSelectedCultura = function (cultura) {
                try {
                    $scope.selected.CAD_CULTURA_IDC_CAD_CULTURA = cultura.IDC_CAD_CULTURA;
                    $scope.isCulturaInvalida = false;
                    document.getElementById("autocomplete-container-cultura").classList.remove('md-input-invalid');
                } catch (err) {
                    //Tratamento de exceção
                }
            };
        };

        function buscarCulturaFazenda(text) {
            var list = $filter('filter')(self.Cultura.list, function (cultura) {
                return cultura.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
            });
            list = $filter('filter')(list, text);
            return $filter('orderBy')(list, 'NOM_CULTURA');
        };

        function getCultura(id) {
            for (var i = 0; i < self.Cultura.list.length; i++)
                if (self.Cultura.list[i].IDC_CAD_CULTURA == id)
                    return self.Cultura.list[i];
        };
    };
})();