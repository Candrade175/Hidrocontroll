(function () {
    angular.module("hidrocontroll.web").controller("ManejoDadosDiariosController", manejoController).filter("dateFilterManejo", dateFilterEquals);

    function manejoController(EntitiesService, $mdMedia, $filter, $element, store, $timeout, NgTableParams,$rootScope,PrintService) {
        var self = this;

        initializeData();

        var intervalID = window.setInterval(refresh, 500);
        function initializeData() {

            if (store.get('fazenda'))
                self.codFazendaAtual = store.get('fazenda').IDC_CAD_FAZENDA;
            self.Manejo = EntitiesService.manejo;
            self.Parcela = EntitiesService.parcela;
            self.Cultura = EntitiesService.cultura;
            self.$mdMedia = $mdMedia;
            self.printData = printData;
            self.getParcela = getParcela;
            self.getCultura = getCultura;
            self.showhints;
            self.refresh = refresh;
            self.searchTerm;
            self.clearSearchTerm;
            self.ParcelasFiltro = [];
            self.buscarParcelaFazenda = buscarParcelaFazenda;


            self.cols = [
                {
                    field: "DAT_MANEJO", title: "Data", sortable: "DAT_MANEJO", isDate: true, show: true, type: "valor"
                },
                { field: "CAD_PARCELA_IDC_CAD_PARCELA", title: "Parcela", show: true, type: "valorCompostoParcela" },
                {  title: "Cultura", show: true, type: "valorCompostoCultura" },
                { field: "VOL_IRRIGACAO_NECESSARIA", title: "Irrigação Necessária (mm)", show: true, type: "valor" },
                { field: "TMO_MANEJO", title: "Tempo Necessário", show: true, type: "valor" },
                { field: "PER_PERCENTIMETRO", title: "Percentimetro (%)", show: true, type: "valor" }
            ];

            self.tabela = {
                "titulo": "Manejo",
                "subtitulo": "Informações sobre manejo:"
            };

            self.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        };
        
        self.clearSearchTerm = function() {
            self.searchTerm = '';
        };

        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

        function refresh() {
            if (self.Manejo.list.length * self.Cultura.list.length * self.Parcela.list.length != 0) {
                clearInterval(intervalID);
            }
            try {
                self.list = [];


                self.list = $filter('filter')(self.Manejo.list, function (manejo) {
                    return getCultura(getParcela(manejo.CAD_PARCELA_IDC_CAD_PARCELA).CAD_CULTURA_IDC_CAD_CULTURA).CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                });


                self.list = $filter('dateFilterManejo')(self.list, self.filtroData);

                if (self.ParcelasFiltro.length > 0) {
                    self.list = $filter('filter')(self.list, function (manejo) {
                        for (i = 0; i < self.ParcelasFiltro.length; i++)
                            if (manejo.CAD_PARCELA_IDC_CAD_PARCELA == self.ParcelasFiltro[i].IDC_CAD_PARCELA)
                                return true;
                        return false;
                    });
                }

                self.list = $filter('orderBy')(self.list, '-DAT_MANEJO');


                self.tableParams = new NgTableParams({}, { dataset: self.list });
                $rootScope.$digest();
            } catch (e) {
                console.log(e);
            }
        }

        function printData() {
            if (self.list) {
                self.tableParams = new NgTableParams({ count: self.list.length }, { dataset: self.list });
                $timeout(function () {
                    PrintService.imprimirTabela('Manejos Resumidos');
                    self.tableParams = new NgTableParams({}, { dataset: self.list });
                });
            }
        };

        var parcela=null;

        function getParcela(id) {
            for (var i = 0; i < self.Parcela.list.length; i++)
                if (self.Parcela.list[i].IDC_CAD_PARCELA == id) {
                    parcela = self.Parcela.list[i];
                    return self.Parcela.list[i];
                }
        };

        function getCultura() {
            if (self.Parcela.list.length)
                for (var i = 0; i < self.Cultura.list.length; i++)
                    if (self.Cultura.list[i].IDC_CAD_CULTURA == parcela.CAD_CULTURA_IDC_CAD_CULTURA)
                        return self.Cultura.list[i];
        };

        function getCulturaPorId(id) {
            for (var i = 0; i < self.Cultura.list.length; i++)
                if (self.Cultura.list[i].IDC_CAD_CULTURA == id)
                    return self.Cultura.list[i];
        };

        function buscarParcelaFazenda(text) {
            var list = $filter('filter')(self.Parcela.list, function (parcela) {
                cultura = getCulturaPorId(parcela.CAD_CULTURA_IDC_CAD_CULTURA);
                if (cultura)
                    return cultura.CAD_FAZENDA_IDC_CAD_FAZENDA === self.codFazendaAtual;
                else
                    return false;
            });
            list = $filter('filter')(list, text);
            return $filter('orderBy')(list, 'NOM_PARCELA');
        };


        
    };
})();

function dateFilterEquals() {
    return function (items, date) {
        var result = [];
        if (date) {
            for (var i = 0; i < items.length; i++) {
                items[i].DAT_MANEJO.setHours(0, 0, 0, 0);
                if (items[i].DAT_MANEJO.getTime() == date.getTime()) {
                    result.push(items[i]);
                }
            }
        } else {
            return items;
        }
        return result;
    };
};