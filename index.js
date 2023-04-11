const express = require('express');
const { Op } = require('sequelize');
const app = express();
const { Joke } = require('./db');

app.set("json spaces", "\t")
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/jokes', async (req, res, next) => {
  if(req.query) {
    try {
      const jokes = await Joke.findAll({
        where: {
          tags: {
            [Op.substring]: req.query.tags ?? '',
          },
          joke: {
            [Op.substring]: req.query.content ?? '',
            },
          },
        });
        res.send(jokes);
      } catch (error) {
          console.error(error);
          next(error)
      }
      return;
  }
  try {
    // TODO - filter the jokes by tags and content
      const jokes = await Joke.findAll(); // SELECT * FROM jokes;
      res.send(jokes);
  } catch (error) {
      console.error(error);
      next(error)
  }
});

app.post ('/jokes', async (req, res, next) => {
  try {
    const joke = await Joke.create(req.body);
    res.status(201).send(joke);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.delete('/jokes/:id', async (req, res, next) => {
  try {
    const joke = await Joke.findByPk(req.params.id);
    if (joke) {
      await joke.destroy();
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.put('/jokes/:id', async (req, res, next) => {
  try {
    const joke = await Joke.findByPk(req.params.id);
    if (joke) {
      await joke.update(req.body);
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// we export the app, not listening in here, so that we can run tests
module.exports = app;
