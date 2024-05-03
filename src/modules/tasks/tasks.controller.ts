import { Controller, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    async removeImageOnCloudinary() {
        return await this.tasksService.removeOldNotifications();
    }
}
