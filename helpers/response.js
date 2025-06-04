const sendSuccess = (res, payload) => {
    res.status(200).send({
        status: "SUCCESS",
        message: payload.message || "Request was successful",
        ...payload
    });
}

const sendError = (res, payload) => {
    res.status(500).send({
        status: "ERROR",
        message: payload.message || "An error occurred",
        ...payload
    });
}

const sendSuccessCreated = (res, payload) => {
    res.status(201).send({
        status: "SUCCESS",
        message: payload.message || "Resource was created",
        ...payload
    });
}

const sendErrorNotFound = (res, payload) => {
    res.status(404).send({
        status: "ERROR",
        message: payload.message || "Resource not found",
        ...payload
    });
}

const sendErrorBadRequest = (res, payload) => {
    res.status(400).send({
        status: "ERROR",
        message: payload.message || "Bad request",
        ...payload
    });
}

export default {
    sendSuccess,
    sendError,
    sendSuccessCreated,
    sendErrorNotFound,
    sendErrorBadRequest
}