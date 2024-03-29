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
        if (!id) return false;

        if (!isUUID(id)) return false;

        const model = args.constraints[0];
        const entity = await this.entityManager.getRepository(model).findOneBy({ id });
        return !!entity;
    }

    defaultMessage(args: ValidationArguments) {
        if (!isUUID(args.value)) {
            return `${args.value} is not a valid UUID`;
        }
        return `Id ${args.value} does not exist in table ${args.constraints[0].name}`;
    }
}

// export function IdExists(resourceTypes: { new (...args: any[]): any }, validationOptions?: ValidationOptions) {
//     return applyDecorators(IsUUID(), _IdExists(validationOptions, resourceTypes));
// }

export function IdExists(resourceTypes: { new (...args: any[]): any }, validationOptions?: ValidationOptions) {
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
