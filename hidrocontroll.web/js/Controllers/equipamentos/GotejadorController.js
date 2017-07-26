(function () {
    angular.module("hidrocontroll.web").controller("GotejadorEquipamentosController", gotejadorController);


    function gotejadorController(EntitiesService, $mdMedia, $mdDialog, $filter) {
        var self = this;

        initializeData();

        function initializeData() {
            self.Gotejador = EntitiesService.gotejador;
            self.$mdMedia = $mdMedia;
            self.excluir = excluir;
            self.create = create;
            self.update = update;
            self.printData = printData;
            self.showhints;

            self.tabela = {
                "titulo": "Gotejador",
                "subtitulo": "Informações sobre gotejador:",
                "cabecalho": ["Nome/Descrição",
                            "Vazão (l/h)",
                            "Espaçamento entre gotejadores",
                            "Espaçamento entre linhas laterais",
                            "Largura da faixa molhada",
                            "Uniformidade (%)",
                            "Lâmina (mm)"]
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
            if (divToPrint) {
                newWin = window.open("");
                newWin.document.write("<h2 style='text-align:center'>Gotejadores</h2>" + divToPrint.outerHTML);
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
            }
        };

        function create(ev) {
            self.Gotejador.clear();
            update(ev);
        };

        function update(ev, item) {
            var method = "$save";

            if (item) {
                item.$select();
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
                  .title('Deseja realmente excluir o registro do dia ' + item.DAT_CLIMA.getDate()+ "/"+(item.DAT_CLIMA.getMonth()+1)+"/"+ item.DAT_CLIMA.getFullYear() + ' ?')
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
                templateUrl: 'pages/equipamentos/criar_gotejador.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        function dialogController($scope, $mdDialog) {

            $scope.selected = self.Gotejador.selected;
            $scope.temp_max_max = 45;
            $scope.temp_max_min = 10;
            $scope.temp_min_max = 30;
            $scope.temp_min_min = 0;
            $scope.umidade_max = 100;
            $scope.umidade_min = 10;
            $scope.vento_max = 7;
            $scope.vento_min = 0;
            $scope.radiacao_max = 400;
            $scope.radiacao_min = 30;
            $scope.precipitacao_max = 300;
            $scope.precipitacao_min = 0;

            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();

                location.reload();
            };
            $scope.salvar = function (gotejador) {
                if (!gotejadorForm.classList.contains("ng-invalid")) {
                    $mdDialog.hide(gotejador);
                }

            };

            $scope.getMatchesFazenda = function (text) {
                return $filter('filter')(self.Fazenda.list, text);
            };

            $scope.onchangeSelectedFazenda = function (fazenda) {
                try {
                    console.log(fazenda);
                    self.Gotejador.selected.CAD_FAZENDA_IDC_CAD_FAZENDA = fazenda.IDC_CAD_FAZENDA;
                } catch (err) {
                    //Tratamento de exceção
                }
            };

        };

        

       

    };

    
})();
