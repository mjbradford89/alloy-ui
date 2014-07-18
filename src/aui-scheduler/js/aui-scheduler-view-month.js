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

    WEEK_LENGTH = DateMath.WEEK_LENGTH,

    CSS_SVT_COLGRID = getCN('scheduler-view', 'table', 'colgrid'),
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

        /**
         * Construction logic executed during `SchedulerWeekView` instantiation.
         * Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this,
                markerNodeClass = instance.get('markerNodeClass');

            instance.tableRowContainer.delegate(
                'key', A.bind(instance._onArrowKeysVertical, instance), 'down:38,40', '.' + CSS_SVT_COLGRID);
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
         * Handles up/down arrow key press events.
         *
         * @method _onArrowKeysVertical
         * @param {EventFacade} event
         * @protected
         */
        _onArrowKeysVertical: function(event) {
            var instance = this,
                focusManager = instance.tableRowContainer.focusManager,
                activeDescendant = focusManager.get('activeDescendant'),
                descendants = focusManager.get('descendants');

            if (event.isKey('up')) {
                if (activeDescendant > WEEK_LENGTH) {
                    activeDescendant -= WEEK_LENGTH;
                }
            }
            else if (event.isKey('down')) {
                if (activeDescendant < (descendants.size() - WEEK_LENGTH)) {
                    activeDescendant += WEEK_LENGTH;
                }
            }

            focusManager.focus(activeDescendant);

            event.preventDefault();
        },

    }
});

A.SchedulerMonthView = SchedulerMonthView;
