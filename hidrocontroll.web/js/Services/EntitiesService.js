(function () {
    angular.module("hidrocontroll.web").factory("EntitiesService", entitiesService);

    function entitiesService(Model) {
        Model([
            { name: 'administrador' }
        ]);

        return Model;
    };
})();