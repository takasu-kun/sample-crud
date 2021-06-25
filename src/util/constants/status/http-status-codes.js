const HTTP_STATUS = {
    Success: 200,
    BadRequestError: 400,
    UnauthorizedError: 401,
    NotAcceptableError: 406,
    InternalServerError: 500,
    UnprocessableEntity: 422,
    TooManyRequestsError: 429
};

module.exports = { HTTP_STATUS };