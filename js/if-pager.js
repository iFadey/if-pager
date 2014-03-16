angular
.module('ifadey', [])

.directive('ifPager', function ($compile, $timeout) {
  var pages = [];

  function appendPage($scope, $element, data) {
    var page = angular.element('<section if-page="curPage" if-click="ifClick(d)"></section>');
    $scope.curPage = data;
    $element.append(page);
    $compile(page)($scope);
  }

  return {
    restrict: 'A',
    scope: {
      ifPager: '=',
      //ifClick: '&',
      ifHandlers: '='
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
        $scope.ifClick = $scope.ifHandlers[breadcrumb.length];
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
      $scope.ifHandlers[0]('test');
      $scope.openPage = function (i) {
        var j = breadcrumb.length - 1;

        while (j > i) {
          breadcrumb[j--].close();
          breadcrumb.pop();
        }

        breadcrumb[i].open();
      };

      $scope.ifClick = $scope.ifHandlers[0];
      appendPage($scope, $element, $scope.ifPager[0]);
    }
  };
})

.directive('ifPage', function () {
  return {
    require: '^ifPager',
    restrict: 'A',
    scope: {
      ifPage: '=',
      ifClick: '&'
    },
    template: '<ul class="list-group">' +
                '<li class="list-group-item" ng-repeat="item in model.children">' +
                  '<a href="#" class="glyphicon glyphicon-chevron-right" ng-show="item.children" ng-click="childPage($index)"></a>' +
                  '<a href class="txt" ng-click="clickHdlr({d: item})">{{item.title}}</a>' +
                '</li>' +
              '</ul>',
    link: function ($scope, $elm, $attrs, pagerCtrl) {
      $scope.model = $scope.ifPage;
      $scope.clickHdlr = $scope.ifClick

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

  $scope.test = 'ifadey';

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

});