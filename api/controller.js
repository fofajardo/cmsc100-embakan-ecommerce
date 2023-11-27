import mongoose from "mongoose";

const kDbHost = "127.0.0.1";
const kDbPort = "27017";
const kDbName = "ICS";

await mongoose.connect(`mongodb://${kDbHost}:${kDbPort}/${kDbName}`);

// TODO: move models to a separate JS file.
// TODO: create separate JS files to separate each root endpoint
//       (e.g., endpoints/orders.js, endpoints/users.js).
// TODO: use arrow functions sparingly.

const Subject = mongoose.model("Subject", {
    code: String,
    title: String,
    desc: String,
    units: Number,
    sem_offered: [String]
});

const getSubjects = async(req, res) => {
    const subjects = await Subject.find({});
    res.send(subjects);
}

const greetByPOST = async(req, res) => {
    const greeting = "Hello, " + req.body.name;
    res.send(greeting);
}

// get subject by code
const getSubjectByCode = async(req, res) => {
    const subject = await Subject.findOne({
        code: req.query.code
    });
    res.send(subject);
}

// save new subject
const addSubject = async(req, res) => {
    const {
        code,
        title,
        desc,
        units,
        sem_offered
    } = req.body;

    const newSubject = new Subject({
        code,
        title,
        desc,
        units,
        sem_offered
    });

    const result = await newSubject.save();

    if (result._id) {
        res.send({
            success: true
        });
    } else {
        res.send({
            success: false
        });
    }
}

// delete
const deleteSubject = async(req, res) => {
    const { code } = req.body;

    const result = await Subject.deleteOne({
        code
    });

    if (result.deletedCount == 1) {
        res.send({
            success: true
        });
    } else {
        res.send({
            success: false
        });
    }
}

export default {
    getSubjects,
    greetByPOST,
    getSubjectByCode,
    addSubject,
    deleteSubject
};
