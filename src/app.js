const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your_secret_key', // It's recommended to use an environment variable for this
    resave: false,
    saveUninitialized: true
}));

// Routes
const indexRouter = require('./routes/index');
const todosRouter = require('./routes/todos');
const adminRouter = require('./routes/admin');
const testRouter = require('./routes/test');
app.use('/', indexRouter);
app.use('/todos', todosRouter);
app.use('/admin', adminRouter);
app.use('/test', testRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// 게시물 상세 + 조회수 증가
app.get('/board/:id', async (req, res) => {
  // 1) id를 숫자로 변환
  const id = Number(req.params.id);

  // 2) 숫자가 아니면 잘못된 요청 처리
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).send('잘못된 게시글 번호입니다.');
  }

  try {
    // 3) 조회수 증가 (PreparedStatement 사용)
    await pool.query('UPDATE board SET hit = hit + 1 WHERE id = ?', [id]);

    // 4) 게시글 조회
    const [rows] = await pool.query(
      'SELECT id, title, content, writer, created_at, hit FROM board WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).send('게시글을 찾을 수 없습니다.');
    }

    res.render('detail', { post: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('에러 발생');
  }
});
