(function () {
    angular.module("hidrocontroll.web").controller("CulturaCadastrosController", culturaController);

    function culturaController(EntitiesService, $mdMedia, $mdDialog, $filter, store, $rootScope, NgTableParams,$timeout,PrintService) {
        var self = this;

        initializeData();

        var intervalID = window.setInterval(refresh, 500);

        function initializeData() {

            if (store.get('fazenda'))
                self.codFazendaAtual = store.get('fazenda').IDC_CAD_FAZENDA;

            self.Cultura = EntitiesService.cultura;
            self.Fazenda = EntitiesService.fazenda;
            self.FaseCultura = EntitiesService.faseCultura;
            
            self.$mdMedia = $mdMedia;
            self.excluir = excluir;
            self.excluir = excluir;
            self.create = create;
            self.getContFasesCultura = getContFasesCultura;
            self.update = update;
            self.printData = printData;
            self.showhints;
            self.refresh = refresh;
            self.cols = [
              {
                  field: "NOM_CULTURA", title: "Nome", sortable: "NOM_CULTURA", show: true, filter: { NOM_CULTURA: "text" }, type: "valor"
              },
              { field: "IDC_CAD_CULTURA", title: "Quantidade de Fases", show: true, type: "valorComposto" },

              { title: "Editar", show: true, type: "comandoEditar", class: 'width-70-px' },
              { title: "Deletar", show: true, type: "comandoDeletar", class: 'width-70-px' }
            ];

            self.tabela = {
                "titulo": "Culturas",
                "subtitulo": "Cadastro de cultura:"
            };

        };

        function refresh() {
            if (self.Cultura.list.length != 0) {
                clearInterval(intervalID);
            }
            try {
                self.list = [];

                self.list = $filter('filter')(self.Cultura.list, function (cultura) {
                    return cultura.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });
               self.list = $filter('orderBy')(self.list, 'NOM_CULTURA');

                self.tableParams = new NgTableParams({}, { dataset: self.list });
                $rootScope.$digest();
            } catch (e) {
            }
        }


        var success = $mdDialog.alert()
               .title('Sucesso')
               .textContent('A operação foi realizada com sucesso!')
               .ok('Fechar');

        var error = $mdDialog.alert()
               .title('Falha')
               .textContent('Operação não pode ser realizada!')
               .ok('Fechar');

        function printData() {
            if (self.list) {
                self.tableParams = new NgTableParams({ count: self.list.length }, { dataset: self.list });
                $timeout(function () {
                    PrintService.imprimirTabela('Culturas');
                    self.tableParams = new NgTableParams({}, { dataset: self.list });
                });
            }
        };

        function create(ev) {
            self.Cultura.clear();
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
                                if (resource.IDC_CAD_CULTURA)
                                    for (var i = 0; i < self.Cultura.list.length; i++)
                                        if (self.Cultura.list[i].IDC_CAD_CULTURA == resource.IDC_CAD_CULTURA)
                                            self.Cultura.list[i] = resource;
                                refresh();
                            });
                    },
                    function () { //Função de erro: objeto não pode ser inserido
                        $mdDialog
                            .show(error);
                    }
                );
            });
        };

        function excluir(ev, item) {
            var confirm = $mdDialog.confirm()
                  .title('Deseja realmente excluir o registro "' + item.NOM_CULTURA + '"?')
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
                        $mdDialog
                            .show(error);
                    }
                );
            });
        };

        function showDialog(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            return $mdDialog.show({
                controller: dialogController,
                templateUrl: 'pages/cadastros/dialogs/criar_cultura.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        function dialogController($scope, $mdDialog) {
            $scope.selected = jQuery.extend({}, self.Cultura.selected);


            $scope.selected.CAD_FAZENDA_IDC_CAD_FAZENDA =self.codFazendaAtual;

            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.salvar = function (cultura) {
                if (!culturaForm.classList.contains("ng-invalid")) {
                    $mdDialog.hide(cultura);
                }

            };
        };

      
        function getContFasesCultura(idCultura) {
            var cont = 0;
            for (var i = 0; i < self.FaseCultura.list.length; i++)
                if (self.FaseCultura.list[i].CAD_CULTURA_IDC_CAD_CULTURA == idCultura)
                    cont++;
            return cont;
        };
        
    };
})();