(function () {

    /**
     * Constantes da Aplicação
     * 
     * @type {Angular.constant}
     */
    angular.module("hidrocontroll.web").constant("C", {
        loginUrl: "http://localhost:8888/hidrocontroll.api/api/login",

        domain: "localhost",

        port: "8888",

        protocol: "http",
        mainUrl: "hidrocontroll.api/api",
        id: "{{'IDC_'+config.name.toUpperCase()}}"
    });


})();