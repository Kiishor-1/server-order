if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const { port } = require('./config/appConfig');
const authRoutes = require('./routes/authRoutes');

const FRONT_ENDS = process.env.FRONT_ENDS.split(',');

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || FRONT_ENDS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Standard root");
});

app.use("/api/v1/auth", authRoutes);

app.all("*", (req, res, next) => {
    const error = new Error("No such routes available");
    error.statusCode = 404;
    next(error);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || "Internal Server Error",
    });
});

app.listen(port, () => {
    console.log(`Server is up at port ${port}`);
    connectDB()
        .then(() => {
            console.log('Connected to Database');
        })
        .catch((error) => {
            console.error('Database connection failed:', error);
        });
});
