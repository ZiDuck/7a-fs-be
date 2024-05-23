export class AnswerResponseFileUpload {
    filename: string;
    publicId: string;
    secureUrl: string;
    resourceType: string;

    constructor(data: Partial<AnswerResponseFileUpload>) {
        Object.assign(this, data);
    }
}
