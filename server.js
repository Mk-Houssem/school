// import app from backend/app.js
const app=require("./backend/app");
// server listen to Reqs on PORT 3000 (http://localhost:3000)
app.listen(3000, ()=> {
console.log("Server is Listening ON PORT 3000..");
});