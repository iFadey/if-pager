angular.module('MyApp', ['ifadey'])

.controller('TestCtrl', function ($scope) {

  $scope.handlers = [
    function (d) {
      console.log('level 0 - ' + d.title);
    },
    function (d) {
      console.log('level 1 - ' + d.title);
    },
    function (d) {
      console.log('level 2 - ' + d.title);
    }
  ];

  $scope.data = [
    {
      title: 'Root',
      children: [
        {
          title: 'Item 1-1',
          children: [
            {title: 'Item 2-1'},
            {
              title: 'Item 2-2',
              children: [
                {title: 'Item 3-1'},
                {title: 'Item 3-2'},
                {title: 'Item 3-3'}
              ]
            }
          ]
        },
        {title: 'Item 1-2'},
        {title: 'Item 1-3'}
      ]
    }
  ];

})
;