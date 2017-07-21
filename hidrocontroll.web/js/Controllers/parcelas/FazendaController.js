(function () {
    angular.module("hidrocontroll.web").controller("FazendaParcelasController", fazendaController);

    function fazendaController(EntitiesService, $mdMedia, $mdDialog) {
        var self = this;

        var success = $mdDialog.alert()
               .title('Sucesso')
               .textContent('A operação foi realizada com sucesso!')
               .ok('Fechar');

        var error = $mdDialog.alert()
               .title('Falha')
               .textContent('Operação não pode ser realizada!')
               .ok('Fechar');

        initializeData();

        function initializeData() {
            self.Fazenda = EntitiesService.fazenda;
            self.Cidade = EntitiesService.cidade;
            self.Estado = EntitiesService.estado;
            self.$mdMedia = $mdMedia;
            self.excluir = excluir;
            self.create = create;
            self.update = update;
            self.printData = printData;
            self.showhints;
            self.tituloTelaCriacao = "sdfsdafsda";

            self.tabela = {
                "titulo": "Fazenda",
                "cabecalho": ["Código","Nome","Área","Altitude","Cidade","Estado"]
            };

            self.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        };

        function printData() {
            var divToPrint = document.getElementById("tabela_dados");
            newWin = window.open("");
            newWin.document.write("<h2 style='text-align:center'>Fazendas</h2>" + divToPrint.outerHTML);
            newWin.document.getElementById("tabela_dados").setAttribute("border","1");
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
            self.Fazenda.clear();
            update(ev);
        };

        function update(ev, item) {
            var method = "$save";
            self.tituloTelaCriacao = "Criar Fazenda";
            var success = $mdDialog.alert()
              .title('Sucesso')
              .textContent('A operação foi realizada com sucesso!')
              .ok('Fechar');

            var error = $mdDialog.alert()
                   .title('Falha')
                   .textContent('Operação não pode ser realizada!')
                   .ok('Fechar');

            if (item) {
                item.$select();
                method = "$update";
                self.tituloTelaCriacao = "Alterar Fazenda";
            };

            showDialog(ev).then(function (resource) {
                console.log(method);
                console.log(resource);
                resource[method](
                    {},
                    function () { //Função de sucesso: objeto foi inserido
                        $mdDialog
                            .show(success)
                            .finally(function () {
                                success = undefined;
                            })
                    },
                    function () { //Função de erro: objeto não pode ser inserido
                        $mdDialog
                            .show(error)
                            .finally(function () {
                                error = undefined;
                            });
                    }
                );
            });
        };

        function excluir(ev, item) {
            var confirm = $mdDialog.confirm()
                  .title('Deseja realmente excluir o registro "' + item.NOME + '"?')
                  .textContent('Após a exclusão a operação não poderá ser desfeita.')
                  .ariaLabel('Exclusão de Registro')
                  .targetEvent(ev)
                  .ok('Sim')
                  .cancel('Não');
             var success = $mdDialog.alert()
               .title('Sucesso')
               .textContent('A operação foi realizada com sucesso!')
               .ok('Fechar');

            var error = $mdDialog.alert()
                   .title('Falha')
                   .textContent('Operação não pode ser realizada!')
                   .ok('Fechar');

            //Shows the dialog to the user
            $mdDialog.show(confirm).then(function () {

                //If the interaction completes successfuly 
                //the resource is deleted
                console.log(item);
                item.$delete(
                    {},
                    function () {
                        $mdDialog
                            .show(success)
                            .finally(function () {
                                success = undefined;
                            });
                    },
                    function () {
                        $mdDialog
                            .show(error)
                            .finally(function () {
                                error = undefined;
                                //location.reload();
                            });
                    }
                );
            });
        };

        function showDialog(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            return $mdDialog.show({
                controller: dialogController,
                templateUrl: 'pages/fazendas/criar_fazenda.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        function dialogController($scope, $mdDialog) {
            $scope.selected = self.Fazenda.selected;

            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.salvar = function (fazenda) {
                if (!fazendaForm.classList.contains("ng-invalid")) {
                    $mdDialog.hide(fazenda);
                }

            };
        };

        function getMatchesEstado(text) {
            return $filter('filter')(self.Estado.list, text);
        };

        function onchangeSelectedEstado(estado) {
            try {
                self.Estado.selected.IDC_CAD_ESTADO = estado.IDC_CAD_ESTADO;
            } catch (err) {
                //Tratamento de exceção
            }
        };

        function getMatchesCidade(text) {
            return $filter('filter')(self.Cidade.list, text);
        };

        function onchangeSelectedCidade(cidade) {
            try {
                self.Cidade.selected.IDC_CAD_CIDADE = cidade.IDC_CAD_CIDADE;
            } catch (err) {
                //Tratamento de exceção
            }
        };

        
    };
})();