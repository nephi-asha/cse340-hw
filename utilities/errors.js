class GeneralError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }

    getCode() {
        if (this instanceof BadRequest) {
            return 400;
        } else if (this instanceof NotFound) {
            return 404;
        } else {
            return 500;
        }
    }
}

class BadRequest extends GeneralError { }
class NotFound extends GeneralError { }

module.exports = {
    GeneralError,
    BadRequest,
    NotFound
};