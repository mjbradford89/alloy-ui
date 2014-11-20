/**
 * DataTableAccessible class
 *
 * @module aui-datatable
 * @submodule aui-datatable-accessible
 */

/**
 * A base class for DataTableAccessible.
 *
 * @class A.DataTableAccessible
 * @param {Object} config Object literal specifying widget configuration
 * properties.
 * @constructor
 */
function DataTableAccessible() {};

DataTableAccessible.prototype = {

    /**
     * Construction logic executed during A.DataTableBody instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this;

        instance.after('render', instance._afterRender);
    },

    /**
     * Fires after render event is fired. Plugs the AriaTableSortable
     * module.
     *
     * @method _afterRender
     * @protected
     */
    _afterRender: function() {
        var instance = this;

        instance.plug(A.Plugin.Aria);
    }
};

A.DataTable.Accessible = DataTableAccessible;

A.Base.mix(A.DataTable, [DataTableAccessible]);
