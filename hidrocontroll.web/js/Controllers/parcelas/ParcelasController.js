
(function () {
    angular.module("hidrocontroll.web").controller("ParcelasController", parcelasController);

    function parcelasController(EntitiesService, $mdMedia, $mdDialog, $filter, store, $rootScope, NgTableParams) {
        var self = this;

        initializeData();
        
        var intervalID = window.setInterval(refresh, 500);

        function initializeData() {

            self.codFazendaAtual = store.get('fazenda').IDC_CAD_FAZENDA;

            self.Parcela = EntitiesService.parcela;
            self.Cultura = EntitiesService.cultura;
            self.PivoCentral = EntitiesService.pivoCentral;
            self.Solo = EntitiesService.solo;
            self.Gotejador = EntitiesService.gotejador;
            self.Outorga = EntitiesService.outorga;

            self.$mdMedia = $mdMedia;
            self.excluir = excluir;
            self.excluir = excluir;
            self.create = create;
            self.getCultura = getCultura;
            self.getPivoCentral = getPivoCentral;
            self.getGotejador = getGotejador;
            self.getSolo = getSolo;
            self.getOutorga = getOutorga;
            self.update = update;
            self.printData = printData;
            self.showhints;
            self.refresh = refresh;
            self.cols = [
              {
                  field: "NOM_PARCELA", title: "Nome", sortable: "NOM_PARCELA", show: true, filter: { NOM_PARCELA: "text" }, type: "valor"
              },
                { field: "DAT_PLANTIO", title: "Data", sortable: "DAT_PLANTIO", show: true, isDate: true, type: "valor" },
              { field: "CAD_CULTURA_IDC_CAD_CULTURA", title: "Cultura/Variedade", show: true, type: "valorCompostoCultura" },
              { field: "CAD_SOLO_IDC_CAD_SOLO", title: "Solo", show: true, type: "valorCompostoSolo" },
              { field: "CAD_PIVO_CENTRAL_IDC_CAD_PIVO_CENTRAL", title: "Pivô Central", show: true, type: "valorCompostoPivoCentral" },
              { field: "CAD_GOTEJADOR_IDC_CAD_GOTEJADOR", title: "Gotejador", show: true, type: "valorCompostoGotejador" },
              { field: "ARE_PARCELA", title: "Área (ha)", show: true, type: "valor" },
              { field: "VAR_PLUVIOMETRO", title: "Pluviômetro", show: true, type: "valor" },
              { field: "VAR_UMIDADE_SOLO_PLANTIO", title: "Umidade do solo no plantio (%)", show: true, type: "valor" },
              { field: "VAR_ESTRESSE_EXCEDIDO", title: "Estresse excedido (mm)", show: true, type: "valor" },
              { field: "CAD_OUTORGA_IDC_CAD_OUTORGA", title: "Outorga", show: true, type: "valorCompostoOutorga" },

              { title: "Editar", show: true, type: "comandoEditar", class: 'width-70-px' },
              { title: "Deletar", show: true, type: "comandoDeletar", class: 'width-70-px' }
            ];

            self.tabela = {
                "titulo": "Parcelas",
                "subtitulo": "Informações sobre parcelas:",
            };

        };

        function refresh() {
            if (self.Parcela.list.length * self.PivoCentral.list.length * self.Cultura.list.length * self.Gotejador.list.length * self.Outorga.list.length != 0) {
                clearInterval(intervalID);
            }
            try {
                var list = [];

                list = $filter('filter')(self.Parcela.list, function (parcela) {
                    return getCultura(parcela.CAD_CULTURA_IDC_CAD_CULTURA).CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });
                list = $filter('orderBy')(list, 'NOM_PARCELA');

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
            newWin.document.write("<h2 style='text-align:center'>Parcelas</h2>" + divToPrint.outerHTML);
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
            self.Parcela.clear();
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
                                if (resource.IDC_CAD_PARCELA)
                                    for (var i = 0; i < self.Parcela.list.length; i++)
                                        if (self.Parcela.list[i].IDC_CAD_PARCELA == resource.IDC_CAD_PARCELA)
                                            self.Parcela.list[i] = resource;
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
                  .title('Deseja realmente excluir o registro "' + item.NOM_PARCELA + '"?')
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
                templateUrl: 'pages/parcelas/dialogs/criar_parcela.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
        };

        function dialogController($scope, $mdDialog) {
            $scope.selected = jQuery.extend({}, self.Parcela.selected);

            $scope.isCulturaInvalida = false;
            $scope.isSoloInvalido = false;
            $scope.selected.CAD_CULTURA = getCultura($scope.selected.CAD_CULTURA_IDC_CAD_CULTURA);
            $scope.selected.CAD_PIVO_CENTRAL = getPivoCentral($scope.selected.CAD_PIVO_CENTRAL_IDC_CAD_PIVO_CENTRAL);
            $scope.selected.CAD_OUTORGA = getOutorga($scope.selected.CAD_OUTORGA_IDC_CAD_OUTORGA);
            $scope.selected.CAD_SOLO = getSolo($scope.selected.CAD_SOLO_IDC_CAD_SOLO);
            $scope.selected.CAD_GOTEJADOR = getGotejador($scope.selected.CAD_GOTEJADOR_IDC_CAD_GOTEJADOR);


            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.salvar = function (parcela) {
                if ($scope.selected.CAD_CULTURA && $scope.selected.CAD_SOLO) {

                    if (!parcelaForm.classList.contains("ng-invalid")) {

                        $scope.selected.CAD_CULTURA_IDC_CAD_CULTURA = $scope.selected.CAD_CULTURA.IDC_CAD_CULTURA;
                        $scope.selected.CAD_CULTURA = null;
                        $scope.selected.CAD_PIVO_CENTRAL = null;
                        $scope.selected.CAD_OUTORGA = null;
                        $scope.selected.CAD_SOLO = null;
                        $scope.selected.CAD_GOTEJADOR = null;
                        $mdDialog.hide(parcela);
                    }
                }
                else if (!$scope.selected.CAD_CULTURA) {
                    $scope.isCulturaInvalida = true;
                    document.getElementById("autocomplete-container-cultura").classList.add('md-input-invalid');
                }
                else if (!$scope.selected.CAD_SOLO) {
                    $scope.isSoloInvalido = true;
                    document.getElementById("autocomplete-container-solo").classList.add('md-input-invalid');
                }
            };
            $scope.getMatchesCultura = function (text) {
                var list = $filter('filter')(self.Cultura.list, function (cultura) {
                    return cultura.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });
                list = $filter('filter')(list, text);
                return $filter('orderBy')(list, 'NOM_CULTURA');

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

            $scope.getMatchesSolo = function (text) {
                var list = $filter('filter')(self.Solo.list, function (solo) {
                    return solo.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });
                list = $filter('filter')(list, text);
                return $filter('orderBy')(list, 'NOM_SOLO');

            };

            $scope.onchangeSelectedSolo = function (solo) {
                try {
                    $scope.selected.CAD_SOLO_IDC_CAD_SOLO = solo.IDC_CAD_SOLO;
                    $scope.isSoloInvalido = false;
                    document.getElementById("autocomplete-container-solo").classList.remove('md-input-invalid');
                } catch (err) {
                    //Tratamento de exceção
                }
            };

            $scope.getMatchesOutorga = function (text) {
                var list = $filter('filter')(self.Outorga.list, function (outorga) {
                    return outorga.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });
                list = $filter('filter')(list, text);
                return $filter('orderBy')(list, 'NOM_OUTORGA');

            };

            $scope.onchangeSelectedOutorga = function (outorga) {
                try {
                    $scope.selected.CAD_OUTORGA_IDC_CAD_OUTORGA = outorga.IDC_CAD_OUTORGA;
                } catch (err) {
                    //Tratamento de exceção
                }
            };

            $scope.getMatchesGotejador = function (text) {
                var list = $filter('filter')(self.Gotejador.list, function (gotejador) {
                    return gotejador.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });
                list = $filter('filter')(list, text);
                return $filter('orderBy')(list, 'NOM_GOTEJADOR');

            };

            $scope.onchangeSelectedGotejador = function (gotejador) {
                try {
                    $scope.selected.CAD_GOTEJADOR_IDC_CAD_GOTEJADOR = gotejador.IDC_CAD_GOTEJADOR;
                } catch (err) {
                    //Tratamento de exceção
                }
            };

            $scope.getMatchesPivoCentral = function (text) {
                var list = $filter('filter')(self.PivoCentral.list, function (pivoCentral) {
                    return pivoCentral.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });
                list = $filter('filter')(list, text);
                return $filter('orderBy')(list, 'NOM_PIVO_CENTRAL');

            };

            $scope.onchangeSelectedPivoCentral = function (pivoCentral) {
                try {
                    $scope.selected.CAD_PIVO_CENTRAL_IDC_CAD_PIVO_CENTRAL = pivoCentral.IDC_CAD_PIVO_CENTRAL;
                } catch (err) {
                    //Tratamento de exceção
                }
            };
        };
        function getCultura(id) {
            for (var i = 0; i < self.Cultura.list.length; i++)
                if (self.Cultura.list[i].IDC_CAD_CULTURA == id)
                    return self.Cultura.list[i];
        };

        function getSolo(id) {
            for (var i = 0; i < self.Solo.list.length; i++)
                if (self.Solo.list[i].IDC_CAD_SOLO == id)
                    return self.Solo.list[i];
        };

        function getPivoCentral(id) {
            for (var i = 0; i < self.PivoCentral.list.length; i++)
                if (self.PivoCentral.list[i].IDC_CAD_PIVO_CENTRAL == id)
                    return self.PivoCentral.list[i];
        };

        function getGotejador(id) {
            for (var i = 0; i < self.Gotejador.list.length; i++)
                if (self.Gotejador.list[i].IDC_CAD_GOTEJADOR == id)
                    return self.Gotejador.list[i];
        };

        function getOutorga(id) {
            for (var i = 0; i < self.Outorga.list.length; i++)
                if (self.Outorga.list[i].IDC_CAD_OUTORGA == id)
                    return self.Outorga.list[i];
        };
    };
})();