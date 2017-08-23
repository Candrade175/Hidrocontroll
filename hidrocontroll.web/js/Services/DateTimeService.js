(function () {
    angular.module("hidrocontroll.web").factory("DateTimeService", [function () {
        return {
            converterMinutosEmHoras: function (minutos) {
                if (minutos) {
                    var horas = Math.floor(minutos / 60);
                    var minutos = minutos % 60;
                    return horas + ":" + minutos;
                }
            },

            decimalEmHoras: function (decimal) {
                if (decimal!=null) {
                    var hora = Math.floor(decimal);
                    var minutos = Math.floor((decimal-hora) * 60);
                    return hora+':'+minutos;
                }
            },

            horasEmDecimal: function (hora) {
                if (hora) {
                    var vetor = hora.split(':');
                    hora= parseInt(vetor[0]) + parseInt(vetor[1]) / 60;
                    return hora;
                }
            },

            subtraiHora: function (h1, h2) {
                if (h1 && h2) {
                    var vetor = h1.split(':');
                    var vetor2 = h2.split(':');
                    hora = vetor[0] - vetor2[0];
                    minuto = vetor[1] - vetor2[1];
                    if (minuto < 0) {
                        minuto = 60 + minuto;
                        hora -= 1;
                    }
                    return hora + ':' + minuto;
                }
            },

            getTimeFormated: function (time) {
                if (time) {
                    return time.getHours() + ":" + time.getMinutes();
                }
            },



            verificaHoraMenorIgual: function (h1, h2) {
                if (h1 && h2) {
                    vetor1 = h1.split(':');
                    vetor2 = h2.split(':');

                    if (parseInt(vetor1[0]) > parseInt(vetor2[0]))
                        return false;
                    else if (parseInt(vetor1[0]) < parseInt(vetor2[0]))
                        return true;
                    else
                        if (parseInt(vetor1[0]) >= parseInt(vetor2[0]))
                            return false;
                        else
                            return true;
                }
            },

            verificaHoraMaiorIgual: function (h1, h2) {
                if (h1 && h2) {
                    vetor1 = h1.split(':');
                    vetor2 = h2.split(':');
                    if (parseInt(vetor1[0]) > parseInt(vetor2[0]))
                        return true;
                    else if (parseInt(vetor1[0]) < parseInt(vetor2[0]))
                        return false;
                    else
                        if (parseInt(vetor1[0]) >= parseInt(vetor2[0]))
                            return true;
                        else
                            return false;
                }
            }
        };
    }]);
})();

