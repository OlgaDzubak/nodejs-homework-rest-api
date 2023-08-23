const httpError = (status, message) => {
    console.log("message=",message);
    const error = new Error(message);
    error.status = status;
    return error;
}

module.exports = httpError;
