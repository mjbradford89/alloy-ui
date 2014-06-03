/**
 * The Datatable Component
 *
 * @module aui-datatable
 * @submodule aui-datatable-sort
 */

/**
 * An extension for A.DataTable.Sortable that adds correct class to Table.
 *
 * @class DataTableSortable
 * @constructor
 */

// console.log(A.DataTable.Sortable.prototype.SORTABLE_HEADER_TEMPLATE);

function DataTableSortable() {}
/**
 * Static property provides a string to identify the class.
 *
 * @property NAME
 * @type String
 * @static
 */
DataTableSortable.NAME = 'dataTableSortable';

DataTableSortable.prototype = {
    SORTABLE_HEADER_TEMPLATE: '<div class="{className}" tabindex="-1" unselectable="on"><span aria-label="sort" class="{indicatorClass}" tabindex="0"></span></div>',

    initializer: function() {
        var instance = this;

        console.log('i just overwrote the initializer :(');
    },

    bindUI: function() {
        var instance = this;

        console.log('bindUI');

        var updateCaption = function() {
            console.log('update caption');
            // get the table

            // if no caption
                // add in a caption
            // else
                // update the caption
        };

        instance.on('sort', updateCaption, instance);

        instance.after(updateCaption, instance, 'sort');
    },

    _afterSort: function() {
        var instance = this;

        console.log('add a caption!');

        console.log('find a way to get the table element. ', instance);
        window.sortableInstance = instance;

        // var caption =
    }
};

// console.log('A.DataTable.Sortable: ', A.DataTable.Sortable.prototype);
// console.log('[DataTableSortable]: ', DataTableSortable.prototype);

A.Base.mix(A.DataTable.Sortable, [DataTableSortable]);

// console.log('A.DataTable.Sortable: ', A.DataTable.Sortable.prototype);

// window.DataTableSortable = DataTableSortable;