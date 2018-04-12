const mssql = require('mssql');
const settings = require('../../settings');

exports.get_booking_by_invoiceno = (invoiceno, callback) => {
    const pool = new mssql.ConnectionPool(settings.dbLocalSrv);
    pool.connect()
        .then(()=> {

            let sqlText = "SELECT DELIVERY_JOB_NO, BOOKING_TYPE_CODE, TRUCK_TYPE_CODE,";
            sqlText += "ISNULL((SELECT TOP 1 MISC_VALUE1 FROM VW_MISC_TRUCK_TYPE WHERE MISC_CODE=TRUCK_TYPE_CODE),'') AS TRUCK_TYPE_NAME,";
            sqlText += "ISNULL(OWNER_TRUCK_REGISTRATION_NO,'') AS OWNER_TRUCK_REGISTRATION_NO,";
            sqlText += "SERVICE_TYPE_CODE, START_DATE, END_DATE,";
            sqlText += "ROUTE_FROM_ID, (SELECT TOP 1 LOCATION_CODE_FROM FROM TBM_ROUTE WHERE LOCATION_FROM_ID=ROUTE_FROM_ID) AS ROUTE_FROM_CODE,";
            sqlText += "UPPER(ISNULL((SELECT TOP 1 LOCATION_NAME FROM TBM_LOCATION WHERE LOCATION_ID=ROUTE_FROM_ID),'')) AS ROUTE_FROM_NAME,";
            sqlText += "ROUTE_TO_ID, (SELECT TOP 1 LOCATION_CODE_TO FROM TBM_ROUTE WHERE LOCATION_TO_ID=ROUTE_TO_ID) AS ROUTE_TO_CODE,";
            sqlText += "UPPER(ISNULL((SELECT TOP 1 LOCATION_NAME FROM TBM_LOCATION WHERE LOCATION_ID=ROUTE_TO_ID),'')) AS ROUTE_TO_NAME ";
            sqlText += "FROM TBT_DELIVERY_JOB_HEADER ";
            sqlText += "WHERE DELIVERY_JOB_NO = ANY ( SELECT DELIVERY_JOB_NO FROM TBT_DELIVERY_JOB_DETAIL ";
            sqlText += "WHERE BOOKING_NO = ANY (SELECT BOOKING_NO FROM TBT_BOOKING_DETAIL WHERE CUSTOMER_INVOICE=@INVOICENO) ";
            sqlText += "GROUP BY DELIVERY_JOB_NO)";

            const req = new mssql.Request(pool);
                req.input('INVOICENO', invoiceno)
                .query(sqlText).then(result => {
                    callback(result.recordset);
                })
                .catch(error => {
                    callback(null, error);
                });
        })
        .catch(error => {       
            callback(null, error);
        })
};
