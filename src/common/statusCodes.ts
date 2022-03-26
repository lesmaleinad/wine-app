export interface HttpResponse {
    url?: string;
    statusCode: number;
}

export const OK: HttpResponse = {
    statusCode: 200,
};

export const NOT_FOUND: HttpResponse = {
    statusCode: 404,
};
