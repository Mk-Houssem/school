// import express module
const express = require("express");

// import body-parser module
const bodyParser = require("body-parser");

// import mongoose module
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/schoolDB');

//import axios module
const axios = require("axios");

//import bcrypt module
const bcrypt = require("bcrypt");

// import multer module
const multer = require("multer");
// import path module
const path = require("path");

// import jwt module
const jwt = require('jsonwebtoken');
// import express-session module
const session = require('express-session');

// creates express application (app)
const app = express();

// App configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Security configuration
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, Accept, Content-Type, X-Requested-with, Authorization, expiresIn"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS, PATCH, PUT"
    );
    next();
});

// /files : shortcut that replaces backend/files
app.use('/files', express.static(path.join('backend/files')));

const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'application/pdf': 'pdf',
};

const storageConfig = multer.diskStorage({
    // destination
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error("Mime type is invalid");
        if (isValid) {
            error = null;
        }
        cb(null, 'backend/files')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE[file.mimetype];
        const imgName = name + '-' + Date.now() + '-crococoder-' + '.' + extension;
        cb(null, imgName);
    }
});

const secretKey = 'your-secret-key';
app.use(session({
    secret: secretKey,
}));

// Models Importation
const User = require("./models/users");
const Course = require("./models/course");
const Group = require("./models/group");
const Bulletin = require("./models/bulletin");


// Business Logic : Signup
app.post("/api/users/signup", multer({ storage: storageConfig }).single("file"), (req, res) => {
    console.log("Here into BL: Signup", req.body);

    // Utilisation de bcrypt pour hacher le mot de passe avant de le stocker
    bcrypt.hash(req.body.pwd, 10)
        .then((bcryptedPwd) => {
            console.log("Here is crypted", bcryptedPwd);
            req.body.pwd = bcryptedPwd;

            if (req.body.role === "teacher" || req.body.role === "student") {
                req.body.file = `http://localhost:3000/files/${req.file.filename}`;
            }

            // Vérification du rôle "parent" et relation avec un enfant "étudiant"
            if (req.body.role === "parent") {
                User.findOne({ tel: req.body.telChild, role: "student" })
                    .then((result) => {
                        if (!result) {
                            // Enfant non trouvé, renvoyer un code d'erreur
                            res.json({ msg: "Enfant non trouvé" });
                        };
                    })
            }

            // Création d'un nouvel utilisateur et sauvegarde dans la base de données
            var user = new User(req.body);
            user.save((err, doc) => {
                console.log("Here err : ", err);
                console.log("Here doc : ", doc);
                if (doc) {
                    res.json({ msg: "success" });
                } else {
                    // if (err.errors.tel) {
                    //     res.json({ msg: "error" });
                    // } ?????
                }
            });

        });
});
// Business Logic : Login
app.post("/api/users/login", (req, res) => {
    // Log that the server has entered the login route and display the request body
    console.log("Here into BL: Login", req.body);

    let user; // Déclaration d'une variable pour stocker les informations de l'utilisateur

    // Recherche de l'utilisateur dans la base de données par numéro de téléphone (tel)
    User.findOne({ tel: req.body.tel })
        .then((doc) => {
            // Log the response after searching for a user by phone number (tel)
            console.log("Here response after search by Tel", doc);

            if (!doc) {
                // Si aucun utilisateur correspondant n'est trouvé, renvoyer un message JSON (msg: 0)
                res.json({ msg: "tel nn Exist" });
            } else {
                user = doc; // Stocker les données de l'utilisateur dans la variable "user"

                // Comparer le mot de passe fourni avec le mot de passe crypté stocké dans la base de données
                return bcrypt.compare(req.body.pwd, doc.pwd);
            }
        })
        .then((compareResult) => {
            // Log the result of the password comparison
            console.log("compareResult", compareResult);

            if (!compareResult) {
                // Si la comparaison échoue (mots de passe ne correspondent pas), renvoyer un message JSON (msg: 1)
                res.json({ msg: "mots de passe ne correspondent pas" });
            } else {
                if (user.role === "teacher") {
                    if (user.status === "confirmé") {
                        // Si l'utilisateur est un enseignant confirmé, générer un token JWT
                        let userToSend = {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role,
                            status: user.status,
                            id: user._id,
                        };
                        const token = jwt.sign(userToSend, secretKey, {
                            expiresIn: '1h' // Le token expirera après 1 heure
                        });

                        // Renvoyer un message JSON avec le code "msg: 2" et le token
                        res.json({ msg: "welcome", token: token });
                    } else {
                        // Si l'utilisateur est un enseignant non confirmé, renvoyer un message JSON (msg: 3)
                        res.json({ msg: "enseignant non confirmé" });
                    }
                } else {
                    // Si l'utilisateur n'est pas un enseignant, générer un token JWT avec des informations limitées
                    let userToSend = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        id: user._id,
                    };
                    const token = jwt.sign(userToSend, secretKey, {
                        expiresIn: '1h' // Le token expirera après 1 heure
                    });

                    // Renvoyer un message JSON avec le code "msg: 2" et le token
                    res.json({ msg: "welcome", token: token });
                }
            }
        });
});
// Business Logic: Display User by Id 
app.get("/api/users/profile/:id", (req, res) => {
    console.log("Here into BL: Get user by Id", req.params.id);
    User.findById(req.params.id).then((doc) => {
        console.log("Here document from User collection", doc);
        res.json({ user: doc });
    })
        .catch((error) => {
            res.status(500).json({ message: "Error retrieving groups", error: error.message });
        });
});
// Business Logic : Update User
app.put("/api/users", (req, res) => {
    console.log("Here into BL: Update user", req.body);
    User.updateOne({ _id: req.body._id }, req.body).then((response) => {
        console.log("Here response after editing", response);
        response.nModified ?
            res.json({ isUpdated: true }) :
            res.json({ isUpdated: false });
    });
});
// Business Logic: delete User
app.delete("/api/users/:id", async (req, res) => {
    console.log("Here into BL: Delete User", req.params.id);

    try {
        // Suppression de l'utilisateur
        const userResponse = await User.deleteOne({ _id: req.params.id });

        if (userResponse.deletedCount === 0) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (userResponse.role === "teacher") {
            // Suppression des groupes associés
            const groupResponse = await Group.deleteMany({ teacherId: req.params.id });

            if (groupResponse.deletedCount === 0) {
                console.log("No groups found to delete.");
            } else {
                // Suppression des bulletins associés aux groupes supprimés
                const bulletinResponse = await Bulletin.deleteMany({ groupId: { $in: groupResponse.map(group => group._id) } });

                if (bulletinResponse.deletedCount === 0) {
                    console.log("No bulletins found to delete.");
                }
            }
            res.json({ msg: "Deleted User, associated Groups, and Bulletins with success" });
        } else {
            res.json({ msg: "Deleted User with success" });
        }
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ msg: "Error" });
    }
});
// Business Logic : Get All Users
app.get("/api/users", (req, res) => {
    console.log("Here into BL: Get All Users");
    User.find().then(
        (docs) => {
            console.log("Here documents from users collection", docs);
            res.json({ users: docs });
        });
});
// Business Logic : Get Student By Tel
app.get("/api/users/student/:tel", (req, res) => {
    console.log("Here into BL: Get User By Tel", req.params.tel);

    // Cherchez d'abord l'utilisateur parent par le numéro de téléphone de l'enfant
    User.findOne({ telChild: req.params.tel, role: "parent" })
        .then((parent) => {
            if (!parent) {
                res.json({ msg: "Child's phone number of parent not found" });
            } else {
                // Si l'utilisateur parent est trouvé, recherchez ensuite l'utilisateur étudiant par numéro de téléphone
                return User.findOne({ tel: req.params.tel, role: "student" });
            }
        })
        .then((student) => {
            if (!student) {
                res.json({ msg: "Phone number of student not found" });
            } else {
                console.log("User found", student);

                // Utilisez l'_id de l'utilisateur étudiant trouvé pour rechercher les bulletins associés
                return Bulletin.find({ studentId: student._id })
                    .populate("groupId")
                    .populate({
                        path: "groupId",
                        populate: {
                            path: "teacherId",
                        }
                    })
                    .populate({
                        path: "groupId",
                        populate: {
                            path: "courseId",
                        }
                    })
                    .populate("studentId");
            }
        })
        .then((bulletins) => {
            console.log("Bulletins found", bulletins);
            res.json({ bulletins: bulletins });
        })
        .catch((err) => {
            console.error("Error:", err);
            res.status(500).json({ error: "An error occurred while processing the request." });
        });
});
// Business Logic: Update Teacher Status
app.put("/api/users/status", (req, res) => {
    console.log("Here into BL: Update status teacher", req.body);

    // Mettre à jour le statut de l'utilisateur avec l'ID spécifié
    User.updateOne({ _id: req.body.id }, req.body).then((response) => {
        console.log("Here response after confirm", response);

        // Vérifier si la mise à jour a modifié des documents
        response.nModified ?
            res.json({ isUpdated: true }) :
            res.json({ isUpdated: false });
    });
});
// Business Logic : Get All teachers
app.get("/api/users/teachers", (req, res) => {
    console.log("Here into BL: Get All teachers");
    try {
        User.find({
            role: "teacher", status: "confirmé"
        })
            .then((teachers) => {
                console.log("Here are the teachers", teachers);
                res.json({ teachers: teachers });
            });
    } catch (error) {
        console.error("Error while retrieving teachers:", error);
        res.status(500).json({ error: "An error occurred while fetching teachers." });
    }
});
// Business Logic : Get All Students
app.get("/api/users/students", (req, res) => {
    console.log("Here into BL: Get All students");
    try {
        User.find({ role: "student" })
            .then((students) => {
                console.log("Here are the students", students);
                res.json({ students: students });
            });
    } catch (error) {
        console.error("Error while retrieving students:", error);
        res.status(500).json({ error: "An error occurred while fetching students." });
    }
});




// Business Logic : Add Course
app.post("/api/course", (req, res) => {
    console.log("Here int.o BL: Add Course", req.body);
    const course = new Course(req.body);
    course.save((err, doc) => {
        console.log("Here err : ", err);
        console.log("Here doc : ", doc);
        if (err) {
            res.json({ msg: 0 });
        } else {
            res.json({ msg: 1 });
        }
    });
});
// Business Logic: Display Course by Id-Teacher
app.get("/api/course/teacher/:id", (req, res) => {
    console.log(console.log("Here into BL: Get courses by teacher", req.params.id));
    Course.find({ id_teacher: req.params.id }).then((docs) => {
        console.log("Here documents from courses collection", docs);
        res.json({ courses: docs });
    })
});
// Business Logic : Get All Courses
app.get("/api/course", (req, res) => {
    console.log("Here into BL: Get All courses");
    Course.find().then(
        (docs) => {
            console.log("Here documents from courses collection", docs);
            res.json({ courses: docs });
        });
});
// Business Logic: delete Course
app.delete("/api/course/:id", async (req, res) => {
    console.log("Here into BL: Delete Course", req.params.id);
    try {
        // Suppression du course
        const courseResponse = await Course.deleteOne({ _id: req.params.id });

        if (courseResponse.deletedCount === 0) {
            throw new Error("Course not found");
        }

        // Suppression des groups associés
        const groupResponse = await Group.deleteMany({ courseId: req.params.id });

        if (groupResponse.deletedCount === 0) {
            console.log("No group found to delete");
        }

        res.json({ msg: "Deleted Group and associated Course with success" });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ msg: "Error" });
    }
});
// Business Logic: Display Course by Id
app.get("/api/course/:id", (req, res) => {
    console.log(console.log("Here into BL: Get courses by Id", req.params.id));
    Course.findById(req.params.id).then((doc) => {
        console.log("Here documents from courses collection", doc);
        res.json({ course: doc });
    })
});
// Business Logic : Update Course
app.put("/api/course", (req, res) => {
    console.log("Here into BL: Update Course", req.body);
    Course.updateOne({ _id: req.body._id }, req.body).then((response) => {
        console.log("Here response after editing", response);
        response.nModified ?
            res.json({ isUpdated: true }) :
            res.json({ isUpdated: false });
    });
});



// Business Logic: Display Groups by Id-Teacher
app.get("/api/group/:id", (req, res) => {
    console.log("Here into BL: Get groups by teacher", req.params.id);
    Group.find({ teacherId: req.params.id })
        .populate("courseId")
        .populate("studentsIds")
        .populate("teacherId")
        .then((docs) => {
            console.log("Here documents from groups collection", docs);
            res.json({ groups: docs });
        })
        .catch((error) => {
            res.status(500).json({ message: "Error retrieving groups", error: error.message });
        });
});
// Business Logic: Add Group
app.post("/api/group", async (req, res) => {
    console.log("Here into BL: Add Group", req.body);
    try {
        // Vérification de l'existence de l'enseignant
        const teacher = await User.findById(req.body.teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        // Vérification de l'existence du cours
        const course = await Course.findById(req.body.courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        let checkError = true;
        // // Vérification de l'existence des étudiants

        User.find({ studentId: { $in: req.body.studentsIds } }, async (studentId) => {
            const student = await User.findById(studentId);
            if (!student) {
                checkError = false;
            }
        });

        if (checkError) {
            // Création d'un nouveau groupe
            const group = new Group({
                name: req.body.name,
                courseId: req.body.courseId,
                teacherId: req.body.teacherId,
                studentsIds: req.body.studentsIds,
            });

            group.save((err, doc) => {
                if (doc) {
                    // Réponse réussie
                    res.status(201).json({ message: "Group(s) created successfully" });
                }
            });

        } else {
            // Response Error
            res.status(201).json({ message: "Error" });
        }


    } catch (error) {
        res.status(500).json({ message: "Error creating group", error: error.message });
    }
});
// Business Logic: get All Groups
app.get("/api/group", (req, res) => {
    console.log("Here into BL : Get All Groups", req.body);
    Group.find().populate("studentsIds").populate("teacherId").populate("courseId").then((docs) => {
        res.json({ groups: docs });
    })
});
// Business Logic: delete group
app.delete("/api/group/:id", async (req, res) => {
    console.log("Here into BL: Delete Group", req.params.id);

    try {
        // Suppression du groupe
        const groupResponse = await Group.deleteOne({ _id: req.params.id });

        if (groupResponse.deletedCount === 0) {
            throw new Error("Group not found");
        }

        // Suppression des bulletins associés
        const bulletinResponse = await Bulletin.deleteMany({ groupId: req.params.id });

        if (bulletinResponse.deletedCount === 0) {
            console.log("No bulletins found to delete.");
        }

        res.json({ msg: "Deleted Group and associated Bulletins with success" });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ msg: "Error" });
    }
});



// Business Logic : Get All Bulletins
app.get("/api/bulletin", (req, res) => {
    console.log("Here into BL: Get All bulletins");
    Bulletin.find().then(
        (docs) => {
            console.log("Here documents from bulletins collection", docs);
            res.json({ bulletins: docs });
        });
});
// Business Logic: Display bulletin by Id-student and Id-group
app.post("/api/bulletin/student", async (req, res) => {
    try {
        console.log("Here into BL: Get bulletin by teacher", req.body);
        const docs = await Bulletin.find({ groupId: req.body.idGroup, studentId: req.body.idStudent });
        console.log("Here documents from bulletins collection", docs);
        res.json({ bulletins: docs });
    } catch (error) {
        console.error("Erreur lors de la récupération des bulletins :", error);
        res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des bulletins" });
    }
});
// Business Logic : Add bulletin
app.post("/api/bulletin", async (req, res) => {
    console.log("Here into BL: Add Bulletin", req.body);
    try {
        const user = await User.findById(req.body.studentId);

        if (!user) {
            return res.status(404).json({ message: "Student not found" });
        }

        else {
            const bulletin = new Bulletin(req.body);
            await bulletin.save();
            console.log("Here doc : ", bulletin);
            res.status(400).json({ message: "Bulletin already exists for this student" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error creating bulletin", error: error.message });
    }
});
// Business Logic: Update Bulletin
app.put("/api/bulletin/note", (req, res) => {
    try {
        console.log("Here into BL: Update Bulletin Student", req.body);

        // Mettre à jour le bulletin étudiant avec l'ID spécifié
        Bulletin.updateOne({ _id: req.body._id }, req.body).then((response) => {
            console.log("Here response after confirm", response);

            // Vérifier si la mise à jour a modifié des documents
            if (response.nModified > 0) {
                res.json({ isUpdated: true });
            } else {
                res.json({ isUpdated: false });
            }
        })

    } catch (error) {
        // Gérer l'erreur et renvoyer une réponse d'erreur appropriée
        console.error("Erreur lors de la mise à jour du bulletin :", error);
        res.status(500).json({ error: "Une erreur s'est produite lors de la mise à jour du bulletin" });
    }
});
// Business Logic: Display Bulletins by Id-Student
app.get("/api/bulletin/:id", (req, res) => {
    console.log("Here into BL: Get groups by student", req.params.id);
    Bulletin.find({ studentId: req.params.id })
        .populate("groupId")
        .populate({
            path: "groupId",
            populate: {
                path: "teacherId",
            }
        })
        .populate({
            path: "groupId",
            populate: {
                path: "courseId",
            }
        })
        .populate("studentId")
        .then((docs) => {
            console.log("Here documents from bulletins collection", docs);
            res.json({ bulletins: docs });
        })
        .catch((error) => {
            res.status(500).json({ message: "Error retrieving groups", error: error.message });
        });
});
// Business Logic: Display Bulletins by Id-Bulletin
app.get("/api/bulletin/note/:id", (req, res) => {
    console.log(console.log("Here into BL: Get Bulletin by BulletinId", req.params.id));
    Bulletin.findById(req.params.id).then((docs) => {
        console.log("Here documents from courses collection", docs);
        res.json({ bulletins: docs });
    })
});



module.exports = app;
