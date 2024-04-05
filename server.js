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

// Helper function to create an ordinal number string from a number,
// e.g. "1st" from 1, "2nd" from 2, "3rd" from 3, "4th" from 4, etc.
const numberSuffixer = (num) => {
    // Numbers between 4 and 20 all end in "th"
    if (num >= 4 && num <= 20) {
        console.log('Number >=4 & <= 20')
        return num + 'th';
    }
    // Otherwise, check the trailing digit
    switch (num % 10) {
        case 1:
            console.log("Case 1 reached");
            return num + "st";
        case 2:
            return num + "nd";
        case 3:
            return num + "rd"
        default:
            console.log("Default case reached");
            return num + "th";
    }
};

// Parameter validator
// Parses an arbitrary number of strings in an array
// Returns an array of floats if all pass; if any fail, the first
// one will be logged, and an error message will be returned as a 
// string.
const validateParamsAsFloats = (params) => {
    let nums = [];
    let num;
    for (let i = 0; i < params.length; i++) {
        num = parseFloat(params[i]);
        if (isNaN(num)) {
            const nth = numberSuffixer(i + 1);
            return `Invalid number '${params[i]}' received for ${nth} parameter`;
        }
        nums.push(num);
    }
    return nums;
}

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
        const result = subtract(a, b);
        res.status(200).json({ statuscode: 200, data: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({statuscode: 500, msg: error.toString() });
    }
};

// Endpoints
// Adds n1 and n2 and returns their sum
// Usage: http://localhost:3000/add?n1=1&n2=5
// app.get("/add", (req, res) => {
//     const endpoint = '/add'
//     try {
//         // Try to parse the user's provided parameters as numbers
//         const params = [req.query.n1, req.query.n2];
//         const validatedParams = validateParamsAsFloats(params);
//         // Throw an error if validation failed and an error message was returned
//         if (typeof validatedParams == 'string') {
//             const errorMessage = validatedParams + ` at '${endpoint}' endpoint.`;
//             logger.error(errorMessage);
//             throw new Error(errorMessage);
//         }
        
//         // If the parameters are OK (i.e. no error was thrown), subtract the 2nd parameter from the 1st and return the result
//         logger.info(`Numbers ${validatedParams[0]} and ${validatedParams[1]} received for addition.`);
//         const result = add(validatedParams[0], validatedParams[1]);
//         res.status(200).json({ statuscode: 200, data: result });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({statuscode: 500, msg: error.toString() });
//     }
    
// });

// Subtracts n2 from n1 and returns this result
// Usage: http://localhost:3000/subtract?n1=1&n2=5
app.get("/subtract", (req, res) => {
    calculate(req, res, subtract)
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
