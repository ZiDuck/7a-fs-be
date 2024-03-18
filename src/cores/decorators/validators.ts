// import {
//     IsBoolean,
//     IsDate,
//     IsEmail,
//     IsEnum,
//     IsNotEmpty,
//     IsNumber,
//     IsNumberOptions,
//     IsOptional,
//     IsString,
//     IsUUID,
//     Max,
//     MaxLength,
//     Min,
//     MinLength,
//     UUIDVersion,
//     ValidationOptions,
// } from 'class-validator';
// import { I18nTranslations } from 'generated/i18n.generated';
// import { i18nValidationMessage } from 'nestjs-i18n';
// import ValidatorJS from 'validator';
// import { IdExists } from '../../common/validator/uuid.validator';
// import { DeviceIdExists } from '../../common/validator/device-id.validator';

// const $t = i18nValidationMessage<I18nTranslations>;

// export const AppMin: typeof Min = (minValue: number, validationOptions?: ValidationOptions) => {
//     return Min(minValue, {
//         message: $t('validate.Min'),
//         ...validationOptions,
//     });
// };

// export const AppMax: typeof Max = (maxValue: number, validationOptions?: ValidationOptions) => {
//     return Max(maxValue, {
//         message: $t('validate.Max'),
//         ...validationOptions,
//     });
// };

// export const AppIsEnum: typeof IsEnum = (entity: object, validationOptions?: ValidationOptions) => {
//     return IsEnum(entity, {
//         message: $t('validate.IsEnum', { enums: Object.values(entity).join(', ') }),
//         ...validationOptions,
//     });
// };

// export const AppIsUUID: typeof IsUUID = (version?: UUIDVersion, validationOptions?: ValidationOptions) => {
//     return IsUUID(version, {
//         message: $t('validate.IsUUID'),
//         ...validationOptions,
//     });
// };

// export const AppIsEmail: typeof IsEmail = (options?: ValidatorJS.IsEmailOptions, validationOptions?: ValidationOptions) => {
//     return IsEmail(options, {
//         message: $t('validate.IsEmail'),
//         ...validationOptions,
//     });
// };

// export const AppIsString: typeof IsString = (validationOptions?: ValidationOptions) => {
//     return IsString({
//         message: $t('validate.IsString'),
//         ...validationOptions,
//     });
// };

// export const AppIsNotEmpty: typeof IsNotEmpty = (validationOptions?: ValidationOptions) => {
//     return IsNotEmpty({
//         message: $t('validate.IsNotEmpty'),
//         ...validationOptions,
//     });
// };

// export const AppIsNumber: typeof IsNumber = (options?: IsNumberOptions, validationOptions?: ValidationOptions) => {
//     return IsNumber(options, {
//         message: $t('validate.IsNumber'),
//         ...validationOptions,
//     });
// };

// export const AppMinLength: typeof MinLength = (min: number, validationOptions?: ValidationOptions) => {
//     return MinLength(min, {
//         message: $t('validate.MinLength', { minLength: min }),
//         ...validationOptions,
//     });
// };

// export const AppMaxLength: typeof MaxLength = (max: number, validationOptions?: ValidationOptions) => {
//     return MaxLength(max, {
//         message: $t('validate.MaxLength', { maxLength: max }),
//         ...validationOptions,
//     });
// };

// export const AppIdExists: typeof IdExists = (resourceTypes: new (...args: any[]) => any, validationOptions?: ValidationOptions) => {
//     return IdExists(resourceTypes, {
//         message: $t('validate.IdNotExists', { model: resourceTypes.name }),
//         ...validationOptions,
//     });
// };

// export const AppDeviceIdExists: typeof DeviceIdExists = (resourceTypes: new (...args: any[]) => any, validationOptions?: ValidationOptions) => {
//     return DeviceIdExists(resourceTypes, {
//         message: $t('validate.IdNotExists', { model: resourceTypes.name }),
//         ...validationOptions,
//     });
// };

// export const AppIsBoolean: typeof IsBoolean = (validationOptions?: ValidationOptions) => {
//     return IsBoolean({
//         message: $t('validate.IsBoolean'),
//         ...validationOptions,
//     });
// };

// export const AppIsDate: typeof IsDate = (validationOptions?: ValidationOptions) => {
//     return IsDate({
//         message: $t('validate.IsDate'),
//         ...validationOptions,
//     });
// };

// export const AppIsOptional: typeof IsOptional = (validationOptions?: ValidationOptions) => {
//     return IsOptional({
//         ...validationOptions,
//     });
// };
