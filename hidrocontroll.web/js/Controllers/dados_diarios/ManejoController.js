(function () {
    angular.module("hidrocontroll.web").controller("ManejoDadosDiariosController", manejoController).filter("dateFilterEquals", dateFilterEquals);

    function manejoController(EntitiesService, $mdMedia, $filter, $element,store) {
        var self = this;

        initializeData();

        function initializeData() {

            self.codFazendaAtual = store.get('user').CAD_FAZENDA_IDC_CAD_FAZENDA;
            self.Teste=["OI","asdsa"];
            self.Manejo = EntitiesService.manejo;
            self.Parcela = EntitiesService.parcela;
            self.Cultura = EntitiesService.cultura;
            self.$mdMedia = $mdMedia;
            self.printData = printData;
            self.getParcela = getParcela;
            self.getCultura = getCultura;
            self.selectedParcelas = [];
            self.searchTerm = "";
            self.showhints;

            console.log(self.Manejo.list);

            self.tabela = {
                "titulo": "Manejo",
                "subtitulo": "Informações sobre manejo:",
                "cabecalho": ["Data","Parcela","Cultura","Irrigação Necessária (mm)","Tempo Necessário","Percentimetro (%)"]
            };

            self.tabela.data_fim = new Date(new Date((new Date()).setMilliseconds(0)).setSeconds(0));
        };
        
        self.clearSearchTerm = function() {
            self.searchTerm = '';
        };

        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });


        function printData() {
            var divToPrint = document.getElementById("tabela_dados");
            newWin = window.open("");
            newWin.document.write("<h2 style='text-align:center'>Manejos</h2>" + divToPrint.outerHTML);
            newWin.document.getElementById("tabela_dados").setAttribute("border","1");
            newWin.print();
            newWin.close();
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
            for (var i = 0; i < self.Cultura.list.length; i++)
                if (self.Cultura.list[i].IDC_CAD_CULTURA == parcela.CAD_CULTURA_IDC_CAD_CULTURA)
                    return self.Cultura.list[i];
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
                    console.log("asd");
                    
                }
            }
        } else {
            return items;
        }
        return result;
    };
};