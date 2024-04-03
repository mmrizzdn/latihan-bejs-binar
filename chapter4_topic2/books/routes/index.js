const router = require('express').Router();
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    database: 'books',
    user: 'postgres',
    password: 'izzudin15',
    port: 5432,
});

router.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'welcome to books api',
        data: null,
    });
});

// Listing books
router.get('/books', async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM books');
        res.status(200).json({
            status: true,
            message: null,
            data: rows,
        });
    } catch (err) {
        next(err);
    }
});

// Getting a book
router.get('/books/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [
            id,
        ]);

        if (rows.length === 0) {
            res.status(404).json({
                status: false,
                message: `can't find books with id ${id}`,
                data: null,
            });
        } else {
            res.status(200).json({
                status: true,
                message: null,
                data: rows[0],
            });
        }
    } catch (err) {
        next(err);
    }
});

// Creating a book
router.post('/books', async (req, res, next) => {
    const { published_year, is_available, title, author } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO books (published_year, is_available, title, author) VALUES ($1, $2, $3, $4) RETURNING *',
            [published_year, is_available, title, author]
        );

        res.status(201).json({
            status: true,
            message: null,
            data: rows[0],
        });
    } catch (err) {
        next(err);
    }
});

// Updating a book
router.put('/books/:id', async (req, res, next) => {
    const { id } = req.params;
    const { published_year, is_available, title, author } = req.body;
    try {
        const { rows } = await pool.query(
            'UPDATE books SET published_year = $1, is_available = $2, title = $3, author = $4 WHERE id = $5 RETURNING *',
            [published_year, is_available, title, author, id]
        );

        if (rows.length === 0) {
            res.status(404).json({
                status: false,
                message: `can't find books with id ${id}`,
                data: null,
            });
        } else {
            res.status(200).json({
                status: true,
                message: null,
                data: rows[0],
            });
        }
    } catch (err) {
        next(err);
    }
});

// Deleting a book
router.delete('/books/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            'DELETE FROM books WHERE id = $1 RETURNING *',
            [id]
        );

        if (rows.length === 0) {
            res.status(404).json({
                status: false,
                message: `can't find books with id ${id}`,
                data: null,
            });
        } else {
            res.status(200).json({
                status: true,
                message: null,
                data: rows[0],
            });
        }
    } catch (err) {
        next(err);
    }
});

router.delete('/books-delete', async (req, res) => {
    let { ids } = req.params;

    let idsStr = '';
    ids.forEach((id, idx) => {
        if (idx == 0) {
            idsStr += id;
        } else {
            idsStr += `,${id}`;
        }
    });

    let result = await pool.query(`DELETE FROM books WHERE id IN (${idsStr})`);

    res.status(200).json({
        status: true,
        message: null,
        data: result.rowCount,
    });
});

module.exports = router;
