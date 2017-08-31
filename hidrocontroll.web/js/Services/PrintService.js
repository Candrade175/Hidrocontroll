(function () {
    angular.module("hidrocontroll.web").factory("PrintService", [function () {

        function imprimir(idTabela, titulo) {
            var divToPrint = document.getElementById(idTabela);
            newWin = window.open("");
            newWin.document.write("<h2 style='text-align:center'>" + titulo + "</h2>" + divToPrint.outerHTML);
            newWin.document.getElementById(idTabela).setAttribute("border", "1");

            while (newWin.document.getElementById("comandoEditar")) {
                newWin.document.getElementById("comandoEditar").remove();
            }
            while (newWin.document.getElementById("comandoDeletar")) {
                newWin.document.getElementById("comandoDeletar").remove();
            }
            var elements = newWin.document.getElementsByClassName("ng-table-filters");
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }
            var elements = newWin.document.getElementsByClassName("width-70-px");
            while (elements.length > 0) {
                elements[0].parentNode.removeChild(elements[0]);
            }

            while (newWin.document.getElementById("item-true")) {
                newWin.document.getElementById("item-true").outerHTML = 'Sim';

            }
            while (newWin.document.getElementById("item-false")) {
                newWin.document.getElementById("item-false").outerHTML = 'Não';

            }
            while (newWin.document.getElementById("comandoMarcar")) {
                newWin.document.getElementById("comandoMarcar").remove();
            }
            newWin.print();
            newWin.close();
        }

        return {
            imprimirTabela: function (titulo) {
                imprimir('tabela_dados',titulo);
            },

            imprimirTabelaRelatorio: function (titulo, index) {
                imprimir("tabela_dados_" + index,titulo);
            }
        };
    }]);
})();

