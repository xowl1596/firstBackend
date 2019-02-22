var sqlite = require('sqlite3').verbose();

let db = new this.sqlite.Database('./db/web_practice.db', function (err) { //DB연결
    if (err) {
        console.log(err);
        return;
    }
    else {
        console.log('DB connected');
        db.all(sql, [], function (err, rows) { //DB쿼리 실행
            if (err) {
                console.log('!!!error!!!');
                throw err;
            }
            else {
                //do something
                console.log(rows);
                db.close(function (err) { //DB연결 해제
                    if (err) {
                        console.log(err);
                        return;
                    }
                });
            }
        });
    }
});