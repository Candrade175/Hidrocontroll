(function () {
    angular.module("hidrocontroll.web").controller("CulturaParcelasController", culturaController);

    function culturaController(EntitiesService, $mdMedia, $mdDialog, $filter) {
        var self = this;

        initializeData();

        function initializeData() {
            self.Cultura = EntitiesService.cultura;
            self.Fazenda = EntitiesService.fazenda;
            self.$mdMedia = $mdMedia;
            self.excluir = excluir;
            self.create = create;
            self.update = update;
            self.printData = printData;
            self.getFazenda = getFazenda;
            self.showhints;

            self.tabela = {
                "titulo": "Cultura",
                "subtitulo": "Informações sobre cultura:",
                "cabecalho": ["Código","Nome/Variedade","Fazenda"]
            };

            self.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        };


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
            newWin.document.write("<h2 style='text-align:center'>Culturas</h2>" + divToPrint.outerHTML);
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
            self.Cultura.clear();
            update(ev);
        };

        function update(ev, item) {
            var method = "$save";

           
            if (item) {
                item.$select();
                item.CAD_FAZENDA = getFazenda(item.CAD_FAZENDA_IDC_CAD_FAZENDA);
                console.log(item);
                method = "$update";
            };

            showDialog(ev).then(function (resource) {
                console.log(method);
                console.log(resource);
                resource[method](
                    {},
                    function () { //Função de sucesso: objeto foi inserido
                        $mdDialog
                            .show(success)
                    },
                    function () { //Função de erro: objeto não pode ser inserido
                        $mdDialog
                            .show(error)
                        .finally(function () {
                            location.reload();
                        });
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
                            .show(success)
                    },
                    function () {
                        $mdDialog
                            .show(error)
                    }
                );
            });
        };

        function showDialog(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            return $mdDialog.show({
                controller: dialogController,
                templateUrl: 'pages/parcelas/criar_cultura.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        function dialogController($scope, $mdDialog) {
            $scope.selected = self.Cultura.selected;

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

            $scope.getMatchesFazenda = function (text) {
                return $filter('filter')(self.Fazenda.list, text);
            };

            $scope.onchangeSelectedFazenda = function (fazenda) {
                try {
                    console.log(fazenda);
                    self.Cultura.selected.CAD_FAZENDA_IDC_CAD_FAZENDA = fazenda.IDC_CAD_FAZENDA;
                } catch (err) {
                    //Tratamento de exceção
                }
            };
        };

       

        function getFazenda(id) {
            for (var i = 0; i < self.Fazenda.list.length; i++)
                if (self.Fazenda.list[i].IDC_CAD_FAZENDA == id)
                    return self.Fazenda.list[i];
        };
        
    };
})();