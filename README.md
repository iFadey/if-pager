ifPager
========

ifPager is experimental AngularJS directive which can be used as a hierarchical navigation or as an alternate to tree specially when you have large number of .

# Usage

Currently ifPager uses bootstrap CSS so we need to link it first.

    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">

Then add if-pager.js file after angluar.js.

    <script src="js/lib/if-pager.js"></script>

Provide data using if-pager attribute and event handlers using if-handlers attribute.

   <section if-pager="data" if-handlers="handlers"></section>

With in your controller define both *data* and *handlers* on $scope or on this keyword if using controller as syntax.

    module.controller('TestCtrl', function ($scope) {

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

