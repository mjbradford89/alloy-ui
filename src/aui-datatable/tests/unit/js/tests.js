YUI.add('aui-datatable-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-datatable');

    suite.add(new Y.Test.Case({
        name: 'Datatable',

        init: function() {
            var data = [
                { name: 'Joan B. Jones', address: '3271 Another Ave', city: 'New York', state: 'AL', amount: 3, active: 'no', colors: ['red','blue'], fruit: ['apple'], date: '2013-01-01' },
                { name: 'Bob C. Uncle', address: '9996 Random Road', city: 'Los Angeles', state: 'CA', amount: 0, active: 'maybe', colors: ['green'], fruit: ['cherry'], date: '2013-01-01' },
                { name: 'John D. Smith', address: '1623 Some Street', city: 'San Francisco', state: 'CA', amount: 5, active: 'yes', colors: ['red'], fruit: ['cherry'], date: '' },
                { name: 'Joan E. Jones', address: '3217 Another Ave', city: 'New York', state: 'KY', amount: 3, active: 'no', colors: ['red','blue'], fruit: ['apple','cherry'], date: '2013-01-06' }
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
                            options: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA"]
                        })
                    },
                    'amount',
                    {
                        key:"active",
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
                        key:"colors",
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
                    'topLeft': [0, 0],
                    'topRight': [0, 1],
                    'bottomLeft': [1, 0],
                    'bottomRight': [1, 1]
                };

            dataTable.focus();
            dataTable.set('activeCoord', cellCoords['topLeft']);
            dataTable.set('selection', cellCoords['topLeft']);

            //simulate right arrow key press

            boundingBox.simulate('keydown', { keyCode: 39 });
            activeCoords = dataTable.get('activeCoord');

            Y.ArrayAssert.itemsAreSame(cellCoords['topRight'], activeCoords, 'Right arrow should have moved selection.');

            //simulate down arrow key press

            boundingBox.simulate('keydown', { keyCode: 40 });
            activeCoords = dataTable.get('activeCoord');

            Y.ArrayAssert.itemsAreSame(cellCoords['bottomRight'], activeCoords, 'Down arrow should have moved selection.');

            //simulate left arrow key press

            boundingBox.simulate('keydown', { keyCode: 37 });
            activeCoords = dataTable.get('activeCoord');

            Y.ArrayAssert.itemsAreSame(cellCoords['bottomLeft'], activeCoords, 'Left arrow should have moved selection.');

            //simulate up arrow key press

            boundingBox.simulate('keydown', { keyCode: 38 });
            activeCoords = dataTable.get('activeCoord');

            Y.ArrayAssert.itemsAreSame(cellCoords['topLeft'], activeCoords, 'Up arrow should have moved selection.');
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
                prevCellHtml,
                sortedCorrectly = true;

            sortableHeader.simulate('click');

            var sortBy = sortableHeader.get('aria-sort');

            Y.all('.table-cell.table-col-' + colId).each(
                function(item, index, collection) {
                    if (prevCellHtml) {
                        if (sortBy === 'ascending') {
                            sortedCorrectly = prevCellHtml <= item.html();
                        }
                        else {
                            sortedCorrectly = prevCellHtml >= item.html();
                        }
                    }

                    prevCellHtml = item.html();
                }
            );

            Y.Assert.isTrue(sortedCorrectly, 'Items are not sorted correctly.');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-datatable', 'node', 'node-event-simulate', 'test']
});
