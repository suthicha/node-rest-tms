const mssql = require('mssql');
const settings = require('../../settings');

exports.auth = (userId, password, callback) => {
    const pool = new mssql.ConnectionPool(settings.dbLocalAuth);
    pool.connect()
        .then(()=> {
            
            const req = new mssql.Request(pool);
                req.input('LoginName', mssql.NVarChar, userId)
                .input('Password', mssql.NVarChar, password)
                .execute('sp_auth_user').then(result => {
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
