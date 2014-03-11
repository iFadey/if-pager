angular
.module('ifadey', [])

.directive('ifPager', function ($compile, $timeout) {
  var pages = [];

  function appendPage($scope, $element, data) {
    var page = angular.element('<section if-page="curPage"></section>');
    $scope.curPage = data;
    $element.append(page);
    $compile(page)($scope);
  }

  return {
    restrict: 'A',
    scope: {
      ifPager: '='
    },
    template: '<ol class="breadcrumb">' +
                '<li ng-repeat="b in breadcrumb" ng-class="{active: $last}">' +
                  '<a href ng-if="!$last" ng-click="openPage($index)">{{b.model.title}}</a>' +
                  '<span ng-if="$last">{{b.model.title}}</span>' +
                '</li>' +
              '</ol>',
    controller: function ($scope, $element, $attrs) {
      var breadcrumb = $scope.breadcrumb = [];

      // used to add a new page
      this.addPage = function (model) {
        appendPage($scope, $element, model);
      };

      // called after page is added
      this.pageAdded = function (page) {
        console.log('breadcrumb: ', breadcrumb);
        breadcrumb.push(page);
      };

    },
    link: function ($scope, $element) {
      var breadcrumb = $scope.breadcrumb;

      $scope.openPage = function (i) {
        var j = breadcrumb.length - 1;

        while (j > i) {
          breadcrumb[j--].close();
          breadcrumb.pop();
        }

        breadcrumb[i].open();
      };

      appendPage($scope, $element, $scope.ifPager[0]);
    }
  };
})

.directive('ifPage', function () {
  return {
    require: '^ifPager',
    restrict: 'A',
    scope: {
      ifPage: '='
    },
    template: '<div class="list-group">' +
                '<a href class="list-group-item" ' +
                        'ng-repeat="item in model.children" ' +
                        'ng-click="childPage($index)">' +
                  '{{item.title}} ' +
                '</a>' +
              '</div>',
    link: function ($scope, $elm, $attrs, pagerCtrl) {
      $scope.model = $scope.ifPage;

      console.log($scope.model.children);

      $scope.open = function () {
        $elm.removeClass('slide-left-out').addClass('slide-left-in');
      };

      $scope.close = function () {
        $elm.removeClass('slide-left-in').addClass('slide-left-out');
      };

      $scope.childPage = function (i) {
        if ($scope.model.children[i].children) {
          $scope.close();
          pagerCtrl.addPage($scope.model.children[i]);
        }
      };

      $scope.open();
      pagerCtrl.pageAdded($scope);
    }
  };
})

.controller('TestCtrl', function ($scope) {

  $scope.data = [
    {
      title: 'Root',
      children: [
        {
          title: 'Item 1-1',
          children: [
            {title: 'VND 1'},
            {
              title: 'VND 2',
              children: [
                {title: 'Topo 1'},
                {title: 'Topo 2'},
                {title: 'Topo 3'}
              ]
            }
          ]
        },
        {title: 'Item 1-2'},
        {title: 'Item 1-3'}
      ]
    }
  ];

});