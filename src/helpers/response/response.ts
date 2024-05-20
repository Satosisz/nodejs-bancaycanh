import { HttpStatus } from "@nestjs/common";

export class Paging {
    private readonly pageNumber: number;
    private readonly pageSize: number;
    private readonly totalPages: number;
    private readonly totalElements: number;

    constructor(pageNumber: number, pageSize: number, totalElements: number) {
        this.pageNumber = Number(pageNumber);
        this.pageSize = Number(pageSize);
        this.totalElements = totalElements;
        this.totalPages = Math.ceil(totalElements % pageSize === 0 ? totalElements / pageSize + 1 : totalElements / pageSize)
    }
}

export class Response {
    readonly status: string | number;
    readonly message: string;
    readonly data: any;
    readonly code?: any;

    constructor(status: string | number, data: any, message?: string, code?: string) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.code = code;
    }
}

export const BaseResponse = (status: string | number, data: any, code?: string, message?: string,) => {
    if (status == 'success' || status == 'fail' || status == HttpStatus.BAD_REQUEST) {
        let newData = ((status == 'fail' || status == HttpStatus.BAD_REQUEST) && data?.data) || data;

        let statusRs = status == 'success' ? 'success' : 'fail';
        return new Response(statusRs, newData, message, data?.code || code);
    } else {
        return new Response('error', data?.data || null, message, data?.code || code);
    }
}
