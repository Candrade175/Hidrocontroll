(function () {
    angular.module("hidrocontroll.web").controller("ClimaDadosDiariosController", climaController).filter("dateFilterClima", dateFilter);

    function climaController(EntitiesService, $mdMedia, $mdDialog, $filter, store, $rootScope, NgTableParams,$timeout,PrintService) {
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
            self.Clima = EntitiesService.clima;
            self.Fazenda = EntitiesService.fazenda;
            self.$mdMedia = $mdMedia;
            self.excluir = excluir;
            self.create = create;
            self.update = update;
            self.printData = printData;
            self.showhints;
            self.refresh = refresh;

            self.cols = [
            {
                field: "DAT_CLIMA", title: "Data", sortable: "DAT_CLIMA", isDate: true, show: true, type: "valor"
            },
            { field: "TMP_CLIMA_MAX", title: "Temp. máxima (ºC)",  show: true, type: "valor" },
            { field: "TMP_CLIMA_MIN", title: "Temp. mínima (ºC)", show: true, type: "valor" },
            { field: "TMP_CLIMA_MEDIA", title: "Temp. média (ºC)", show: true, type: "valor" },
            { field: "VAR_UMIDADE_RELATIVA", title: "Umidade relativa (%)", show: true, type: "valor" },
            { field: "VEL_VENTO", title: "Velocidade do vento (m/s)", show: true, type: "valor" },
            { field: "VAR_PRECIPITACAO_TOTAL", title: "Precipitação total (mm)", show: true, type: "valor" },
            { field: "VAR_RADIACAO", title: "Radiação média 24h (W/m²)", show: true, type: "valor" },

            { title: "Editar", show: true, type: "comandoEditar", class: 'width-70-px' },
             { title: "Deletar", show: true, type: "comandoDeletar", class: 'width-70-px' }
            ];


            self.tabela = {
                "titulo": "Clima",
                "subtitulo": "Dados diários de clima:"
            };
            self.tabela.data_inicio = null;
            self.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        };

        function refresh() {
            if (self.Clima.list.length != 0) {
                clearInterval(intervalID);
            }
            try {
                self.list = [];

                self.list = $filter('filter')(self.Clima.list, function (clima) {
                    return clima.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });

                self.list = $filter('dateFilterClima')(self.list, self.tabela.data_inicio, self.tabela.data_fim);
                self.list = $filter('orderBy')(self.list, '-DAT_CLIMA');


                self.tableParams = new NgTableParams({}, { dataset: self.list });
                $rootScope.$digest();
            } catch (e) {
            }
        }


        function printData() {
            if (self.list) {
                self.tableParams = new NgTableParams({ count: self.list.length }, { dataset: self.list });
                $timeout(function () {
                    PrintService.imprimirTabela('Climas');
                    self.tableParams = new NgTableParams({}, { dataset: self.list });
                });
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
                                if (resource.IDC_CAD_CLIMA)
                                    for (var i = 0; i < self.Clima.list.length; i++)
                                        if (self.Clima.list[i].IDC_CAD_CLIMA == resource.IDC_CAD_CLIMA)
                                            self.Clima.list[i] = resource;
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
                  .title('Deseja realmente excluir o registro do dia ' + item.DAT_CLIMA.getDate() + "/" + (item.DAT_CLIMA.getMonth() + 1) + "/" + item.DAT_CLIMA.getFullYear() +'?')
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
                templateUrl: 'pages/dados_diarios/dialogs/criar_clima.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        function dialogController($scope, $mdDialog) {

            $scope.selected = jQuery.extend({}, self.Clima.selected);

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


            $scope.selected.CAD_FAZENDA_IDC_CAD_FAZENDA = self.codFazendaAtual;

            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
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