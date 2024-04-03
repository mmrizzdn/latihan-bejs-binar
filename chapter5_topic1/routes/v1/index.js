const router = require('express').Router();

const v1 = require('../../controllers/v1');

// auth middleware
function auth(req, res, next) {
    let { authorization } = req.headers;

    if (authorization) {
        let token = authorization.split(' ')[1];

        if (token) {
            return next();
        }
    }

    return res.status(401).json({
        status: false,
        message: "you're not authorized!",
        data: null
    });
}

router.post('/books', auth, v1.book.store);
router.get('/books', v1.book.index);
router.get('/books/:id', v1.book.show);

module.exports = router;
