import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CloudinaryService } from '../../modules/cloudinary/cloudinary.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class FilePublicIdExistsConstraint implements ValidatorConstraintInterface {
    constructor(private readonly uploadFileService: CloudinaryService) {}

    async validate(value: string, args: ValidationArguments): Promise<boolean> {
        const resourceType = args.constraints[0];
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

export function FilePublicIdExists(resourceTypes: string, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: FilePublicIdExists.name,
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: FilePublicIdExistsConstraint,
            constraints: [resourceTypes],
        });
    };
}
