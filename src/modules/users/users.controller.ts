import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    InternalServerErrorException,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ClsService } from 'nestjs-cls';
import { Transactional } from 'typeorm-transactional';

import { PageDto } from '../../common/dtos/page.dto';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { QueryDto } from '../../common/dtos/query.dto';
import { ActionType } from '../../cores/constants';
import { ApiException } from '../../cores/decorators/api-exception.decorator';
import { ApiOkResponseDto } from '../../cores/decorators/api-ok-dto.decorator';
import { ApiPaginatedResponse } from '../../cores/decorators/api-paginated-dto.decorator';
import { AuthLogging } from '../../cores/decorators/auth-logging.decorator';
import { AdminRole, AdminUserRole } from '../../cores/decorators/role.decorator';
import { UseRoleGuard } from '../../cores/decorators/use-role.decorator';
import { CurrentUser } from '../../cores/decorators/user.decorator';
import { AuthLoggingInterceptor } from '../../cores/interceptors/auth-logging.interceptor';
import { CreateUserInput } from './dto/create-user.input';
import { DecentralizeInput } from './dto/decentralize.input';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseRoleGuard()
@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly cls: ClsService,
    ) {}

    @ApiOkResponseDto(GetUserDto)
    @Get('me')
    async findCurrent(@CurrentUser() userId: string): Promise<GetUserDto> {
        return plainToInstance(GetUserDto, await this.userService.findOne(userId));
    }

    @ApiPaginatedResponse(GetUserDto)
    @AdminRole()
    @Get()
    async findAll(@Query() query: PageQueryDto): Promise<PageDto<User>> {
        const result = await this.userService.findAllPagination(query);

        result.items = plainToInstance(GetUserDto, result.items);

        return result;
        // return { items: plainToInstance(GetUserDto, result.items), ...result };
        // return plainToInstance(GetUserDto, await this.userService.findAll(query));
    }

    @ApiOkResponseDto(GetUserDto)
    @ApiException(() => BadRequestException, { description: 'The ${id} is not exists!' })
    @AdminRole()
    @Get('/is-deleted')
    async findAllDeleted(@Query() query: PageQueryDto): Promise<PageDto<User>> {
        const result = await this.userService.findAllDeleted(query);

        result.items = plainToInstance(GetUserDto, result.items);

        return result;
    }

    @ApiOkResponseDto(GetUserDto)
    @ApiException(() => BadRequestException, { description: 'The ${email} is not exists!' })
    @AdminRole()
    @Get('email')
    async findOneByEmail(@Query() query: QueryDto): Promise<PageDto<User>> {
        const result = await this.userService.findAllByEmail(query);

        result.items = plainToInstance(GetUserDto, result.items);

        return result;
    }

    @ApiOkResponseDto(GetUserDto)
    @ApiException(() => BadRequestException, { description: 'The ${id} is not exists!' })
    @AdminRole()
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<GetUserDto> {
        return plainToInstance(GetUserDto, await this.userService.findOne(id));
    }

    @ApiOkResponseDto(GetUserDto)
    @ApiException(() => BadRequestException, { description: 'The ${id} is not exists!' })
    @AdminRole()
    @Get(':id/is-deleted')
    async findOneDeleted(@Param('id', ParseUUIDPipe) id: string): Promise<GetUserDto> {
        return plainToInstance(GetUserDto, await this.userService.findOneDeleted(id));
    }

    @AdminUserRole()
    @Transactional()
    @UseInterceptors(AuthLoggingInterceptor)
    @AuthLogging(ActionType.UPDATE_USER)
    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateUserInput): Promise<boolean> {
        try {
            return await this.userService.update(id, data);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @AdminRole()
    @Transactional()
    @UseInterceptors(AuthLoggingInterceptor)
    @AuthLogging(ActionType.DElETE_USER)
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        try {
            await this.userService.delete(id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @AdminRole()
    @Transactional()
    @UseInterceptors(AuthLoggingInterceptor)
    @AuthLogging(ActionType.RESTORE_USER)
    @Patch(':id/restore')
    async restoreDeleted(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        try {
            await this.userService.restore(id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @AdminRole()
    @Transactional()
    @Patch(':userId/decentralize')
    async Decentralize(@Param('userId', ParseUUIDPipe) userId: string, @Body() role: DecentralizeInput): Promise<void> {
        try {
            await this.userService.decentralize(userId, role.roleId);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @ApiBearerAuth()
    @AdminRole()
    @Transactional()
    @UseInterceptors(AuthLoggingInterceptor)
    @AuthLogging(ActionType.CREATE_USER)
    @Post()
    async create(@CurrentUser() userId: string, @Body() data: CreateUserInput): Promise<GetUserDto> {
        try {
            const result = await this.userService.create(data);
            return plainToInstance(GetUserDto, result);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}
