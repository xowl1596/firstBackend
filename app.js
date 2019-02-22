var express = require('express');

var session = require('express-session');
var bodyParser = require('body-parser')
var sqlite = require('./lib/dbManager.js');
var app = express();

app.set('view engine', 'jade');
app.set('views', './views');

app.use(express.static('img'));
app.use(express.static('css'));
app.use(express.static('js'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

//홈페이지 출력 : 공지사항으로 리다이렉션함
app.get('/', function (req, res) {
    res.redirect('/board?menu=notice');
});

//게시판 페이지 출력 : get 방식으로 게시판 종류 결정
app.get('/board', function (req, res) {
    sess = req.session;
    let menuSql = `SELECT * FROM Menu`;
    let postSql = `SELECT id, title, writer, time FROM Post WHERE menu = "${req.query.menu}"`;
    //메뉴 항목 생성
    sqlite.execute(menuSql, './db/web.db', function (menuResult) {
        //목록 생성
        sqlite.execute(postSql, './db/web.db', function (postResult) {
            console.log(sess);
            res.render('frame', { session: sess, menu: menuResult, post: postResult, path: req.path, menuType: req.query.menu });
        });
    });

});

//게시물 페이지 출력 : 
app.get('/post', function (req, res) {
    sess = req.session;

    let menuSql = `SELECT * FROM Menu`;
    let postSql = `SELECT * FROM Post WHERE id = "${req.query.id}"`;
    sqlite.execute(menuSql, './db/web.db', function (menuResult) {
        sqlite.execute(postSql, './db/web.db', function (postResult) {
            res.render('frame', { session: sess, menu: menuResult, post: postResult, path: req.path });
        });
    });
});

//글쓰기 페이지
app.get('/write', function (req, res) {
    sess = req.session;

    let menuSql = `SELECT * FROM Menu`;
    let postSql = `SELECT * FROM Menu`;
    if (sess.nickName === undefined) {
        res.status(409).send('not login');
    }
    else {
        sqlite.execute(menuSql, './db/web.db', function (menuResult) {
            sqlite.execute(postSql, './db/web.db', function (postResult) {
                res.render('frame', { session: sess, menu: menuResult, post: postResult, path: req.path, menuType: req.query.menu });
            });
        });
    }
});

//글수정 페이지
app.get('/update', function (req, res) {

});


//글쓰기 기능부
app.post('/write_done', function (req, res) {
    sess = req.session;

    let sql = `INSERT INTO Post(time, menu, writer, title, content)
               VALUES ('${new Date()}', '${req.body.menu}', '${sess.nickName}', '${req.body.title}', '${req.body.content}')`;
    sqlite.execute(sql, './db/web.db', function (postResult) {
        res.redirect(`/board?menu=${req.body.menu}`);
    });
});

//로그인 : ID/PW확인 후 홈페이지로 리다이렉션
app.post('/login', function (req, res) {
    let sql = `SELECT ID, PW, NICKNAME, GRADE FROM User WHERE ID = "${req.body.id}" AND PW = "${req.body.pw}"`;
    sqlite.execute(sql, './db/web.db', function (userResult) {
        if (!userResult.length) {
            console.log('User Not Found');
        }
        else {
            console.log('Login Success');
            //세션에 로그인 정보 저장
            req.session.nickName = userResult[0].NICKNAME;
            req.session.grade = userResult[0].GRADE;
        }
        res.redirect('/');
    });
});

//로그아웃 : 로그아웃 후 홈페이지로 리다이렉션
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('logout success');
        }
        res.redirect('/');
    });
});

app.listen(3000, function () {
    console.log('Conneted 3000 port!');
});
