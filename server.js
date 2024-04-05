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
const power = (n1, n2) => {
    return n1 ** n2;
}
const root = (n1, n2) => {
    return n1 ** (1 / n2 );
}
const mod = (n1, n2) => {
    return n1 % n2;
}

// Generic calculator HTTP request and response function
const calculate = (req, res, fun) => {
    try {
        // Try to parse the user's provided parameters as numbers
        const n1 = req.query.n1;
        const n2 = req.query.n2;
        const a = parseFloat(n1);
        const b = parseFloat(n2);

        // If they're not valid numbers, log and throw an error
        if (isNaN(a)) {
            logger.error(`Invalid number '${n1}' received for parameter n2 in function ${fun.name}.`);
            throw new Error(`Invalid number '${n1}' received for parameter n1.`);
        }
        if (isNaN(b)) {
            logger.error(`Invalid number '${n2}' received for parameter n2 in function ${fun.name}.`);
            throw new Error(`Invalid number '${n2}' received for parameter n2.`);
        }
        
        // If the parameters are OK (i.e. no error was thrown), subtract n2 from n1 and return the result
        logger.info(`Numbers ${a} and ${b} received for function ${fun.name}.`);
        const result = fun(a, b);
        res.status(200).json({ statuscode: 200, data: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({statuscode: 500, msg: error.toString() });
    }
};

// Endpoints
// Adds n1 and n2 and returns their sum
// Usage: http://localhost:3000/add?n1=1&n2=5
app.get("/add", (req, res) => {
    calculate(req, res, add);
});

// Subtracts n2 from n1 and returns this result
// Usage: http://localhost:3000/subtract?n1=1&n2=5
app.get("/subtract", (req, res) => {
    calculate(req, res, subtract);
});

// Multiplies n1 by n2 and returns this result
// Usage: http://localhost:3000/mulitply?n1=1&n2=5
app.get("/multiply", (req, res) => {
    calculate(req, res, multiply);
});

// Divides n1 by n2 and returns this result
// Usage: http://localhost:3000/divide?n1=1&n2=5
app.get("/divide", (req, res) => {
    // Specialised error handling for divide by zero error
    try {
        if (parseFloat(req.query.n2) == 0) {
            logger.error("Parameter n2 is zero. Unable to divide by zero");
            throw new Error("Parameter n2 is zero. Unable to divide by zero");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({statuscode: 500, msg: error.toString() });
    }
    calculate(req, res, divide);
});

// Raises n1 to the n2th power and returns the result
// Usage: http://localhost:3000/power?n1=1&n2=5
app.get("/power", (req, res) => {
    calculate(req, res, power);
});

// Calculates the n2th root of n1 and returns the result
// Usage: http://localhost:3000/root?n1=1&n2=5
app.get("/root", (req, res) => {
    // Specialised error handling for even roots
    try {
        // n1 can't be negative if n2 is an even root
        if ( (parseFloat(req.query.n2) % 2 == 0) && (parseFloat(req.query.n1) < 0) ) {
            logger.error("Negative n1 is not possible for even roots (i.e. even n2)");
            throw new Error("Negative n1 is not possible for even roots (i.e. even n2)");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({statuscode: 500, msg: error.toString() });
    }
    calculate(req, res, root);
});

// Raises n1 % n2 and returns the result
// Usage: http://localhost:3000/mod?n1=1&n2=5
app.get("/mod", (req, res) => {
    calculate(req, res, mod);
});


app.listen(port, () => {
    console.log("App listening on port", port);
});
