module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processing a request.');

    // Accept inputs from query string or JSON body
    const date1Str = req.query.date1 || (req.body && req.body.date1);
    const date2Str = req.query.date2 || (req.body && req.body.date2);

    // Error Handling: Missing inputs
    if (!date1Str || !date2Str) {
        context.res = {
            status: 400,
            body: { error: "Please provide both date1 and date2." }
        };
        return;
    }

    // Helper function to validate and parse ddmmyyyy
    const parseDate = (dateStr) => {
        // Error Handling: Regex ensures strictly 8 digits
        if (!/^\d{8}$/.test(dateStr)) return null;

        const day = parseInt(dateStr.substring(0, 2), 10);
        const month = parseInt(dateStr.substring(2, 4), 10);
        const year = parseInt(dateStr.substring(4, 8), 10);

        const dateObj = new Date(year, month - 1, day);

        // Error Handling: Validate against JavaScript's auto-rollover (e.g., preventing Feb 30th)
        if (dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day) {
            return dateObj;
        }
        return null;
    };

    const parsedDate1 = parseDate(date1Str);
    const parsedDate2 = parseDate(date2Str);

    // Error Handling: Invalid calendar dates or format
    if (!parsedDate1 || !parsedDate2) {
        context.res = {
            status: 400,
            body: { error: "Invalid date format or non-existent date. Please strictly use valid ddmmyyyy format." }
        };
        return;
    }

    // Calculate the difference in time
    const diffTime = Math.abs(parsedDate2 - parsedDate1);
    
    // Convert time difference to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    context.res = {
        status: 200,
        body: { differenceInDays: diffDays }
    };
};
