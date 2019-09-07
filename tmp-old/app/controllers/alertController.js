
(function () {
    angular
        .module ('RegistrationApp')
        .controller ('alertModalController', alertModalController);

        alertModalController.$inject = ['$scope','$modalInstance'];

        function alertModalController ($scope, $modalInstance) {
            var vm = this;
            vm.cancel = cancel;

            function cancel () {
                $modalInstance.dismiss();
            }
        }
})();