module.exports = {
    sqlite: require('sqlite3').verbose(),

    execute: function (sql, dbPath, callback) {
        let db = new this.sqlite.Database(dbPath, function (err) { //connect DB
            if (err) {
                console.log(err);
                return;
            }
            else {
                console.log('DB connected');
                db.all(sql, [], function (err, rows) { //Excute Query
                    if (err) {
                        console.log('!!!error!!!');
                        throw err;
                    }
                    else {
                        //do something
                        callback(rows);
                        db.close(function (err) { //disconnect DB
                            if (err) {
                                console.log(err);
                                return;
                            }
                            console.log('DB Disconnect');
                        });
                    }
                });
            }
        });
    }

}