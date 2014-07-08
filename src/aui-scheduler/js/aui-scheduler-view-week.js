/**
 * The Scheduler Component
 *
 * @module aui-scheduler
 * @submodule aui-scheduler-view-week
 */

var Lang = A.Lang,
    isFunction = Lang.isFunction,
    isNumber = Lang.isNumber,

    DateMath = A.DataType.DateMath,
    getCN = A.getClassName,

    CSS_SCHEDULER_VIEW_DAY_MARKER_CHILD = getCN('scheduler-view', 'marker', 'child'),
    CSS_SCHEDULER_VIEW_WEEK_DAY_MARKER = getCN('scheduler-view', 'week', 'day', 'marker'),
    CSS_SCHEDULER_VIEW_DAY_MARKER_DIVISION = getCN('scheduler-view', 'marker', 'division'),
    CSS_SCHEDULER_VIEW_DAY_MARKER_CHILD = getCN('scheduler-view', 'marker', 'child'),
    CSS_SCHEDULER_VIEW_DAY_TABLE_COL = getCN('scheduler-view', 'day', 'table', 'col'),

    TPL_SCHEDULER_VIEW_WEEK_MARKERCELL = '<div class="' + CSS_SCHEDULER_VIEW_WEEK_DAY_MARKER + '" data-weekday="{weekday}"></div>',

    WEEK_LENGTH = DateMath.WEEK_LENGTH;

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
         * Determines the 'tabindex' property to be used on elements
         * in this view.
         *
         * @attribute tabIndex
         * @default 1
         * @type {Number}
         */
        tabIndex: {
            value: 1,
            validator: isNumber
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

        initializer: function() {
            var instance = this;

            instance.createWeekdayMarkerNodes();
        },

        createWeekdayMarkerNodes: function() {
            var instance = this;

            if (!instance.weekdayMarkers) {
                var markerChildren = instance.markercellsNode.get('children');

                A.Array.each(markerChildren, function(item, index) {
                    item.each(function(node, index) {
                        for (var i = 0; i < instance.get('days'); i++) {
                            var dayNode = A.Node.create(
                                    Lang.sub(TPL_SCHEDULER_VIEW_WEEK_MARKERCELL, {
                                        weekday: i
                                    }
                                ));

                            node.append(dayNode);
                        }
                    });
                });

                instance.weekdayMarkers = instance.markercellsNode.all('.' + CSS_SCHEDULER_VIEW_WEEK_DAY_MARKER);
            }
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

        _onKeyDown: function(event) {
            var instance = this;

            if (instance.get('visible') && instance.get('name') === 'week') {
                var target = A.Node(document.activeElement);
                var parent = target.ancestor('.' + CSS_SCHEDULER_VIEW_DAY_MARKER_CHILD);
                var isTopOfHour = parent.hasClass(CSS_SCHEDULER_VIEW_DAY_MARKER_DIVISION);
                var col = parent.ancestor('.' + CSS_SCHEDULER_VIEW_DAY_TABLE_COL);
                var weekday = parseInt(target.getData('weekday'));
                var row = parseInt(parent.getData('index'));
                var focusTopOfHour = false;
                var toFocus = target;

                if (event.isKey('enter')) {
                    instance._spoofKeyToMouseEvent(event, weekday);

                    instance._enterKeyDown = true;

                    instance._onMouseDownTableCol(event);
                }
                else {
                    if (event.isKey('up')) {
                        if (isTopOfHour) {
                            row = row - 1;

                            if (row < 0) {
                                row = 0;
                                focusTopOfHour = true;
                            }
                        }
                        else {
                            focusTopOfHour = true;
                        }
                    }
                    else if (event.isKey('right')) {
                        weekday = Math.min(weekday + 1, 6);
                        focusTopOfHour = isTopOfHour;
                    }
                    else if (event.isKey('down')) {
                        if (!isTopOfHour) {
                            row = row + 1;

                            if (row > 23) {
                                row = 23;
                                focusTopOfHour = false;
                            }
                            else {
                                focusTopOfHour = true;
                            }
                        }
                        else {
                            focusTopOfHour = false;
                        }
                    }
                    else if (event.isKey('left')) {
                        weekday = Math.max(weekday - 1, 0);
                        focusTopOfHour = isTopOfHour;
                    }

                    toFocus = instance.getChildMarker(row, weekday, focusTopOfHour);

                    instance.focusMarker(toFocus);

                    if (instance._enterKeyDown) {
                        instance._spoofKeyToMouseEvent(event, weekday);

                        instance._onMouseMoveTableCol(event);
                    }
                }

                event.preventDefault();
            }
        },

        _spoofKeyToMouseEvent: function(event, weekday) {
            var instance = this;
            var centerXY = event.target.getCenterXY();
            var scheduler = instance.get('scheduler');
            var column = instance.columnData.one('[data-colnumber="' + weekday + '"]');

            event.pageX = centerXY[0];
            event.pageY = centerXY[1];
            event.currentTarget = column;
        },

        /**
         * Fires on enter key up event.
         *
         * @method _onKeyUp
         * @protected
         */
        _onKeyUp: function(event) {
            var instance = this;

            if (instance.get('visible') && instance.get('name') === 'week') {
                var target = event.target;
                var column = target.getData('weekday');

                instance._enterKeyDown = false;

                instance._spoofKeyToMouseEvent(event, column);

                instance._updateRecorderDate(event);

                instance._onMouseUpTableCol(event);
            }
        },

        /**
         * Updates dates on recorder based on Key event.
         *
         *
         * @method _updateRecorderDate
         * @param {EventFacade} event
         * @protected
         */
        _updateRecorderDate: function(event) {
            var instance = this;
            var target = event.target;
            var col = parseInt(target.getData('weekday'));
            var scheduler = instance.get('scheduler');
            var recorder = scheduler.get('eventRecorder');
            var date = instance.getDateByColumn(col);
            var focusedMarker = A.Node(document.activeElement);
            var hour = parseInt(focusedMarker.ancestor().getData('index'));
            var startDate = recorder.get('startDate');

            date.setHours(hour);

            if (!focusedMarker.hasClass(CSS_SCHEDULER_VIEW_DAY_MARKER_DIVISION)) {
                date.setMinutes(30);
            }

            if (DateMath.after(date, startDate)) {
                recorder.set('endDate', date);
            }
            else {
                recorder.set('startDate', date);
            }
        },

        focusMarker: function(markerNode) {
            var instance = this;

            instance.weekdayMarkers.removeAttribute('tabindex');

            markerNode.setAttribute('tabindex', instance.get('tabIndex'));

            markerNode.focus();
        },

        getChildMarker: function(row, weekday, first) {
            var instance = this;

            var markercellsNodes = instance.markercellsNode.all('[data-index="' + row + '"]');
            var markercellsNode;

            if (first) {
                markercellsNode = markercellsNodes.first();
            }
            else {
                markercellsNode = markercellsNodes.last();
            }

            return markercellsNode.one('[data-weekday="' + weekday + '"]');
        },

        /**
         * Fires after day view visibleChange
         *
         * @method _afterVisibleChange
         * @param {EventFacade} event
         * @protected
         */
        _afterVisibleChange: function(event) {
            var instance = this;

            if (instance.get('visible') && instance.get('rendered') && instance.get('name') == 'week') {
                instance.focusMarker(instance.getChildMarker(0, 0, true));
            }
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
