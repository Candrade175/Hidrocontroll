
(function () {
    angular.module("hidrocontroll.web").controller("UmidadeDadosDiariosController", umidadeController).filter("dateFilterUmidade", dateFilter);

    function umidadeController(EntitiesService, $mdMedia, $mdDialog, $filter, store, $rootScope, NgTableParams, $element) {
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
            self.Umidade = EntitiesService.umidade;
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
                field: "DAT_UMIDADE", title: "Data", sortable: "DAT_UMIDADE", isDate: true, show: true, type: "valor"
            },
            { field: "CAD_PARCELA_IDC_CAD_PARCELA", title: "Parcela", show: true, type: "valorCompostoParcela" },
            { field: "VOL_CM10", title: "10 cm", show: true, type: "valorBool" },
            { field: "VOL_CM20", title: "20 cm", show: true, type: "valorBool" },
            { field: "VOL_CM30", title: "30 cm", show: true, type: "valorBool" },
            { field: "VOL_CM40", title: "40 cm", show: true, type: "valorBool" },
            { field: "VOL_CM50", title: "50 cm", show: true, type: "valorBool" },
            { field: "VOL_CM60", title: "60 cm", show: true, type: "valorBool" },

            { title: "Editar", show: true, type: "comandoEditar", class: 'width-70-px' },
             { title: "Deletar", show: true, type: "comandoDeletar", class: 'width-70-px' }
            ];


            self.tabela = {
                "titulo": "Umidade",
                "subtitulo": "Dados diários de umidade:"
            };
            self.tabela.data_inicio = null;
            self.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        };

        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

        function refresh() {
            if (self.Umidade.list.length * self.Cultura.list.length * self.Parcela.list.length != 0) {
                clearInterval(intervalID);
            }
            try {
                var list = [];


                list = $filter('filter')(self.Umidade.list, function (umidade) {
                    return getCultura(getParcela(umidade.CAD_PARCELA_IDC_CAD_PARCELA).CAD_CULTURA_IDC_CAD_CULTURA).CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });


                list = $filter('dateFilterUmidade')(list, self.tabela.data_inicio, self.tabela.data_fim);

                if (self.ParcelasFiltro.length > 0) {
                    list = $filter('filter')(list, function (umidade) {
                        for (i = 0; i < self.ParcelasFiltro.length; i++)
                            if (umidade.CAD_PARCELA_IDC_CAD_PARCELA == self.ParcelasFiltro[i].IDC_CAD_PARCELA)
                                return true;
                        return false;
                    });
                }
                list = $filter('orderBy')(list, '-DAT_UMIDADE');


                self.tableParams = new NgTableParams({}, { dataset: list });
                $rootScope.$digest();
            } catch (e) {

            }
        }


        function printData() {
            var divToPrint = document.getElementById("tabela_dados");
            if (divToPrint) {
                newWin = window.open("");
                newWin.document.write("<h2 style='text-align:center'>Umidades</h2>" + divToPrint.outerHTML);
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
            self.Umidade.clear();
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
                                if (resource.IDC_CAD_UMIDADE)
                                    for (var i = 0; i < self.Umidade.list.length; i++)
                                        if (self.Umidade.list[i].IDC_CAD_UMIDADE == resource.IDC_CAD_UMIDADE)
                                            self.Umidade.list[i] = resource;
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
                  .title('Deseja realmente excluir o registro do dia ' + item.DAT_UMIDADE.getDate() + "/" + (item.DAT_UMIDADE.getMonth() + 1) + "/" + item.DAT_UMIDADE.getFullYear() + ' parcela ' + getParcela(item.CAD_PARCELA_IDC_CAD_PARCELA).NOM_PARCELA + '?')
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
                templateUrl: 'pages/dados_diarios/dialogs/criar_umidade.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        function dialogController($scope, $mdDialog) {

            $scope.selected = jQuery.extend({}, self.Umidade.selected);

            $scope.selected.CAD_PARCELA = getParcela($scope.selected.CAD_PARCELA_IDC_CAD_PARCELA);

            if ($scope.selected.VOL_CM10)
                $scope.selected.VOL_CM10 = true;
            if ($scope.selected.VOL_CM20)
                $scope.selected.VOL_CM20 = true;
            if ($scope.selected.VOL_CM30)
                $scope.selected.VOL_CM30 = true;
            if ($scope.selected.VOL_CM40)
                $scope.selected.VOL_CM40 = true;

            if ($scope.selected.VOL_CM50)
                $scope.selected.VOL_CM50 = true;
            if ($scope.selected.VOL_CM60)
                $scope.selected.VOL_CM60 = true;
            $scope.selected.CAD_FAZENDA_IDC_CAD_FAZENDA = self.codFazendaAtual;

            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.salvar = function (umidade) {
                if ($scope.selected.CAD_PARCELA) {

                    if (!umidadeForm.classList.contains("ng-invalid")) {

                        $scope.selected.CAD_PARCELA = null;
                        $mdDialog.hide(umidade);
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
                cultura = getCultura(parcela.CAD_CULTURA_IDC_CAD_CULTURA);
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
                if (items[i].DAT_UMIDADE >= from && items[i].DAT_UMIDADE <= to) {
                    result.push(items[i]);
                }
            }
        } else {
            return items;
        }
        return result;
    };
};