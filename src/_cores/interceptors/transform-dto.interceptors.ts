
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from '@nestjs/common';
import type { ClassConstructor } from 'class-transformer';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export function transformToDtoResponse<T>(dto: ClassConstructor<T>) {
    return UseInterceptors(new TrasformToDtoInterceptor(dto))
}


@Injectable()
export class TrasformToDtoInterceptor<T> implements NestInterceptor {
    constructor(private readonly dtoClass: ClassConstructor<T>) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();

        return next
            .handle()
            .pipe(
                map(data => {
                    if (Object.prototype.hasOwnProperty.call(data, 'hasNextPage')) {
                        const { items, hasNextPage, cursor } = data
                        return {
                            message: 'success',
                            data: plainToInstance(this.dtoClass, items, {
                                excludeExtraneousValues: true
                            }),
                            hasNextPage,
                            cursor

                        }
                    }
                    if (request.path.includes('auth')) {
                        const { access_token, user } = data;

                        return {
                            message: 'success',
                            data: plainToInstance(this.dtoClass, user, {
                                excludeExtraneousValues: true
                            }),
                            access_token
                        }

                    }
                    return {
                        message: 'success',
                        data: plainToInstance(this.dtoClass, data, {
                            excludeExtraneousValues: true
                        })
                    }

                })
            )
    }
}