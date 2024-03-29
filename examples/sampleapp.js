/**
 * @ngdoc object
 * @name sampleapp
 * @description Sample application module. Injects the vsdatatable module.
 */
var sampleapp = angular.module('sampleapp', ['vsdatatable']);

/**
 * @ngdoc object
 * @name extenderctrl
 * @description Controller of row extender template. One function getNexId() which generates a new id to new
 * row of the table. Called when the user creates a new row to the table.
 */
sampleapp.controller('extenderctrl', function ($scope) {
    $scope.getNextId = function () {
        var nextId = Math.floor((Math.random() * 50000000) + 100);
        return nextId;
    };

});

/**
 * @ngdoc object
 * @name sampleappctrl
 * @description Sample application controller. This controller uses the vsdatatable.
 */
sampleapp.controller('sampleappctrl', function ($scope, $http, vsdtConf, vsdtEvent) {

    // Header column filter templates
    var colInputFilterTemplate =
        '<div class="columnTemplate">' +
        '<input type="text" class="inputField" ng-click="$event.stopPropagation();" ng-model="COLUMN_PROP_VALUE" ng-model-options="{debounce:500}" placeholder="Type filter...">' +
        '</div>';

    var colSelectActiveFilterTemplate =
        '<div class="columnTemplate">' +
        '<select class="selectMenu" ng-click="$event.stopPropagation();" ng-model="COLUMN_PROP_VALUE" ng-options="active.value as active.label for active in [{label: \'Choose\', value:undefined},{label: \'True\', value:\'true\'},{label: \'False\', value:\'false\'}]"></select>' +
        '</div>';

    var colSelectCarFeaturesFilterTemplate =
        '<div class="columnTemplate">' +
        '<select class="selectMenu" ng-click="$event.stopPropagation();" ng-model="COLUMN_PROP_VALUE" ng-options="features.value as features.label for features in [{label: \'Choose\', value:undefined},{label: \'Set 1\', value:\'1\'},{label: \'Set 2\', value:\'2\'},{label: \'Set 3\', value:\'3\'}]"></select>' +
        '</div>';

    $scope.jsonData = [];

    // data operation (add, edit or delete) callback
    var onDataOperation = function (phase, operation, dataOld, dataNew) {
        console.log('*** PARENT - onDataOperation: phase: ', phase, ' - operation: ', operation, ' - dataOld: ', dataOld, ' - dataNew: ', dataNew);
        if (phase === vsdtConf.OPER_PHASE_END && operation === vsdtConf.OPER_ADD) {
            // add new item to the end of the array
            $scope.jsonData.push(dataNew);
        }
        else if (phase === vsdtConf.OPER_PHASE_END && operation === vsdtConf.OPER_EDIT) {
            // replace the old item with the new one
            var idx = $scope.jsonData.indexOf(dataOld);
            if (idx !== -1) {
                $scope.jsonData[idx] = dataNew;
            }
        }
        else if (phase === vsdtConf.OPER_PHASE_END && operation === vsdtConf.OPER_DELETE) {
            // delete the item from the array
            var idx = $scope.jsonData.indexOf(dataOld);
            if (idx !== -1) {
                $scope.jsonData.splice(idx, 1);
            }
        }
    };

    // row selected/deselected callback
    var onRowSelect = function (operation, rowData) {
        console.log('*** PARENT - onRowSelect - operation: ', operation, ' - rowData: ', rowData);
    };

    var generatedItemCount = 2000;

    // Configuration of the vsdatatable
    $scope.opt = {
        data: {
            items: '',
            dataOperationCb: onDataOperation,
            extDataPagination: false
        },
        caption: {
            text: 'vsdatatable example'
        },
        busyIcon: {         // Currently this works only if the extDataPagination is true
            visible: false,
            text: 'Loading data...'
        },
        showTooltips: true,
        showOverlay: true,
        headerVisible: true,
        columnResize: true,
        columns: [
            {
                prop: 'id',
                label: 'Id number',
                sorting: false,
                filter: {template: colInputFilterTemplate, match: 'contain'},
                width: {number: 5, unit: '%'},
                visible: false
            },
            {
                prop: 'active',
                label: 'Active',
                textAlign: 'center',
                sorting: true,
                filter: {template: colSelectActiveFilterTemplate, match: 'exact'},
                width: {number: 8, unit: '%'},
                visible: true,
                rules: [
                    {
                        style: 'activeStyle',
                        prop: 'active',
                        expression: 'active === true'
                    },
                    {
                        style: 'inactiveStyle',
                        prop: 'active',
                        expression: 'active === false'
                    }
                ]
            },
            {
                prop: 'car.price',  // Value from second level (property price from the car object)
                label: 'Car.price',
                textAlign: 'right',
                sorting: true,
                filter: {template: colInputFilterTemplate, match: 'contain'},
                width: {number: 10, unit: '%'},
                visible: true,
                rules: [
                    {
                        style: 'carPriceStyleGreen',
                        prop: 'car.price',
                        expression: 'car.price >= 150000 && car.price <= 250000'
                    },
                    {
                        style: 'carPriceStyleRed',
                        prop: 'car.price',
                        expression: 'car.price < 30000'
                    }
                ]
            },
            {
                prop: 'car.features',  // Value from second level (property class from the car object)
                label: 'Car.features',
                textAlign: 'center',
                sorting: true,
                filter: {template: colSelectCarFeaturesFilterTemplate, match: 'exact'},
                width: {number: 10, unit: '%'},
                visible: true,
                rules: [
                    {
                        style: 'carFeatures1Style',
                        prop: 'car.features',
                        expression: 'car.features === 1'
                    },
                    {
                        style: 'carFeatures2Style',
                        prop: 'car.features',
                        expression: 'car.features === 2'
                    },
                    {
                        style: 'carFeatures3Style',
                        prop: 'car.features',
                        expression: 'car.features === 3'
                    }
                ]
            },
            {
                prop: 'car.age',
                label: 'Car.age',
                textAlign: 'right',
                sorting: true,
                filter: {template: colInputFilterTemplate, match: 'contain'},
                width: {number: 10, unit: '%'},
                visible: true
            },
            {
                prop: 'name',
                label: 'Name',
                sorting: true,
                filter: {template: colInputFilterTemplate, match: 'contain'},
                width: {number: 17, unit: '%'},
                visible: true
            },
            {
                prop: 'date',
                label: 'Date',
                textAlign: 'right',
                sorting: true,
                filter: {template: colInputFilterTemplate, match: 'contain'},
                //filter: {template: colInputFilterTemplate, match: 'daterange',dateFormat: 'yyyy-mm-dd'}, // 2012-10-22 - 2012-11-28
                width: {number: 15, unit: '%'},
                visible: true
            },
            {
                prop: 'about',
                label: 'About',
                textAlign: 'left',
                sorting: false,
                filter: {template: colInputFilterTemplate, match: 'contain'},
                width: {number: 20, unit: '%'},
                visible: true
            }
        ],
        row: {
            selection: 1, // 0=No, 1=Single, 2=Multiple
            rowSelectCb: onRowSelect,
            hover: true
        },
        columnToggler: {
            visible: true,
            btnTooltip: 'Select columns',
            menuTitle: 'Columns'
        },
        filter: {
            global: true,
            column: true,
            autoFilter: {
                useAutoFilter: true,
                filterDelay: 600
            },
            globalPlaceholder: 'Type filter...',
            showFilterBtnTooltip: 'Show filter',
            hideFilterBtnTooltip: 'Hide filter',
            filterBtn: {
                visible: false,
                filterBtnTooltip: 'Filter'
            }
        },
        paginator: {
            visible: true,
            numberBtnCount: 3,
            prevNextBtn: {
                visible: true,
                labels: ['back', 'next']
            },
            prevNextSetBtn: {
                visible: true,
                labels: ['...', '...']
            },
            firstLastBtn: {
                visible: true,
                labels: ['first', 'last']
            },
            pageSizeOptions: [
                {label: '4', rows: 4},
                {label: '7', rows: 7, default: true},
                {label: '15', rows: 15},
                {label: '20', rows: 20}],
            pageSizeTxt: 'Page size: ',
            totalItemsTxt: 'Total: '
        },
        useTemplates: true,
        actionColumnText: 'Action',
        templates: {
            add: {
                path: 'partials/add_edit.html',
                actionBtnShow: true,
                btnTooltip: 'Add',
                defaultValues: {car: {features: 1}, active: false} // Set car features default to 1 and active to false
            },
            edit: {path: 'partials/add_edit.html', actionBtnShow: true, btnTooltip: 'Edit'},
            delete: {path: 'partials/view_delete.html', actionBtnShow: true, btnTooltip: 'Delete'},
            view: {path: 'partials/view_delete.html', actionBtnShow: true, btnTooltip: 'View'}
        }
    };

    // Helper function to generate sample data to the vsdatatable
    function generateData() {
        for (var i = 0; i < generatedItemCount; i++) {
            var pr = price(300000, 10000);
            var item = {
                id: i + 1,
                active: (i % 6 === 0 || i % 7 === 0) ? true : false,
                car: {
                    price: pr,
                    features: pr <= 100000 ? 1 : pr <= 200000 ? 2 : 3,
                    age: Math.round((Math.random() * 58) + 1)
                },
                name: 'User ' + Math.round((Math.random() * 5000) + 10),
                date: Math.round((Math.random() * 25) + 1990) + '-' + date(12, 1) + '-' + date(28, 1),
                about: 'About number ' + Math.round((Math.random() * 5000000) + 1, 2) + ' with lorem ipsum dolor sit amet, consectetuer adipiscing elit sed posuere interdum sem sini rea dolor amet elit number ' + Math.round((Math.random() * 5000000) + 1, 2) + '.'
            };
            $scope.jsonData.push(item);
        }

        $scope.opt.data.items = $scope.jsonData;
    }

    // Helper function to generate sample data to the vsdatatable
    function date(max, min) {
        var d = Math.round((Math.random() * max) + min).toString();
        if (d.length === 1) {
            return '0' + d;
        }
        return d;
    }

    // Helper function to generate sample data to the vsdatatable
    function price(max, min) {
        var b = Math.round((Math.random() * max) + min) + '.' + Math.round((Math.random() * 99) + 1).toString();
        return parseFloat(b);
    }

    generateData();

});

