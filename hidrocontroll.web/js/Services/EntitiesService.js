(function () {
    angular.module("hidrocontroll.web").factory("EntitiesService", entitiesService);

    function entitiesService(Model) {
        Model([
            { name: 'administrador' },
            { name: 'fazenda' },
            { name: 'cidade' },
            { name: 'estado' },
            { name: 'clima' },
            { name: 'parcela' },
            { name: 'irrigacao' },
            { name: 'motobomba' },
            { name: 'umidade' },
            { name: 'tarifa' },
            { name: 'manejo' },
            { name: 'solo' },
            { name: 'faseOutorga', id: 'IDC_CAD_FASE_OUTORGA' },
            { name: 'outorga' },
            { name: 'gotejador' },
            { name: 'reservatorio' },
            { name: 'precipitacao' },
            { name: 'reservatorioDiario', id: 'IDC_CAD_RESERVATORIO_DIARIO' },
            { name: 'pivoCentral',id:'IDC_CAD_PIVO_CENTRAL' },
            { name: 'modeloPivoCentral' ,id:'IDC_CAD_MODELO_PIVO_CENTRAL'},
            { name: 'faseCultura', id: 'IDC_CAD_FASE_CULTURA' },
            { name: 'cultura' }
        ]);

        return Model;
    };
})();