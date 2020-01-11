const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
var cookieParser = require("cookie-parser");
const fetch = require("node-fetch");

async function postForm(body) {
  fetch("https://httpbin.org/post", {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(json => console.log(json));
}

//form parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//static file
app.use(express.static(path.join(__dirname, "public")));

//cookie parser
app.use(cookieParser());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/auth.html"));
});
//gg
app.get("/reg", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/reg.html"));
});

app.post("/reg", urlencodedParser, function(req, res) {
  if (!req.body) return response.sendStatus(400);
  postForm(req.body).then(() => {
    switch (req.body.role) {
      case "STUDENT":
        res.cookie("id", "student_id");
        res.cookie("role", "student");
        res.redirect("/student/");
        break;
      case "TEAHER":
        res.cookie("id", "teacher_id");
        res.cookie("role", "teacher");
        res.redirect("/teacher/");
        break;
      default:
        res.redirect("/");
    }
  });
});

app.post("/auth", urlencodedParser, function(req, res) {
  if (!req.body) return response.sendStatus(400);
  postForm(req.body).then(() => {
    switch (req.body.userName) {
      case "STUDENT":
        res.cookie("id", "student_id");
        res.cookie("role", "STUDENT");
        res.redirect("/student/");
        break;
      case "TEACHER":
        res.cookie("id", "teacher_id");
        res.cookie("role", "TEACHER");
        res.redirect("/teacher/");
        break;
      default:
        res.redirect("/");
    }
  });
});

app.get("/student/*", (req, res) => {
  if (req.cookies.id === undefined || req.cookies.id === null) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(__dirname + "/client/student/build/index.html"));
  }
});

app.get("/teacher/*", (req, res) => {
  if (req.cookies.id === undefined || req.cookies.id === null) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(__dirname + "/client/teacher/build/index.html"));
  }
});

app.listen(9000);
