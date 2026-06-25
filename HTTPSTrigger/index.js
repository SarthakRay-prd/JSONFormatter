module.exports = async function (context, req) {
    context.log('Processing JSON Formatter API Request...');

    // Extract input parameters (supporting both GET query params and POST bodies)
    const text = req.query.text || (req.body && req.body.text);
    const operation = req.query.operation || (req.body && req.body.operation);

    // Common Usage Guide Helper to include in error responses
    const usageGuide = {
        message: "Usage Guide",
        example_get: "/api/JsonFormatter?text=Hello World&operation=reverse",
        example_post: {
            url: "/api/JsonFormatter",
            headers: { "Content-Type": "application/json" },
            body: { text: "Hello World", operation: "uppercase" }
        },
        valid_operations: ["uppercase", "lowercase", "reverse", "word count"]
    };

    // 1. Error Handling: Missing inputs
    if (text === undefined || !operation) {
        context.res = {
            status: 400,
            headers: { "Content-Type": "application/json" },
            body: {
                error: "Bad Request: Missing parameters.",
                details: "You must provide both 'text' and 'operation' in your query string or request body.",
                usage: usageGuide
            }
        };
        return;
    }

    // Convert inputs for consistent parsing
    const trimmedText = typeof text === 'string' ? text.trim() : String(text).trim();
    const cleanOperation = operation.toLowerCase().trim();

    // 2. Error Handling: Blank spaces or empty string
    if (trimmedText.length === 0) {
        context.res = {
            status: 400,
            headers: { "Content-Type": "application/json" },
            body: {
                error: "Invalid Input: Text is empty or contains only whitespace.",
                details: "Please provide a valid string with alphanumeric characters.",
                usage: usageGuide
            }
        };
        return;
    }

    // 3. Error Handling: Check for string containing ONLY special characters
    const hasAlphanumeric = /[a-zA-Z0-9]/.test(trimmedText);
    if (!hasAlphanumeric && cleanOperation === "word count") {
        context.res = {
            status: 422,
            headers: { "Content-Type": "application/json" },
            body: {
                error: "Unprocessable Entity: Only special characters detected.",
                details: "Word count cannot be accurately determined for strings containing no alphanumeric characters (e.g., '!!!@@@').",
                usage: usageGuide
            }
        };
        return;
    }

    let transformedResult;

    // Execute requested operation
    switch (cleanOperation) {
        case 'uppercase':
            transformedResult = trimmedText.toUpperCase();
            break;

        case 'lowercase':
            transformedResult = trimmedText.toLowerCase();
            break;

        case 'reverse':
            transformedResult = trimmedText.split('').reverse().join('');
            break;

        case 'word count':
            // Split by one or more spaces to count words accurately
            transformedResult = trimmedText.split(/\s+/).length;
            break;

        // 4. Error Handling: Invalid operation chosen
        default:
            context.res = {
                status: 400,
                headers: { "Content-Type": "application/json" },
                body: {
                    error: `Invalid Operation: '${operation}' is not supported.`,
                    details: "The operation must be one of: 'uppercase', 'lowercase', 'reverse', or 'word count'.",
                    usage: usageGuide
                }
            };
            return;
    }

    // Success response
    context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: {
            originalText: text,
            operationApplied: cleanOperation,
            result: transformedResult
        }
    };
};