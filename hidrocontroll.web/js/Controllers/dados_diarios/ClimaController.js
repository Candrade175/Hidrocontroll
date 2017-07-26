(function () {
    angular.module("hidrocontroll.web").controller("ClimaDadosController", climaController).filter("dateFilter", dateFilter);

    function climaController(EntitiesService, $mdMedia, $mdDialog, $filter) {
        var self = this;

        initializeData();

        function initializeData() {
            self.Clima = EntitiesService.clima;
            self.Fazenda = EntitiesService.fazenda;
            self.$mdMedia = $mdMedia;
            self.excluir = excluir;
            self.create = create;
            self.update = update;
            self.printData = printData;
            self.getFazenda = getFazenda;
            self.showhints;

            self.tabela = {
                "titulo": "Clima",
                "subtitulo": "Dados diários de clima:",
                "cabecalho": ["Data",
                            "Temp. máxima (ºC)",
                            "Temp. mínima (ºC)",
                            "Temp. média (ºC)",
                            "Umidade relativa (%)",
                            "Velocidade do vento (m/s)",
                            "Precipitação total (mm)",
                            "Radiação média 24h (W/m²)",
                            "Fazenda"]
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
                newWin.document.write("<h2 style='text-align:center'>Climas</h2>" + divToPrint.outerHTML);
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
            self.Clima.clear();
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
                templateUrl: 'pages/dados_diarios/criar_clima.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        function dialogController($scope, $mdDialog) {

            $scope.selected = self.Clima.selected;
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
            $scope.salvar = function (clima) {
                if (!climaForm.classList.contains("ng-invalid")) {
                    $mdDialog.hide(clima);
                }

            };

            $scope.calcularMedia = function (clima) {
                if (clima.TMP_CLIMA_MAX != "") {
                    if (clima.TMP_CLIMA_MAX < 30) {
                        $scope.temp_min_max = clima.TMP_CLIMA_MAX;
                    } else {

                        $scope.temp_min_max = 30;
                    }
                }
                if (!((clima.TMP_CLIMA_MAX ==="") && (clima.TMP_CLIMA_MIN ===""))) {
                    clima.TMP_CLIMA_MEDIA = (clima.TMP_CLIMA_MAX + clima.TMP_CLIMA_MIN) / 2;
                }

            };  

            $scope.getMatchesFazenda = function (text) {
                return $filter('filter')(self.Fazenda.list, text);
            };

            $scope.onchangeSelectedFazenda = function (fazenda) {
                try {
                    console.log(fazenda);
                    self.Clima.selected.CAD_FAZENDA_IDC_CAD_FAZENDA = fazenda.IDC_CAD_FAZENDA;
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


function dateFilter() {
    return function (items, from, to) {
        var result = [];
        if (from && to) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].DAT_CLIMA >= from && items[i].DAT_CLIMA <= to) {
                    result.push(items[i]);
                }
            }
        }else{
            return items;
        }
        return result;
    };
};