// Packages
const express = require("express");
const app = express();
const fs = require("fs");
const winston = require("winston");

/**
 * Logging levels specified by RFC5424, used by libraries such as `winston`, are as follows:
 * 
 * const levels = {
 *  error: 0,
 *  warn: 1,
 *  info: 2,
 *  http: 3,
 *  verbose: 4,
 *  debug: 5,
 *  silly: 6
 * }
 * 
 * This information can be 
 */
// 

// Environment variables and loggers
const port = process.env.port || 3000;
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta:  { service: 'calculator-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error'}),
        new winston.transports.File({ filename: 'combined.log' })
    ]
})

// Calculator functions
const add = (n1, n2) => {
    return n1 + n2;
}
const subtract = (n1, n2) => {
    return n1 - n2
}
const multiply = (n1, n2) => {
    return n1 * n2;
}
const divide = (n1, n2) => {
    return n1 / n2;
}

// Endpoints
// Adds n1 and n2 and returns their sum
// Usage: http://localhost:3000/add?n1=1&n2=5
app.get("/add", (req, res) => {
    try {
        // Try to parse the user's provided parameters as numbers
        const n1 = req.query.n1;
        const n2 = req.query.n2;
        const a = parseFloat(n1);
        const b = parseFloat(n2);

        // If they're not valid numbers, log and throw an error
        if (isNaN(a)) {
            logger.error(`Invalid number '${n1}' received for parameter n2.`);
            throw new Error(`Invalid number '${n1}' received for parameter n1.`);
        }
        if (isNaN(b)) {
            logger.error(`Invalid number '${n2}' received for parameter n2.`);
            throw new Error(`Invalid number '${n2}' received for parameter n2.`);
        }

        // If the parameters are OK (i.e. no error was thrown), subtract n2 from n1 and return the result
        logger.info(`Numbers ${a} and ${b} received for addition.`);
        const result = add(a, b);
        res.status(200).json({ statuscode: 200, data: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({statuscode: 500, msg: error.toString() });
    }
    
});

// Subtracts n2 from n1 and returns this result
// Usage: http://localhost:3000/subtract?n1=1&n2=5
app.get("/subtract", (req, res) => {
    try {
        // Try to parse the user's provided parameters as numbers
        const n1 = req.query.n1;
        const n2 = req.query.n2;
        const a = parseFloat(n1);
        const b = parseFloat(n2);

        // If they're not valid numbers, log and throw an error
        if (isNaN(a)) {
            logger.error(`Invalid number '${n1}' received for parameter n2.`);
            throw new Error(`Invalid number '${n1}' received for parameter n1.`);
        }
        if (isNaN(b)) {
            logger.error(`Invalid number '${n2}' received for parameter n2.`);
            throw new Error(`Invalid number '${n2}' received for parameter n2.`);
        }
        
        // If the parameters are OK (i.e. no error was thrown), subtract n2 from n1 and return the result
        logger.info(`Numbers ${a} and ${b} received for subtraction.`);
        const result = subtract(a, b);
        res.status(200).json({ statuscode: 200, data: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({statuscode: 500, msg: error.toString() });
    }
    
});

// Multiplies n1 by n2 and returns this result
// Usage: http://localhost:3000/mulitply?n1=1&n2=5
app.get("/multiply", (req, res) => {
    try {
        // Try to parse the user's provided parameters as numbers
        const n1 = req.query.n1;
        const n2 = req.query.n2;
        const a = parseFloat(n1);
        const b = parseFloat(n2);

        // If they're not valid numbers, log and throw an error
        if (isNaN(a)) {
            logger.error(`Invalid number '${n1}' received for parameter n2.`);
            throw new Error(`Invalid number '${n1}' received for parameter n1.`);
        }
        if (isNaN(b)) {
            logger.error(`Invalid number '${n2}' received for parameter n2.`);
            throw new Error(`Invalid number '${n2}' received for parameter n2.`);
        }
        
        // If the parameters are OK (i.e. no error was thrown), subtract n2 from n1 and return the result
        logger.info(`Numbers ${a} and ${b} received for multiplication.`);
        const result = multiply(a, b);
        res.status(200).json({ statuscode: 200, data: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({statuscode: 500, msg: error.toString() });
    }
    
});

// Divides n1 by n2 and returns this result
// Usage: http://localhost:3000/divide?n1=1&n2=5
app.get("/divide", (req, res) => {
    try {
        // Try to parse the user's provided parameters as numbers
        const n1 = req.query.n1;
        const n2 = req.query.n2;
        const a = parseFloat(n1);
        const b = parseFloat(n2);

        // If they're not valid numbers, log and throw an error
        if (isNaN(a)) {
            logger.error(`Invalid number '${n1}' received for parameter n2.`);
            throw new Error(`Invalid number '${n1}' received for parameter n1.`);
        }
        if (isNaN(b)) {
            logger.error(`Invalid number '${n2}' received for parameter n2.`);
            throw new Error(`Invalid number '${n2}' received for parameter n2.`);
        }
        if (b == 0) {
            logger.error("Parameter n2 is zero. Unable to divide by zero");
            throw new Error("Parameter n2 is zero. Unable to divide by zero");
        }
        
        // If the parameters are OK (i.e. no error was thrown), subtract n2 from n1 and return the result
        logger.info(`Numbers ${a} and ${b} received for division.`);
        const result = divide(a, b);
        res.status(200).json({ statuscode: 200, data: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({statuscode: 500, msg: error.toString() });
    }
    
});

app.listen(port, () => {
    console.log("App listening on port", port);
});
