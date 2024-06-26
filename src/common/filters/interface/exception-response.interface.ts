export interface HttpExceptionResponse {
    readonly statusCode: number;

    readonly error: string;

    readonly timestamps: string;

    readonly path: string;

    readonly message?: unknown;

    readonly messages?: unknown[];

    readonly data?: unknown;

    readonly trace?: string;
}

export interface ExceptionResponse {
    readonly statusCode: number;

    readonly error: string;

    readonly timestamps: string;

    readonly path: string;

    readonly message?: unknown;

    readonly messages?: unknown[];

    readonly data?: unknown;
}
