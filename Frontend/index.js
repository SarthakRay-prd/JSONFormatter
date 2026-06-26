const fs = require('fs').promises;
const path = require('path');

module.exports = async function (context, req) {
    try {
        // Read the index.html file located at the root of your JSON Formatter directory
        const htmlPath = path.join(context.executionContext.functionDirectory, '..', 'index.html');
        const htmlContent = await fs.readFile(htmlPath, 'utf8');

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "text/html"
            },
            body: htmlContent
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: "Error loading frontend index.html: " + error.message
        };
    }
};
