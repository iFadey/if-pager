angular
.module('ifadey', [])

.directive('ifPager', function ($compile, $timeout) {
  var pages = [];

  function appendPage($scope, $element, data) {
    if (data.page) {
      $scope.breadcrumb.push(data.page);
      data.page.open();
      return;
    }

    var page = angular.element('<section if-page="curPage" if-click="ifClick(d)"></section>');
    $scope.curPage = data;
    $element.append(page);
    $compile(page)($scope);
  }

  return {
    restrict: 'A',
    scope: {
      ifPager: '=',
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

        breadcrumb[j].close();

        while (j > i) {
          breadcrumb.pop();
          j--;
        }

        breadcrumb[i].open();
      };

      $scope.ifClick = $scope.ifHandlers[0];
      appendPage($scope, $element, $scope.ifPager[0]);
    }
  };
})

.directive('ifPage', function ($timeout) {
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
      $scope.clickHdlr = $scope.ifClick;

      console.log($scope.model.children);

      $scope.open = function () {
        $elm.css('display', 'block');
        $elm.addClass('slide-left-in');
      };

      $scope.close = function (notAni) {
        notAni ? $elm.css('display', 'none')
               : $elm.addClass('slide-left-out');
      };

      $elm.on('animationend webkitAnimationEnd', function (e) {
        console.log('animationend', e.animationName);
        if (e.animationName === 'slide-left-out') {
          $elm.css('display', 'none');
        }
        $elm.removeClass('slide-left-out slide-left-in');
      });

      $scope.childPage = function (i) {
        $scope.close();
        pagerCtrl.addPage($scope.model.children[i]);
      };

      $scope.ifPage.page = $scope;
      $scope.open();
      pagerCtrl.pageAdded($scope);
    }
  };
})
;