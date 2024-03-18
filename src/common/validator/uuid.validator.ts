import { Injectable, applyDecorators } from '@nestjs/common';
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    ValidationOptions,
    registerDecorator,
    isUUID,
    IsUUID,
} from 'class-validator';
import { EntityManager } from 'typeorm';

@Injectable()
@ValidatorConstraint({ name: 'customText', async: false })
export class UuidExistsConstraint implements ValidatorConstraintInterface {
    constructor(private readonly entityManager: EntityManager) {}

    async validate(id: string | null, args: ValidationArguments): Promise<boolean> {
        if (!id) return true;
        const model = args.constraints[0];
        const entity = await this.entityManager.getRepository(model).findOneBy({ id });
        return entity ? true : false;
    }

    defaultMessage(args: ValidationArguments) {
        // here you can provide default error message if validation failed
        return `Id $value does not exist in ${args.constraints[0]}`;
    }
}

export function IdExists(resourceTypes: { new (...args: any[]): any }, validationOptions?: ValidationOptions) {
    return applyDecorators(IsUUID(), _IdExists(validationOptions, resourceTypes));
}

function _IdExists(
    validationOptions: ValidationOptions,
    resourceTypes: new (...args: any[]) => any,
): ClassDecorator | MethodDecorator | PropertyDecorator {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: IdExists.name,
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: UuidExistsConstraint,
            constraints: [resourceTypes],
        });
    };
}
