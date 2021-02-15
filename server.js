const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();
app.use(logger("dev"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });
   mongoose.connect(
     process.env.MONGODB_URI || 'mongodb://localhost/workout',
     {
       useNewUrlParser: true,
       useUnifiedTopology: true,
       useCreateIndex: true,
       useFindAndModify: false
     }
   );


app.post("/api/workouts", ({body}, res)=>{
  db.Workout.create(body)
  .then(dbWorkout =>{
    res.json(dbWorkout);
  });
});

app.put("/api/workouts/:id", (req, res) => {
  db.Exercise.create(req.body)
    .then(({_id}) => db.Workout.findByIdAndUpdate(req.params.id, { $push: { exercises: _id } }, {new: true}))
    .then(dbWorkout => {
      res.json(dbWorkout);
      console.log(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/api/workouts", (req, res) => {
  db.Workout.find({}).sort({_id:-1}).limit(1)
  .populate("exercises")
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/api/workouts/range", (req, res) =>{
  db.Workout.find({})
  .populate("exercises")
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});