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
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GetUserDto } from './dto/get-user.dto';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserInput } from './dto/update-user.input';
import { AdminRole } from '../../cores/decorators/role.decorator';
import { UseRoleGuard } from '../../cores/decorators/use-role.decorator';
import { CurrentUser } from '../../cores/decorators/user.decorator';
import { Transactional } from 'typeorm-transactional';
import { ClsService } from 'nestjs-cls';
import { ApiOkResponseDto } from '../../cores/decorators/api-ok-dto.decorator';
import { ApiException } from '../../cores/decorators/api-exception.decorator';
import { DecentralizeInput } from './dto/decentralize.input';

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

    @ApiOkResponseDto(GetUserDto)
    @AdminRole()
    @Get()
    async findAll(): Promise<GetUserDto[]> {
        return plainToInstance(GetUserDto, await this.userService.findAll());
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

    @ApiOkResponseDto(GetUserDto)
    @ApiException(() => BadRequestException, { description: 'The ${email} is not exists!' })
    @AdminRole()
    @Get(':id/email')
    async findOneByEmail(@Param('email') email: string): Promise<GetUserDto> {
        return plainToInstance(GetUserDto, await this.userService.findOneByEmail(email));
    }

    @AdminRole()
    @Transactional()
    @Patch(':id')
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
}
