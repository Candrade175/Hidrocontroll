(function () {
    angular.module("hidrocontroll.web").controller("TarifaCadastrosController", tarifaController);

    function tarifaController(EntitiesService, $mdMedia, $mdDialog, $filter, store, $rootScope, NgTableParams) {
        var self = this;

        initializeData();

        var intervalID = window.setInterval(refresh, 500);

        function initializeData() {

            self.codFazendaAtual = store.get('fazenda').IDC_CAD_FAZENDA;

            self.Tarifa = EntitiesService.tarifa;
            self.Fazenda = EntitiesService.fazenda;

            self.$mdMedia = $mdMedia;
            self.excluir = excluir;
            self.excluir = excluir;
            self.create = create;
            self.update = update;
            self.printData = printData;
            self.showhints;
            self.refresh = refresh;
            self.cols = [
              {
                  field: "NOM_TARIFA", title: "Nome", sortable: "NOM_TARIFA", show: true, filter: { NOM_TARIFA: "text" }, type: "valor"
              },
              { field: "HOR_INICIO_TARIFA", title: "Início", isTime: true, show: true, type: "valor" },
              { field: "HOR_FIM_TARIFA", title: "Fim", isTime: true, show: true, type: "valor" },
              { field: "VAL_TARIFA", title: "Valor", show: true, type: "valor" },
              { title: "Editar", show: true, type: "comandoEditar", class: 'width-70-px' },
              { title: "Deletar", show: true, type: "comandoDeletar", class: 'width-70-px' }
            ];

            self.tabela = {
                "titulo": "Tarifas",
                "subtitulo": "Cadastro de tarifa:"
            };

        };

        function refresh() {
            if (self.Tarifa.list.length != 0) {
                clearInterval(intervalID);
            }
            try {
                var list = [];

                list = $filter('filter')(self.Tarifa.list, function (tarifa) {
                    return tarifa.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });
                list = $filter('orderBy')(list, 'NOM_TARIFA');

                self.tableParams = new NgTableParams({}, { dataset: list });
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
            var divToPrint = document.getElementById("tabela_dados");
            newWin = window.open("");
            newWin.document.write("<h2 style='text-align:center'>Tarifas</h2>" + divToPrint.outerHTML);
            newWin.document.getElementById("tabela_dados").setAttribute("border", "1");
            while (newWin.document.getElementById("th_editar_excluir")) {
                newWin.document.getElementById("th_editar_excluir").remove();
            }
            while (newWin.document.getElementById("td_editar_excluir")) {
                newWin.document.getElementById("td_editar_excluir").remove();
            }
            newWin.print();
            console.log(newWin.document);
            newWin.close();
        };

        function create(ev) {
            self.Tarifa.clear();
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
                                if (resource.IDC_CAD_TARIFA)
                                    for (var i = 0; i < self.Tarifa.list.length; i++)
                                        if (self.Tarifa.list[i].IDC_CAD_TARIFA == resource.IDC_CAD_TARIFA)
                                            self.Tarifa.list[i] = resource;
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
                  .title('Deseja realmente excluir o registro "' + item.NOM_TARIFA + '"?')
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
                templateUrl: 'pages/cadastros/dialogs/criar_tarifa.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        function dialogController($scope, $mdDialog) {

            $scope.selected = jQuery.extend({}, self.Tarifa.selected);

            $scope.timeValido = true;
            var data = new Date(0);

            if ($scope.selected.HOR_INICIO_TARIFA) {
                var vetor = $scope.selected.HOR_INICIO_TARIFA.split(':');
                data.setHours(vetor[0]);
                data.setMinutes(vetor[1]);
                $scope.selected.HOR_INICIO_TARIFA = data;
            }

            var data2 = new Date(0);

            if ($scope.selected.HOR_FIM_TARIFA) {
                var vetor = $scope.selected.HOR_FIM_TARIFA.split(':');
                data2.setHours(vetor[0]);
                data2.setMinutes(vetor[1]);
                $scope.selected.HOR_FIM_TARIFA = data2;
            }



            $scope.selected.CAD_FAZENDA_IDC_CAD_FAZENDA = self.codFazendaAtual;

            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.salvar = function (tarifa) {
                if (typeof $scope.selected.HOR_INICIO_TARIFA !== 'string')
                    $scope.selected.HOR_INICIO_TARIFA = $scope.selected.HOR_INICIO_TARIFA.getHours() + ":" + $scope.selected.HOR_INICIO_TARIFA.getMinutes();
                if (typeof $scope.selected.HOR_FIM_TARIFA !== 'string')
                    $scope.selected.HOR_FIM_TARIFA = $scope.selected.HOR_FIM_TARIFA.getHours() + ":" + $scope.selected.HOR_FIM_TARIFA.getMinutes();
                if (!tarifaForm.classList.contains("ng-invalid")) {
                    $mdDialog.hide(tarifa);
                }

            };
            $scope.validaTime = function () {
                if (typeof $scope.selected.HOR_INICIO_TARIFA !== 'string' || typeof $scope.selected.HOR_FIM_TARIFA !== 'string')
                    if ($scope.selected.HOR_INICIO_TARIFA.getHours() > $scope.selected.HOR_FIM_TARIFA.getHours())
                        $scope.timeValido = false;
                    else if ($scope.selected.HOR_INICIO_TARIFA.getHours() < $scope.selected.HOR_FIM_TARIFA.getHours())
                        $scope.timeValido = true;
                    else
                        if ($scope.selected.HOR_INICIO_TARIFA.getMinutes() >= $scope.selected.HOR_FIM_TARIFA.getMinutes())
                            $scope.timeValido = false;
                        else
                            $scope.timeValido = true;
            };

        };


    };
})();