/* ************************************************************************

   Copyrigtht: OETIKER+PARTNER AG
   License:    Proprietary
   Authors:    Tobias Oetiker
   Utf8Check:  äöü

   $Id: MessreiheTableModel.js 453 2011-01-26 06:22:50Z oetiker $

************************************************************************ */

/**
 * An {@link qx.ui.table.model.Remote} implementation for accessing
 * accessing Messreihen on the server.
 */
qx.Class.define('dbtoria.db.RemoteTableModel', {
    extend : qx.ui.table.model.Remote,

    /**
     * Create an instance of Rpc.
     */
    construct : function(tableId,columnIdList,columnLabelMap) {
        this.__tableId = tableId;
        this.__columnIdList = columnIdList;
        this.base(arguments);
        this.setColumnIds(columnIdList);
        if (columnLabelMap){
            this.setColumnNamesById(columnLabelMap);
        }
        this.__rpc = dbtoria.communication.Rpc.getInstance();
    },

    properties : {
        searchString : {
            init     : null,
            apply    : '_applySearchString',
            nullable : true,
            check    : "String"
        },

        filter : {
            nullable : true,
            apply    : '_applyFilter'
        }
    },

    members : {
        __rpc: null,
        __tableId: null,
        __columnIdList: null,
        /**
         * Provid our implementation to make remote table work
         */
        _loadRowCount : function() {
            var that = this;
            this.__rpc.callAsyncSmart(function(ret) {
                that._onRowCountLoaded(ret);
            }, 'getRowCount', this.__tableId,this.getFilter());
        },

        _applySearchString: function (newString,oldString){
            if (oldString == newString){
                return;
            }
            var filter = {};

            filter[String(this.__columnIdList[1])] = {
                op: 'ilike',
                value: '%' + newString + '%'
            };
            this.setFilter(filter);
        },


        /**
         * Reload the table data when the tagId changes.
         *
         * @param newValue {Integer} New TagId
         * @param oldValue {Integer} Old TagId
         */
        _applyFilter : function(newValue, oldValue) {
            this.reloadData();
        },


        /**
         * Provide our own implementation of the row data loader.
         *
         * @param firstRow {Integer} first row to load
         * @param lastRow {Integer} last row to load
         */
        _loadRowData : function(firstRow, lastRow) {

            var rpcArgs = {
                filter   : this.getFilter()
            };

            if (!this.isSortAscending()) {
                rpcArgs.sortDesc = true;
            }

            var sc = this.getSortColumnIndex();

            if (sc >= 0) {
                rpcArgs.sortColumn = this.getColumnId(sc);
            }
            var filter = this.getFilter();
            if (filter){
                rpcArgs.filter = filter;
            }
            var that = this;
            this.__rpc.callAsyncSmart(function(ret) {
                var data = [];
                var col = that.__columnIdList;
                for (var i=0;i<ret.length;i++){
                    var row = {};
                    row.ROWINFO = ret[i][0];
                    for (var r=0;r<col.length;r++){
                        row[col[r]] = ret[i][r+1];
                    }
                    data.push(row);
                }
                that._onRowDataLoaded(data);
            },
            'getTableDataChunk', this.__tableId,firstRow,lastRow,this.__columnIdList,rpcArgs);
        }
    }
});
