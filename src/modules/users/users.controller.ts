import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Param,
    ParseUUIDPipe,
    Patch,
    Put,
    Query,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GetUserDto } from './dto/get-user.dto';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { UpdateUserInput } from './dto/update-user.input';
import { AdminRole } from '../../cores/decorators/role.decorator';
import { UseRoleGuard } from '../../cores/decorators/use-role.decorator';
import { CurrentUser } from '../../cores/decorators/user.decorator';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { ClsService } from 'nestjs-cls';

@ApiTags('users')
@ApiBearerAuth()
@UseRoleGuard()
@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly cls: ClsService,
    ) {}

    @Get('me')
    async findCurrent(@CurrentUser() userId: string): Promise<GetUserDto> {
        return plainToInstance(GetUserDto, await this.userService.findOne(userId));
    }

    @AdminRole()
    @Get()
    async findAll(): Promise<GetUserDto[]> {
        return plainToInstance(GetUserDto, await this.userService.findAll());
    }

    @AdminRole()
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return await this.userService.findOne(id);
    }

    @AdminRole()
    @Transactional()
    @Put(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateUserInput): Promise<GetUserDto> {
        try {
            const result = await this.userService.update(id, data);
            return plainToInstance(GetUserDto, result);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @AdminRole()
    @Transactional()
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() userId: string, @Req() req: any): Promise<void> {
        try {
            await this.userService.delete(id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }

    @AdminRole()
    @Transactional()
    @Patch(':id/restore')
    async restoreDeleted(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() userId: string, @Req() req: any): Promise<void> {
        try {
            await this.userService.restore(id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message);
        }
    }
}
