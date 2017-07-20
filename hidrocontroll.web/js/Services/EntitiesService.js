(function () {
    angular.module("hidrocontroll.web").factory("EntitiesService", entitiesService);

    function entitiesService(Model) {
        Model([
            { name: 'administrador' },
            { name: 'fazenda' },
            { name: 'cidade' },
            { name: 'estado' },
            { name: 'cultura'}
        ]);

        return Model;
    };
})();