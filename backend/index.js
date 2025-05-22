import express from "express"

const app = express ()

app.get("/",(req, res) => {
    res.send("Server is Ready")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Serve at http://localhost:${PORT}`)
})