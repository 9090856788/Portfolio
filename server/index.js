import express from "express";

const app = express();
const PORT = 3000;

app.get(( req, res ) => {
    res.send("Hello Backend Development");
})

app.listen(PORT, () => {
    console.log(`Server running the port: ${PORT}`)
});