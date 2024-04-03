const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    store: async (req, res, next) => {
        try {
            let { title, author, publishedYear, isAvailable } = req.body;

            let book = await prisma.book.create({
                data: { title, author, publishedYear, isAvailable }
            });

            res.status(201).json({
                status: true,
                message: 'OK',
                data: book
            });
        } catch (error) {
            next(error);
        }
    },

    show: async (req, res, next) => {
        try {
            let { id } = req.params;

            let book = await prisma.book.findUnique({
                where: { id: Number(id) }
            });
            if (!book) {
                return res.status(400).json({
                    status: false,
                    message: 'book id is not available!',
                    data: null
                });
            }

            res.status(200).json({
                status: true,
                message: 'OK',
                data: book
            });
        } catch (err) {
            next(err);
        }
    },

    index: async (req, res, next) => {
        try {
            let { search } = req.query;

            let books = await prisma.book.findMany({
                where: { title: { contains: search } }
            });

            res.status(200).json({
                status: true,
                message: null,
                data: books
            });
        } catch (err) {
            next(err);
        }
    }
};
