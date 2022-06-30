import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    reason = "Error Connecting to database";
    statusCode = 500;

    constructor() {
        super("Error Connecting to DB!");

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [
            { message: this.reason }
        ]
    }
}


