(function () {
    'use strict';

    angular.module('project_advise', []);
    angular.module('project_advise').controller('IndexController', function ($scope, $http) {
        var vm = $scope;
        $scope.currentPage = 1;
        $scope.pageSize = 5;
        if(!localStorage.getItem('Theme') || localStorage.getItem('Theme') == 'white_mode') {
            $scope.status = false;
        } else {
            $scope.status = true;
        }

        $scope.SetCurrentPage = SetCurrentPage; 
        $scope.ChangeStatus = ChangeStatus;
        $scope.GetPokemonId = GetPokemonId;
        $scope.OpenModal = OpenModal;
        $scope.CloseModal = CloseModal;

        const urls = {
            'GET_ALL_POKEMONS': 'https://pokeapi.co/api/v2/pokemon/?offset={5}&limit=20',
            'GET_POKEMON': 'https://pokeapi.co/api/v2/pokemon/'
        }

        Init()

        // Init
        function Init () {
            SetTheme();
            GetPokemons();
        }

        // request for all pokemons
        function GetPokemons () {
            $http.get(urls.GET_ALL_POKEMONS).then(function successCallback(response) {
                $scope.listPokemons  = response.data.results;

                // add parameter id at list
                $scope.listPokemons.forEach((i, index) => {
                    i.id = index + 1;
                })
                SetPagination();
            }, function errorCallback(err) {
                console.error(err);
            }) 
        }

        function GetPokemonId (id) {
            id ? $http.get(urls.GET_POKEMON + id).then(function successCallback(response) {
                $scope.viewPokemons = []
                $scope.viewPokemons.push(response.data)
            }, function errorCallback(err) {
                console.error(err);
            }) : GetPokemons();
        }

        // Set Theme
        function SetTheme (change) {
            if(change == 'set') {
                $scope.status && localStorage.setItem('Theme', 'dark_mode');
                !$scope.status && localStorage.setItem('Theme', 'white_mode');

                $scope.theme = localStorage.getItem('Theme')

            } else if(localStorage.getItem('Theme')) {
                vm.theme = localStorage.getItem('Theme')  
            } else {
                localStorage.setItem('Theme', 'white_mode');
                $scope.theme = localStorage.getItem('Theme')
            }  
        }

        // reload pagination
        function SetPagination () {
            $scope.viewPokemons = [];

            $scope.listPokemons.forEach((pokemon, index) => {
                if ($scope.currentPage == 1) {
                    index <= $scope.pageSize - 1 && $scope.viewPokemons.push(pokemon)
                } else {
                    (index > (($scope.currentPage*$scope.pageSize) - $scope.pageSize - 1) && index <= $scope.pageSize*$scope.currentPage - 1) && $scope.viewPokemons.push(pokemon)
                }
            });
        }

        // set currentpage
        function SetCurrentPage (param, currentPage) {
            if(currentPage) $scope.currentPage = currentPage;

            if(param === 'goBack' && $scope.currentPage > 1) $scope.currentPage = $scope.currentPage - 1;

            if(param === 'next' && $scope.currentPage != ($scope.listPokemons.length / $scope.pageSize)) $scope.currentPage = $scope.currentPage + 1;

            SetPagination();
        }

        // switch theme
        function ChangeStatus () {
            $scope.status = !$scope.status;
            SetTheme('set');
        }

        // open modal
        function OpenModal (id) {
            $http.get(urls.GET_POKEMON + id).then(function successCallback(response) {
                $scope.pokemonModal = response.data;

                document.getElementsByClassName('modal')[0].style.display = 'flex'
            }, function errorCallback(err) {
                console.error(err);
            })
        }

        // close modal
        function CloseModal () {   
            document.getElementsByClassName('modal')[0].style.display = 'none';
        }
    });
})();