/**
 * The Scheduler Component
 *
 * @module aui-scheduler
 * @submodule aui-scheduler-view-week
 */

var Lang = A.Lang,
    isFunction = Lang.isFunction,
    isObject = Lang.isObject,
    isString = Lang.isString,

    DateMath = A.DataType.DateMath,

    getCN = A.getClassName,

    WEEK_LENGTH = DateMath.WEEK_LENGTH,

    CSS_SCHEDULER_VIEW_DAY_HEADER_DAY = getCN('scheduler-view', 'day', 'header', 'day'),
    CSS_SCHEDULER_VIEW_WEEK_DAY_MARKER = getCN('scheduler-view', 'week', 'day', 'marker');

/**
 * A base class for `SchedulerWeekView`.
 *
 * @class A.SchedulerWeekView
 * @extends A.SchedulerDayView
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
var SchedulerWeekView = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type {String}
     * @static
     */
    NAME: 'scheduler-view-week',

    /**
     * Static property used to define the default attribute
     * configuration for the `SchedulerWeekView`.
     *
     * @property ATTRS
     * @type {Object}
     * @static
     */
    ATTRS: {

        /**
         * Determines the content of Scheduler week view's body section.
         *
         * @attribute bodyContent
         * @default ''
         * @type {String}
         */
        bodyContent: {
            value: ''
        },

        /**
         * Contains the number of days in a week.
         *
         * @attribute days
         * @default 7
         * @type {Number}
         */
        days: {
            value: 7
        },

        /**
         * Configures the header week view.
         *
         * @attribute headerViewConfig
         */
        headerViewConfig: {
            value: {
                displayDaysInterval: WEEK_LENGTH
            }
        },

        /**
         * String representing the table marker class.
         *
         * @attribute markerNodeClass
         * @default '.' + CSS_SCHEDULER_VIEW_DAY_MARKER_CHILD
         * @type {String}
         */
        markerNodeClass: {
            value: '.' + CSS_SCHEDULER_VIEW_WEEK_DAY_MARKER,
            validator: isString
        },

        /**
         * Determines the name for this week view.
         *
         * @attribute name
         * @default 'week'
         * @type {String}
         */
        name: {
            value: 'week'
        },

        /**
         * Contains the formatted navigation date formatter for this week view.
         *
         * @attribute navigationDateFormatter
         * @type {Function}
         */
        navigationDateFormatter: {
            valueFn: function() {
                return this._valueNavigationDateFormatter;
            },
            validator: isFunction
        },

        /**
        * Defines the keyboard configuration object for
        * `Plugin.NodeFocusManager`.
        *
        * @attribute weekGridFocusmanager
        * @default {
        *    activeDescendant: 0,
        *    circular: false,
        *    descendants: '.' + CSS_SCHEDULER_VIEW_DAY_MARKER_CHILD,
        *    keys: {
        *        next: 'down:40',
        *        previous: 'down:38'
        *    }
        * }
        * @type {Object}
        */
        weekGridFocusmanager: {
            value: {
                activeDescendant: 0,
                circular: false,
                descendants: '.' + CSS_SCHEDULER_VIEW_WEEK_DAY_MARKER,
                keys: {
                    next: 'down:39',
                    previous: 'down:37'
                }
            },
            validator: isObject
        },

        /**
        * Defines the keyboard configuration object for
        * `Plugin.NodeFocusManager`.
        *
        * @attribute weekHeaderGridFocusManager
        * @default {
        *       activeDescendant: 0,
        *       circular: false,
        *       descendants: '.' + CSS_SCHEDULER_VIEW_DAY_HEADER_DAY + '> a',
        *       keys: {
        *           next: 'down:39',
        *           previous: 'down:37'
        *       }
        * }
        * @type {Object}
        */
        weekHeaderGridFocusManager: {
            value: {
                activeDescendant: 0,
                circular: false,
                descendants: '.' + CSS_SCHEDULER_VIEW_DAY_HEADER_DAY + '> a',
                keys: {
                    next: 'down:39',
                    previous: 'down:37'
                }
            },
            validator: isObject
        }
    },

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type {Object}
     * @static
     */
    EXTENDS: A.SchedulerDayView,

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

            instance.tableNode.delegate(
                'key', A.bind(instance._onArrowKeysVertical, instance), 'down:38,40', markerNodeClass);

            instance._syncStyleSheetMarker();
        },

        /**
         * Returns a date value of the first day of the week with its time
         * adjusted to midnight.
         *
         * @method getAdjustedViewDate
         * @param {Date} date
         * @return {Date}
         */
        getAdjustedViewDate: function(date) {
            var instance = this;
            var scheduler = instance.get('scheduler');
            var firstDayOfWeek = scheduler.get('firstDayOfWeek');

            return DateMath.toMidnight(DateMath.getFirstDayOfWeek(date, firstDayOfWeek));
        },

        /**
         * Returns the value of the date that follows the week view's current
         * date.
         *
         * @method getNextDate
         * @return {Date}
         */
        getNextDate: function() {
            var instance = this;
            var scheduler = instance.get('scheduler');
            var viewDate = scheduler.get('viewDate');

            return DateMath.toLastHour(DateMath.add(viewDate, DateMath.WEEK, 1));
        },

        /**
         * Returns the value of the date that preceeds the week view's current
         * date.
         *
         * @method getPrevDate
         * @return {Date}
         */
        getPrevDate: function() {
            var instance = this;
            var scheduler = instance.get('scheduler');
            var viewDate = scheduler.get('viewDate');

            return DateMath.toMidnight(DateMath.subtract(viewDate, DateMath.WEEK, 1));
        },

        /**
         * Returns the value of the week view's current date.
         *
         * @method getToday
         * @return {Date}
         */
        getToday: function() {
            var instance = this;
            var todayDate = SchedulerWeekView.superclass.getToday.apply(this, arguments);

            return instance._firstDayOfWeek(todayDate);
        },

        /**
         * Binds the `Plugin.NodeFocusManager` that handles day view
         * table node keyboard navigation.
         *
         * @method _bindDayFocusManager
         * @protected
         */
        _bindFocusManager: function(visible) {
            var instance = this;

            if (visible) {
                instance.tableNode.plug(A.Plugin.NodeFocusManager, instance.get('weekGridFocusmanager'));
                instance.headerTableNode.plug(A.Plugin.NodeFocusManager, instance.get('weekHeaderGridFocusManager'));

                instance.descendantChangeHandler = instance.tableNode.focusManager.after(
                    'activeDescendantChange', instance._afterActiveDescendantChange, instance);
            }
            else {
                if (instance.descendantChangeHandler) {
                    instance.descendantChangeHandler.detach();

                    instance.tableNode.unplug(A.Plugin.NodeFocusManager);
                }
            }
        },

        /**
         * Returns the value of the first day of week in this view.
         *
         * @method _firstDayOfWeek
         * @param {Date} date
         * @return {Date}
         * @protected
         */
        _firstDayOfWeek: function(date) {
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
                focusManager = instance.tableNode.focusManager,
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

        /**
         * Creates a 'A.StyleSheet' that sizes the marker nodes based on number of days.
         *
         * @method _syncStyleSheetMarker
         * @param {EventFacade} event
         * @protected
         */
        _syncStyleSheetMarker: function() {
            var instance = this,
                markerNodeClass = instance.get('markerNodeClass'),
                width = (100 / instance.get('days')),
                css = markerNodeClass + '{ width:' + width + '%; }',
                sheet = new A.StyleSheet(css);
        },

        /**
         * Returns a formatted navigation date formatter for this week view.
         *
         * @method _valueNavigationDateFormatter
         * @param {Date} date
         * @return {Date}
         * @protected
         */
        _valueNavigationDateFormatter: function(date) {
            var instance = this;
            var scheduler = instance.get('scheduler');
            var locale = scheduler.get('locale');

            var startDate = instance._firstDayOfWeek(date);

            var startDateLabel = A.DataType.Date.format(
                startDate, {
                    format: '%B %d',
                    locale: locale
                }
            );

            var endDate = DateMath.add(startDate, DateMath.DAY, instance.get('days') - 1);

            var endDateLabel = A.DataType.Date.format(
                endDate, {
                    format: (DateMath.isMonthOverlapWeek(date) ? '%B %d' : '%d') + ', %Y',
                    locale: locale
                }
            );

            return [startDateLabel, '&mdash;', endDateLabel].join(' ');
        }
    }
});

A.SchedulerWeekView = SchedulerWeekView;
