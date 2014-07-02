/**
 * The Scheduler Component
 *
 * @module aui-scheduler
 * @submodule aui-scheduler-view-month
 */

var Lang = A.Lang,
    isFunction = Lang.isFunction,
    isNumber = Lang.isNumber,

    DateMath = A.DataType.DateMath,
    WEEK_LENGTH = DateMath.WEEK_LENGTH,

    getCN = A.getClassName,

    CSS_SVM_TABLE_DATA_COL_NOMONTH = getCN('scheduler-view-month', 'table', 'data', 'col', 'nomonth'),
    CSS_SVT_TABLE_DATA_COL_TITLE = getCN('scheduler-view', 'table', 'data', 'col', 'title'),
    CSS_SVT_COLGRID = getCN('scheduler-view', 'table', 'colgrid');

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
            validator: isNumber,
            value: 1
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
         * Binds keys for keyboard month view accessibility.
         *
         * @method bindKeys
         */
        bindKeys: function() {
            var instance = this;
            var boundingBox = instance.get('boundingBox');

            instance._eventHandles = [
                boundingBox.on('key', instance._onArrowKey, 'down:37,38,39,40', instance),
                boundingBox.on('key', instance._onNewKeyUp, 'up:13', instance)
            ];
        },

        /**
        * Destructor lifecycle implementation for the `scheduler-view-month`.
        *
        * @method destructor
        * @protected
        */
        destructor: function() {
            var instance = this;

            (new A.EventHandle(instance._eventHandles)).detach();
        },

        /**
         * Focuses a cell node and removes tabindex from all others.
         *
         * @method focusCell
         * @param {Node} cellNode
         */
        focusCell: function(cellNode) {
            var instance = this;

            instance.columnTableGrid.removeAttribute('tabindex');

            cellNode.setAttribute('tabindex', instance.get('tabIndex'));
            cellNode.focus();
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
         * Fires after month view visibleChange
         *
         * @method _afterVisibleChange
         * @param {EventFacade} event
         * @protected
         */
        _afterVisibleChange: function(event) {
            var instance = this;

            if (instance.get('visible') && instance.get('rendered') && !instance._eventHandles) {
                var firstGridNode = instance.columnTableGrid.first();

                instance.bindKeys();
                instance._syncCellDimensions();

                instance.focusCell(firstGridNode);

                instance.removeLasso();
                instance.renderLasso([0, 0], [0, 0]);
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
         * Fires on new key up event.
         *
         * @method _onNewKeyUp
         * @param {EventFacade} event
         * @protected
         */
        _onNewKeyUp: function(event) {
            var instance = this;
            var target = event.target;
            var scheduler = instance.get('scheduler');
            var recorder = scheduler.get('eventRecorder');

            instance._onMouseUpGrid();

            recorder.popover.once('visibleChange', target.focus, target);
        },

        /**
         * Fires on arrow key down event.
         *
         * @method _onArrowKey
         * @param {EventFacade} event
         * @protected
         */
        _onArrowKey: function(event) {
            var instance = this;
            var target = event.target;

            if (target.hasClass(CSS_SVT_COLGRID)) {
                var keyCode = event.keyCode;
                var position = target.getData('position');
                var index = instance._getCellIndex(position);

                if (keyCode === 37) {
                    index = index - 1;
                }
                else if (keyCode === 38) {
                    index = index - WEEK_LENGTH;
                }
                else if (keyCode === 39) {
                    index = index + 1;
                }
                else if (keyCode === 40) {
                    index = index + WEEK_LENGTH;
                }

                var toCellNode = instance.columnTableGrid.item(index);
                var toCellPosition;

                if (toCellNode) {
                    instance.focusCell(toCellNode);

                    toCellPosition = toCellNode.getData('position');

                    instance.lassoLastPosition = toCellPosition;

                    if (event.shiftKey) {
                        if (!instance._recording) {
                            instance.lassoStartPosition = position;

                            instance._recording = true;
                        }
                    }
                    else {
                        instance.lassoStartPosition = instance.lassoLastPosition;
                    }
                }
                else {
                    var scheduler = instance.get('scheduler');

                    if (index >= instance.get('displayDaysInterval')) {
                        scheduler.set('date', instance.get('nextDate'));

                        toCellNode = instance.columnTableGrid.first();
                    }
                    else if (index < 0) {
                        scheduler.set('date', instance.get('prevDate'));

                        toCellNode = instance.columnTableGrid.last();
                    }

                    toCellPosition = toCellNode.getData('position');

                    instance.focusCell(toCellNode);

                    instance.lassoStartPosition = instance.lassoLastPosition = toCellNode.getData('position');
                }

                if (toCellPosition) {
                    instance.removeLasso();
                    instance.renderLasso(instance.lassoStartPosition, toCellPosition);
                }
            }
        }
    }
});

A.SchedulerMonthView = SchedulerMonthView;
