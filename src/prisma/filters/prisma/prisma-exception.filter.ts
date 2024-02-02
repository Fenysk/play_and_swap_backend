import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const message = exception.message || 'Something went wrong';

        const modelName = exception.meta.modelName;
        let target: string[] = [];

        const getTargets: any = (target: string[]) => {
            if (Array.isArray(target))
                return target.join(', ');

            return [target];
        };

        switch (exception.code) {
            case 'P2002':
                if (exception.meta.target)
                    target = getTargets(exception.meta.target);

                response.status(HttpStatus.CONFLICT).json({
                    statusCode: HttpStatus.CONFLICT,
                    message: `${modelName} with [${target.join(', ')}] already exists`
                });
                break;
            case 'P2025':
                if (exception.meta.target)
                    target = exception.meta.target as string[];

                response.status(HttpStatus.NOT_FOUND).json({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: target.length > 0 ?
                        `${modelName} with [${target.join(', ')}] not found` :
                        `${modelName} not found`
                });
                break;
            default:
                super.catch(exception, host);
        }
    }
}
