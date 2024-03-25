const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

const pool = new Pool({
    host: "localhost",
    database: "books",
    user: "postgres",
    password: "izzudin15",
    port: 5432,
});

app.use(express.json());

// Listing books
app.get("/books", async (req, res, next) => {
    try {
        const { rows } = await pool.query("SELECT * FROM books");
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// Getting a book
app.get("/books/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query("SELECT * FROM books WHERE id = $1", [
            id,
        ]);

        if (rows.length === 0) {
            res.status(404).json({ error: "buku tidak ditemukan" });
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        next(err);
    }
});

// Creating a book
app.post("/books", async (req, res, next) => {
    const { published_year, is_available, title, author } = req.body;
    try {
        const { rows } = await pool.query(
            "INSERT INTO books (published_year, is_available, title, author) VALUES ($1, $2, $3, $4) RETURNING *",
            [published_year, is_available, title, author]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// Updating a book
app.put("/books/:id", async (req, res, next) => {
    const { id } = req.params;
    const { published_year, is_available, title, author } = req.body;
    try {
        const { rows } = await pool.query(
            "UPDATE books SET published_year = $1, is_available = $2, title = $3, author = $4 WHERE id = $5 RETURNING *",
            [published_year, is_available, title, author, id]
        );

        if (rows.length === 0) {
            res.status(404).json({ error: "buku tidak ditemukan" });
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        next(err);
    }
});

// Deleting a book
app.delete("/books/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            "DELETE FROM books WHERE id = $1 RETURNING *",
            [id]
        );

        if (rows.length === 0) {
            res.status(404).json({ error: "buku tidak ditemukan" });
        } else {
            res.json({ message: "buku berhasil dihapus dari data" });
        }
    } catch (err) {
        next(err);
    }
});

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
