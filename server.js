var express = require('express');
var multer  = require('multer');
var ext = require('file-extension');
var aws = require('aws-sdk')
var multerS3 = require('multer-s3')

var config = require('./config')

var s3 = new aws.S3({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey  
})

var storage = multerS3({
  s3: s3,
  bucket: 'wilb',
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname })
  },
  key : function (req, file, cb) {
    cb(null, +Date.now() + '.' + ext(file.originalname))
  }
})

var upload = multer({ storage: storage }).single('picture');

var app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', { title: 'Platzigram' });
})

app.get('/signup', function (req, res) {
  res.render('index', { title: 'Platzigram - Signup' });
})

app.get('/signin', function (req, res) {
  res.render('index', { title: 'Platzigram - Signin' });
})

app.get('/api/pictures', function (req, res, next) {
  var pictures = [
    {
      user: {
        username: 'willybc',
        avatar: 'https://avatars1.githubusercontent.com/u/22482325?v=3&u=e78ca90915de57b4b16b990162341eb11851d540&s=400'
      },
      url: 'office.jpg',
      likes: 0,
      liked: false,
      createdAt: new Date().getTime()
    },
    {
      user: {
        username: 'willybc',
        avatar: 'https://avatars1.githubusercontent.com/u/22482325?v=3&u=e78ca90915de57b4b16b990162341eb11851d540&s=400'
      },
      url: 'office.jpg',
      likes: 1,
      liked: true,
      createdAt: new Date().setDate(new Date().getDate() - 10)
    }
  ];

  setTimeout(function () {
    res.send(pictures);  
  }, 2000)
});

app.post('/api/pictures', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.send(500, "Error uploading file");
    }
    res.send('File uploaded');
  })
})

app.get('/api/user/:username', (req, res) => {
  const user = {
    username: 'willybc',
    avatar: 'https://avatars1.githubusercontent.com/u/22482325?v=3&u=e78ca90915de57b4b16b990162341eb11851d540&s=400',
    pictures: [
      {
        id: 1,
        src: 'https://instagram.fgig1-2.fna.fbcdn.net/t51.2885-15/e35/12907292_468003886736759_1064137575_n.jpg?ig_cache_key=MTIyNTU0MzQ3MzMwNTEwNzQ0MA%3D%3D.2',
        likes: 3
      },
      {
        id: 2,
        src: 'https://instagram.fgig1-2.fna.fbcdn.net/t51.2885-15/e15/10843690_1593549170866568_1770968421_n.jpg?ig_cache_key=ODcyODA5NjMwNzg3ODQ0MTM0.2',
        likes: 1
      },

       {
        id: 3,
        src: 'https://instagram.fgig1-2.fna.fbcdn.net/t51.2885-15/e15/11356649_877030755705789_573658507_n.jpg?ig_cache_key=MTA3MDU4NDE3MzExNDU3MTEyMA%3D%3D.2',
        likes: 1
      },
    
    ]
  }

  res.send(user);
})

app.get('/:username', function (req, res) {
  res.render('index', { title: `Platzigram - ${req.params.username}` });
})

app.get('/:username/:id', function (req, res) {
  res.render('index', { title: `Platzigram - ${req.params.username}` });
})


app.listen(3000, function (err) {
  if (err) return console.log('Hubo un error'), process.exit(1);

  console.log('Platzigram escuchando en el puerto 3000');
})