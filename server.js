import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const User = mongoose.model(
  'users',
  new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    password: String,
    phone: String,
  })
);

app.get('/api/users', async (req, res) => {
  const { email, password } = req.query;
  const users = await User.find(email && password ? { email, password } : {});
  res.send(users);
});

app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ id });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

app.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  const createdUser = await user.save();
  res.send(createdUser);
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, name, phone, password } = req.body;
  const user = await User.findOne({ id });
  if (user) {
    user.email = email;
    user.name = name;
    user.phone = phone;
    user.password = password ? password : user.password;
    const updateUser = await user.save();
    res.send(updateUser);
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

const Post = mongoose.model(
  'posts',
  new mongoose.Schema(
    {
      id: Number,
      title: String,
      body: String,
      userId: Number,
    },
    {
      timestamps: true,
    }
  )
);

app.get('/api/posts', async (req, res) => {
  const { userId } = req.query;
  const posts = await Post.find(userId ? { userId } : {});

  res.send(posts);
});

app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({ id });
  if (post) {
    res.send(post);
  } else {
    res.status(404).send({ message: 'Post not found' });
  }
});
app.post('/api/posts', async (req, res) => {
  if (!req.body.title || !req.body.body) {
    return res.send({ message: 'Data is required.' });
  }
  const post = await Post(req.body).save();
  res.send(post);
});

app.get('/api/seed', async (req, res) => {
  await User.deleteMany();
  await Post.deleteMany();
  await User.insertMany([
    {
      id: 1,
      name: 'Leanne Graham',
      email: 'Sincere@april.biz',
      password: '123',
      phone: '1-770-736-8031 x56442',
    },
  ]);
  await Post.insertMany([
    {
      userId: 1,
      id: 1,
      title:
        'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
    },
  ]);
  res.send({ message: 'Seed successfully' });
});
const __dirname = path.resolve();
app.use('/', express.static(__dirname + '/build'));
app.get('/', (req, res) => res.sendFile(__dirname + '/build/index.html'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`serve at http://localhost:${port}`));
