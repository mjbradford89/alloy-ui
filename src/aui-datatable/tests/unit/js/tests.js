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

            new Y.DataTable({
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
                        if (sortBy === "ascending") {
                            sortedCorrectly = prevCellHtml <= item.html();
                        }
                        else {
                            sortedCorrectly = prevCellHtml >= item.html();
                        }
                    }

                    prevCellHtml = item.html();
                }
            );

            Y.Assert.isTrue(sortedCorrectly);
        },

        'navigate on arrow keys': function() {

        },

        'open editor on double click': function() {

        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-datatable', 'node', 'node-event-simulate', 'test']
});
