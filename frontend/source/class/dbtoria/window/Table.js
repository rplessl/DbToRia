/* ************************************************************************

   Copyrigtht: OETIKER+PARTNER AG
   License:    GPL
   Authors:    Tobias Oetiker
   Utf8Check:  äöü

************************************************************************ */

/*
*/

/**
 * Create a table according to the instructions provided.
 */
qx.Class.define("dbtoria.window.Table", {
    extend : qx.ui.table.Table,

    construct : function(tm) {
        var tableOpts = {
            tableColumnModel : function(obj) {
                return new qx.ui.table.columnmodel.Resize(obj);
            }
        };
        this.base(arguments, tm, tableOpts);
        this.set({
            showCellFocusIndicator : false,
            decorator              : null
        });
        this.getDataRowRenderer().setHighlightFocusRow(false);
    }
});
