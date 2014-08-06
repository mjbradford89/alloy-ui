/**
 * The Aria Component.
 *
 * @module aui-aria
 * @submodule aui-aria-tablesortable
 */

var Lang = A.Lang;

/**
 * An extension for A.Plugin.Aria that creates and synchronizes a
 * screen-reader-friendly `caption` element for the table that
 * has sortable headers.
 *
 * @class A.Plugin.Aria.TableSortable
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */

function TableSortable() {}

/**
 * configuration for TableSortable.
 *
 * @property ATTRS
 * @type Object
 * @static
 */
TableSortable.ATTRS = {
    captionCss: {
        validator: Lang.isString,
        value: ''
    },

    captionLive: {
        validator: Lang.isString,
        value: 'polite'
    },

    captionNode: {
        setter: function(val) {
            var instance = this;

            if (!val) {
                val = A.Node.create(Lang.sub(
                        instance.TPL_CAPTION, {
                            captionCss: instance.get('captionCss')
                        }
                    )
                );
            }

            return A.one(val);
        },
        value: null
    },

    captionRole: {
        validator: Lang.isString,
        value: 'alert'
    },

    captionVisible: {
        validator: Lang.isBoolean,
        value: false
    },

    screenReaderClass: {
        validator: Lang.isString,
        value: 'sr-only'
    },

    stringsSortable: {
        value: {
            asc: 'ascending',
            desc: 'descending',
            sorted: 'sorted',
            sortedBy: 'sorted by',
            notSorted: 'not sorted'
        }
    },

    tableNode: {
        setter: A.one,
        valueFn: function() {
            return this.get('host').get('boundingBox').one('table');
        },
        writeOnce: true,
    }
};

TableSortable.prototype = {
    TPL_CAPTION: '<caption class="{captionCss}"></caption>',

    /**
     * Construction logic executed during TableSortable instantiation. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this;

        instance.after('captionVisibleChange', A.bind(instance._toggleScreenReaderClass, instance));
    },

    /**
     * Synchronizes the captionNode's text for screen readers with the sorted
     * column and its sort direction.
     *
     * @method syncCaption
     * @public
     * @param {String} columnName
     * @param {Boolean} ascending
     */
    syncCaption: function(columnName, ascending) {
        var instance = this,
            caption = instance._getCaption(),
            strings = instance.get('stringsSortable');

        caption.text(
            Lang.sub(
                strings.sortedBy + ': {columnName} {direction}',
                {
                    columnName: columnName,
                    direction: ascending ? strings.asc : strings.desc
                }
            )
        );
    },

     /* Handles `captionVisible` events.
     *
     * @method _afterAllDayChange
     * @param {EventFacade} event
     * @protected
     */
    _afterCaptionVisibleChange: function(event) {
        var instance = this;

        instance._toggleScreenReaderClass({
            force: event.newVal
        });
    },

    /* Toggles the screen reader css class.
     *
     * @method _toggleScreenReader
     * @param {Object} options
     * @protected
     */
    _toggleScreenReaderClass: function(options) {
        var instance = this,
            caption = instance._getCaption(),
            toggle = options ? options.force : !instance.get('captionVisible');

        caption.toggleClass(instance.get('screenReaderClass'), toggle);
    },

    /* Returns a reference to the `captionNode`, and accomplishes
    * neccessary setup to prepare the element for screen readers.
     *
     * @method _toggleScreenReader
     * @param {Object} options
     * @protected
     */
    _getCaption: function() {
        var instance = this,
            caption = instance.get('captionNode');

        if (!caption.inDoc()) {
            instance.get('tableNode').prepend(caption);

            caption.setAttribute('aria-live', instance.get('captionLive'));
            caption.setAttribute('role', instance.get('captionRole'));

            instance._toggleScreenReaderClass();
        }

        return caption;
    }
};

A.Base.mix(A.Plugin.Aria, [TableSortable]);