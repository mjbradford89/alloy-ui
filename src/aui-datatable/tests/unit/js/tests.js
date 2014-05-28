YUI.add('aui-datatable-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-datatable');

    suite.add(new Y.Test.Case({
        name: 'Datatable',

        init: function() {
            var data = [
                {
                    active: 'no',
                    address: '3271 Another Ave',
                    amount: 3,
                    city: 'New York',
                    colors: ['red','blue'],
                    date: '2013-01-01',
                    fruit: ['apple'],
                    name: 'Joan B. Jones',
                    state: 'AL'
                },
                {
                    active: 'maybe',
                    address: '9996 Random Road',
                    amount: 0,
                    city: 'Los Angeles',
                    colors: ['green'],
                    date: '2013-01-01',
                    fruit: ['cherry'],
                    name: 'Bob C. Uncle',
                    state: 'CA'
                },
                {
                    active: 'yes',
                    address: '1623 Some Street',
                    amount: 5,
                    city: 'San Francisco',
                    colors: ['red'],
                    date: '',
                    fruit: ['cherry'],
                    name: 'John D. Smith',
                    state: 'CA'
                },
                {
                    active: 'no',
                    address: '3217 Another Ave',
                    amount: 3,
                    city: 'New York',
                    colors: ['red','blue'],
                    date: '2013-01-06',
                    fruit: ['apple','cherry'],
                    name: 'Joan E. Jones',
                    state: 'KY'
                }
            ];

            this._dataTable = new Y.DataTable({
                cssClass: 'table-striped',
                boundingBox: '#datatable',
                columns: [
                    {
                        key: 'name',
                        sortable: true,
                        editor: new Y.TextAreaCellEditor({
                            on: {
                                save: function(event) {
                                    console.log('save', event.newVal);
                                },
                                cancel: function(event) {
                                    console.log('cancel', event);
                                }
                            },
                            validator: {
                                rules: {
                                    value: {
                                        required: true
                                    }
                                }
                            }
                        })
                    },
                    {
                        key: 'address',
                        editor: new Y.TextAreaCellEditor()
                    },
                    {
                        key: 'city',
                        editor: new Y.TextAreaCellEditor()
                    },
                    {
                        key: 'state',
                        editor: new Y.DropDownCellEditor({
                            editable: true,
                            options: ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA']
                        })
                    },
                    'amount',
                    {
                        key:'active',
                        editor: new Y.RadioCellEditor({
                            editable: true,
                            options: {
                                yes: 'Yes',
                                no: 'No',
                                maybe: 'Maybe'
                            }
                        })
                    },
                    {
                        key:'colors',
                        editor: new Y.CheckboxCellEditor({
                            editable: true,
                            multiple: true,
                            options: {
                                red: 'Red',
                                green: 'Green',
                                blue: 'Blue'
                            }
                        })
                    },
                    {
                        key: 'fruit',
                        sortable: true,
                        editor: new Y.DropDownCellEditor({
                            editable: true,
                            multiple: true,
                            options: {
                                apple: 'Apple',
                                cherry: 'Cherry',
                                banana: 'Banana',
                                kiwi: 'Kiwi'
                            }
                        })
                    },
                    {
                        key: 'date',
                        sortable: true,
                        editor: new Y.DateCellEditor({
                            calendar: {
                                width:'400px',
                                showPrevMonth: true,
                                showNextMonth: true,
                                selectionMode: 'multiple'
                            }
                        })
                    }
                ],
                data: data,
                editEvent: 'dblclick',
                plugins: [
                    {
                        fn: Y.Plugin.DataTableHighlight
                    }
                ]
            }).render();
        },

        'navigate on arrow keys': function() {
            var dataTable = this._dataTable,
                activeCoords,
                boundingBox = dataTable.get('boundingBox'),
                cellCoords = {
                    topLeft: [0, 0],
                    topRight: [0, 1],
                    bottomLeft: [1, 0],
                    bottomRight: [1, 1]
                };

            dataTable.focus();
            dataTable.set('activeCoord', cellCoords.topLeft);
            dataTable.set('selection', cellCoords.topLeft);

            //simulate right arrow key press

            boundingBox.simulate('keydown', { keyCode: 39 });
            activeCoords = dataTable.get('activeCoord');

            Y.ArrayAssert.itemsAreSame(cellCoords.topRight, activeCoords, 'Right arrow should have moved selection.');

            //simulate down arrow key press

            boundingBox.simulate('keydown', { keyCode: 40 });
            activeCoords = dataTable.get('activeCoord');

            Y.ArrayAssert.itemsAreSame(cellCoords.bottomRight, activeCoords, 'Down arrow should have moved selection.');

            //simulate left arrow key press

            boundingBox.simulate('keydown', { keyCode: 37 });
            activeCoords = dataTable.get('activeCoord');

            Y.ArrayAssert.itemsAreSame(cellCoords.bottomLeft, activeCoords, 'Left arrow should have moved selection.');

            //simulate up arrow key press

            boundingBox.simulate('keydown', { keyCode: 38 });
            activeCoords = dataTable.get('activeCoord');

            Y.ArrayAssert.itemsAreSame(cellCoords.topLeft, activeCoords, 'Up arrow should have moved selection.');
        },

        'open editor on double click': function() {
            var dataTable = this._dataTable,
                firstCell = dataTable.getCell([0, 0]);

            firstCell.simulate('dblclick');

            var editorNode = Y.one('.basecelleditor');

            Y.Assert.isNotNull(editorNode, 'The editor should have been opened.');
        },

        'cancel cell editor': function() {
            var cell = this._dataTable.getCell([0, 0]),
                newVal = 'Testing editor node save.',
                originalVal = cell.html();

            cell.simulate('dblclick');

            var editorNode = Y.one('.basecelleditor'),
                cancelBtn = editorNode.all('button').item(1),
                textArea = editorNode.one('textarea');

            textArea.val(newVal);

            cancelBtn.focus().simulate('click');

            Y.Assert.areEqual(cell.html(), originalVal);
        },

        'save cell edit': function() {
            var cell = this._dataTable.getCell([0, 0]),
                newVal = 'Testing editor node save.';

            cell.simulate('dblclick');

            var editorNode = Y.one('.basecelleditor'),
                textArea = editorNode.one('textarea'),
                saveBtn = editorNode.all('button').item(0);

            textArea.val(newVal);

            saveBtn.focus().simulate('click');

            Y.Assert.areEqual(cell.html(), newVal);
        },

        'fields sorted on caret click': function() {
            var sortableHeader = Y.one('.table-sortable-column'),
                colId = sortableHeader.getData('yui3-col-id'),
                columnList = Y.all('.table-cell.table-col-' + colId);

            sortableHeader.simulate('click');

            var sortBy = sortableHeader.get('aria-sort');

            Y.Assert.isTrue(
                columnList.some(
                    function(item, index) {
                        var sorted;

                        if (index > 0) {
                            var html = item.html(),
                                prevCell = columnList.item(index - 1),
                                prevCellHtml = prevCell.html();

                            if (sortBy === 'ascending') {
                                sorted = prevCellHtml <= html;
                            }
                            else {
                                sorted = prevCellHtml >= html;
                            }

                            prevCellHtml = html;
                        }
                        else {
                            sorted = true;
                        }

                        return sorted;
                    }
                ),
                'Items are not sorted correctly.'
            );
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-datatable', 'node', 'node-event-simulate', 'test']
});
