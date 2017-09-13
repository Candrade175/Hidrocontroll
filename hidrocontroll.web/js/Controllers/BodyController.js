(function () {

    /**
     * Recuperação do módulo principal
     */
    angular.module("hidrocontroll.web").controller("BodyController", bodyController);

    /**
     * Declaração do Controller da Master Page
     * 
     * @param  {Angular.service} $mdSidenav - Serviço do Angular material para controlar a Barra de navegação lateral
     * @param  {Angular.service} $mdMedia - Serviço de identificação de tamanho de tela
     * @param  {Angular.service} $state - Serviço do Ui.Router para acesso à rota atual
     * @param  {Angular.service} store - Serviço de armazenamento de dados em local storage
     */
    function bodyController($mdSidenav, $mdMedia, $state, $scope, store) {

        //Variável de referência ao objeto em execução
        var body = this;

        body.toggle = toggleSidenav;
        body.menu = [];
        body.go = go;
        body.logout = logout;
        body.matriculaUsuario = store.get('user').NUM_MATRICULA;
        if (store.get('fazenda'))
            body.nomeFazenda=store.get('fazenda').NOM_FAZENDA;
        //Ao criar uma instância deste Controller varre os estados/Rotas declarados e se
        //Contiverem a propriedade menu adiciona ao array menu para montagem do menu lateral
        angular.forEach($state.get(), function (state) {
            if (state.menu) {
                if(state.menu.localeCompare("Login") != 0) //Login não é uma aba
                    body.menu.push(state);
            }
        });

        //Função de redirecionamento para a página selecionada
        function go(state) {
            body.toggle();
            $state.go(state);
        };


        //Função para abrir ou fechar a barra lateral
        function toggleSidenav() {
            $mdSidenav('left').toggle();
        };

        //Função para limpeza dos dados de usuário
        function logout() {
            //Remove o usuário do local Storage
            store.remove('user');
            //Redireciona para a página de login
            $state.go("login");
        };
    };
})();