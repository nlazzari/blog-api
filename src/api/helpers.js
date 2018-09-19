function handleRequest(resultCallback) {
    return async (req, res) => {
        try {
            const result = await resultCallback(req);
            return res.send(result);
        } catch (error) {
            const status = (error && error.statusCode) || 500;
            console.error(`Error handling ${req.method} request to ${req.path}: \n`, error);
            return res.status(status).send({ status, message: error.message || 'Error handling request' });
        }
    };
}

function Error(statusCode, message) {
    return { statusCode, message };
}

module.exports = {
    handleRequest,
    Error,
};
