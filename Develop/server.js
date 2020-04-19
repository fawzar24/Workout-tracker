const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const databaseUrl =  "Workout";
const collections = ["exercises"];

const db = mongojs(databaseUrl, collections);

db.on("error", error => {
    console.log("Database Error: ", error);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/stats.html"));
});
app.get("/api/workouts", (req, res) => {
    db.exercises.find({}, (error, saved) => {
        if (error) {
            console.log(error);
        } else {
            res.json(saved);
        }
    });
});

app.put("/api/workouts/:id", ({params, body}, res) => {
    db.exercises.update(
        {
            _id: mongojs.ObjectId(params.id)
        },
        {
            $set: {
                name: body.name,
                weight: body.weight,
                sets: body.sets,
                reps: body.reps,
                duration: body.duration
            }
        },
        (error, updated) => {
            if (error) {
                console.log(error);
            } else {
                res.json(updated);
            }
        }
    );
});

app.get("/api/workout/range", (req, res) => {
    db.exercises.find({}, (error, found) => {
        if(error) {
            console.log(error);
        } else {
            res.json(found);
        }
    });
});

app.post("api/workouts", (reg, res) => {
    
    db.exercises.save()
})

app.get("/api/stats/weight", (req, res) => {
    db.exercises.find({}, (error, found) => {
        if(error) {
            console.log(error);
        } else {
            res.json(found);
        }
    });
});


app.listen(3000, () => {
    console.log("App running on Port 3000!");
});