(function () {
    angular.module("hidrocontroll.web").controller("LoginController", loginController);

    function loginController($http, C, store, $state, $mdDialog, EntitiesService) {
        var self = this;

        self.obj = {};
        self.entrar = entrar;

        function entrar() {

            $http.post(C.loginUrl, self.obj, { timeout: 10000 })
            .then(sucesso, erro);
        };

        function erro(exc) {
            var texto = exc.data ? exc.data.Message : "Ocorreu um erro inesperado.";

            alert = $mdDialog.alert({
                title: 'Atenção',
                textContent: texto,
                ok: 'Close'
            });

            $mdDialog
              .show(alert)
              .finally(function () {
                  alert = undefined;
              });
        }

        function sucesso(result) {
            
            store.set('user', result.data);
            fazendas = EntitiesService.fazenda;
            for (var i = 0; i < fazendas.list.length; i++)
                if (fazendas.list[i].CAD_CLIENTE_IDC_CAD_CLIENTE == result.data.CAD_CLIENTE_IDC_CAD_CLIENTE) {
                    store.set('fazenda', fazendas.list[i]);
                    break;
                }
            $state.go("main");
        };

        if ($state.$current.name === "login" && store.get('user')) {
            $state.go("main");
        };
    };
})();