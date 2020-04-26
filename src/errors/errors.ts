class ApplicationError {

    message: string;
    reason: string;

    constructor(rsn ?: string) {
        this.message = 'Unexpected Error'
        rsn ? (this.reason) = rsn : this.reason = 'Unspecified Reason';
    }

    setMessage(message: string) {
        this.message = message;
    }
}
