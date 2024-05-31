import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { ResourceType } from '../../cores/enums/resource-type.enum';
import { CloudinaryService } from '../../modules/cloudinary/cloudinary.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class FilePublicIdExistsConstraint implements ValidatorConstraintInterface {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

    async validate(value: string, args: ValidationArguments): Promise<boolean> {
        let resourceType = args.constraints[0];

        const listResourceType = Object.values(ResourceType);

        if (!listResourceType.includes(resourceType)) resourceType = (args.object as any)[resourceType];
        // const type = resourceType === ResourceType.RAW ? 'private' : '';
        // const result: boolean = await this.cloudinaryService.checkResourcesExists({
        //     publicId: value,
        //     resourceType: resourceType,
        // });

        return true;
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
