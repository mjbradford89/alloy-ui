/**
 * The Scheduler Component
 *
 * @module aui-scheduler
 * @submodule aui-scheduler-view-month
 */

var Lang = A.Lang,
    isFunction = Lang.isFunction,

    DateMath = A.DataType.DateMath,

    getCN = A.getClassName,

    CSS_SVM_TABLE_DATA_COL_NOMONTH = getCN('scheduler-view-month', 'table', 'data', 'col', 'nomonth'),
    CSS_SVT_TABLE_DATA_COL_TITLE = getCN('scheduler-view', 'table', 'data', 'col', 'title');

/**
 * A base class for `SchedulerMonthView`.
 *
 * @class A.SchedulerMonthView
 * @extends A.SchedulerTableView
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
var SchedulerMonthView = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type {String}
     * @static
     */
    NAME: 'scheduler-view-month',

    /**
     * Static property used to define the default attribute
     * configuration for the `SchedulerMonthView`.
     *
     * @property ATTRS
     * @type {Object}
     * @static
     */
    ATTRS: {

        /**
         * Contains the number of Days to display in a month view.
         *
         * @attribute displayDaysInterval
         * @default 42
         * @type {Number}
         * @readOnly
         */
        displayDaysInterval: {
            readOnly: true,
            value: 42
        },

        /**
         * Determines the name for this month view.
         *
         * @attribute name
         * @default 'month'
         * @type {String}
         */
        name: {
            value: 'month'
        },

        /**
         * Contains the function that formats the navigation date.
         *
         * @attribute navigationDateFormatter
         * @type {Function}
         */
        navigationDateFormatter: {
            value: function(date) {
                var instance = this;
                var scheduler = instance.get('scheduler');

                return A.DataType.Date.format(
                    date, {
                        format: '%B %Y',
                        locale: scheduler.get('locale')
                    }
                );
            },
            validator: isFunction
        }
    },

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type {Object}
     * @static
     */
    EXTENDS: A.SchedulerTableView,

    prototype: {

        bindUI: function() {
            var instance = this;

            instance._eventHandles = [
                instance.columnTableGrid.on('key', instance._onNewKeyUp, 'up:78', instance),
                instance.columnTableGrid.on('key', instance._onNewKeyDown, 'down:78', instance),
                instance.columnTableGrid.on('key', instance._onEnterKeyDown, 'down:13', instance)
            ];
        },

        destructor: function() {
            var instance = this;

            (new A.EventHandle(instance._eventHandles)).detach();
        },

        /**
         * Returns a date value of the first day of the month with its time
         * adjusted to midnight.
         *
         * @method getAdjustedViewDate
         * @param {Date} date
         * @return {Date}
         */
        getAdjustedViewDate: function(date) {
            return DateMath.toMidnight(DateMath.findMonthStart(date));
        },

        /**
         * Returns the value of the date that follows the month view's current
         * date.
         *
         * @method getNextDate
         * @return {Date}
         */
        getNextDate: function() {
            var instance = this;

            var scheduler = instance.get('scheduler');
            var viewDate = scheduler.get('viewDate');

            return DateMath.toLastHour(DateMath.add(viewDate, DateMath.MONTH, 1));
        },

        /**
         * Returns the value of the date that preceeds the month view's current
         * date.
         *
         * @method getPrevDate
         * @return {Date}
         */
        getPrevDate: function() {
            var instance = this;

            var scheduler = instance.get('scheduler');
            var viewDate = scheduler.get('viewDate');

            return DateMath.toMidnight(DateMath.subtract(viewDate, DateMath.MONTH, 1));
        },

        /**
         * Plots all events in the current view.
         *
         * @method plotEvents
         */
        plotEvents: function() {
            var instance = this;

            A.SchedulerMonthView.superclass.plotEvents.apply(instance, arguments);

            var scheduler = instance.get('scheduler');
            var viewDate = scheduler.get('viewDate');

            var monthEnd = DateMath.findMonthEnd(viewDate);
            var monthStart = DateMath.findMonthStart(viewDate);

            var currentIntervalStart = instance._findCurrentIntervalStart();

            var colTitleNodes = instance.tableRowContainer.all('.' + CSS_SVT_TABLE_DATA_COL_TITLE);

            colTitleNodes.each(function(colTitleNode, index) {
                var celDate = DateMath.add(currentIntervalStart, DateMath.DAY, index);

                if (DateMath.before(celDate, monthStart) || DateMath.after(celDate, monthEnd)) {
                    colTitleNode.addClass(CSS_SVM_TABLE_DATA_COL_NOMONTH);
                }
            });
        },

        _afterVisibleChange: function(event) {
            var instance = this;

            if (instance.get('rendered')) {
                if (instance.get('visible')) {
                    instance.columnTableGrid.setAttribute('tabindex', 0);
                }
                else {
                    instance.columnTableGrid.removeAttribute('tabindex');
                }
            }
        },

        /**
         * Returns the current interval start by finding the first day of the
         * week with the `Scheduler`'s `viewDate`.
         *
         * @method _findCurrentIntervalStart
         * @protected
         * @return {Date} The current interval start from the first day of the
         * week with the `Scheduler`'s `viewDate`.
         */
        _findCurrentIntervalStart: function() {
            var instance = this;
            var scheduler = instance.get('scheduler');
            var viewDate = scheduler.get('viewDate');

            return instance._findFirstDayOfWeek(viewDate);
        },

        /**
         * Returns the first day of the week with given `Date`.
         *
         * @method _findFirstDayOfWeek
         * @param {Date} date
         * @protected
         * @return {Date} The first day of the week with given `Date`.
         */
        _findFirstDayOfWeek: function(date) {
            var instance = this;

            var scheduler = instance.get('scheduler');
            var firstDayOfWeek = scheduler.get('firstDayOfWeek');

            return DateMath.getFirstDayOfWeek(date, firstDayOfWeek);
        },

        /**
         * Fires on enter key down on table cell.
         *
         * @method _onEnterKeyDown
         * @param {EventFacade} event
         * @protected
         */
        _onEnterKeyDown: function(event) {
            var instance = this,
                target = event.target,
                position = target.getData('position'),
                scheduler = instance.get('scheduler'),
                date = instance._getPositionDate([position.col, position.row]),
                dayView = scheduler.getViewByName('day');

            if (dayView) {
                scheduler.set('activeView', dayView);
                scheduler.set('date', date);
            }
        },

        /**
         * Fires on 'N' key down on table cell.
         *
         * @method _onNewKeyDown
         * @param {EventFacade} event
         * @protected
         */
        _onNewKeyDown: function(event) {
            var instance = this,
                target = event.target,
                centerXY = target.getCenterXY();

            event.pageX = centerXY[0];
            event.pageY = centerXY[1];

            instance._onMouseDownGrid(event);

            instance._enterTabHandler = instance.columnTableGrid.on('key', instance._onNewKeyTab, 'up:9', instance);
        },

        /**
         * Fires on 'tab' key on table cell.
         *
         * @method _onNewKeyTab
         * @param {EventFacade} event
         * @protected
         */
        _onNewKeyTab: function(event) {
            var instance = this,
                target = event.target,
                centerXY = target.getCenterXY();

            event.pageX = centerXY[0];
            event.pageY = centerXY[1];

            instance._onMouseMoveGrid(event);
        },

        /**
         * Fires on 'N' key up on table cell.
         *
         * @method _onNewKeyUp
         * @param {EventFacade} event
         * @protected
         */
        _onNewKeyUp: function(event) {
            var instance = this,
                target = event.target,
                centerXY = target.getCenterXY();

            instance._onMouseUpGrid();

            instance._enterTabHandler.detach();
        }
    }
});

A.SchedulerMonthView = SchedulerMonthView;
