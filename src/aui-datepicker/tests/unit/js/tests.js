YUI.add('aui-datepicker-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-datepicker');

    suite.add(new Y.Test.Case({
        name: 'Datepicker Tests',
        'selectionChange event should only fire when selection changes': function() {
        	var selectionChangeCount = 0;
            var trigger = Y.one('#trigger');

            var datePicker = new Y.DatePicker({
                on: {
                    selectionChange: function(event) {
                        selectionChangeCount++;
                    }
                },
                popover: {
                    zIndex: 1
                },
                panes: 1,
                trigger: '#trigger'
            });

            var popover = datePicker.getPopover();

            Y.Assert.areEqual(0, selectionChangeCount);

            datePicker.show();

            trigger.simulate('click');

            Y.Assert.areEqual(0, selectionChangeCount);

            var dayCell = popover.bodyNode.one('.yui3-calendar-day');

            dayCell.simulate('click');

            Y.Assert.areEqual(1, selectionChangeCount);

            trigger.simulate('click');

            Y.Assert.areEqual(1, selectionChangeCount);

            dayCell.next().simulate('click');

            Y.Assert.areEqual(2, selectionChangeCount);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'node-event-simulate', 'aui-datepicker']
});
