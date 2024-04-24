import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CloudinaryService } from '../../modules/cloudinary/cloudinary.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class RSFilePublicIdExistsConstraint implements ValidatorConstraintInterface {
    constructor(private readonly uploadFileService: CloudinaryService) {}

    async validate(value: string, args: ValidationArguments): Promise<boolean> {
        const resourceTypeCallback = args.constraints[0];

        const resourceType = resourceTypeCallback(args.object);
        // const type = resourceType === ResourceType.RAW ? 'private' : '';
        const result: boolean = await this.uploadFileService.checkResourcesExists({
            publicId: value,
            resourceType: resourceType,
        });

        return result;
    }

    defaultMessage(args: ValidationArguments): string {
        return `${args.property} "${args.value}" doesn't exist.`;
    }
}

export function RSFilePublicIdExists(resourceTypeCallback: (object: any) => string, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: RSFilePublicIdExists.name,
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: RSFilePublicIdExistsConstraint,
            constraints: [resourceTypeCallback],
        });
    };
}
