import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskSatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    // @Get()
    // getAllTasks(): Task[] {
    //     return this.tasksService.getAllTasks();
    // }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Task[] {
        if(Object.keys(filterDto).length != 0){
            return this.tasksService.getTaskWithFilter(filterDto);
        }
        return this.tasksService.getAllTasks();
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task{
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): string{
        return this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    updaTaskStatus(
        @Param('id') id: string, 
        @Body('status', TaskSatusValidationPipe) status: TaskStatus
    ): Task{
        return this.tasksService.updateTaskStatus(id, status);
    }
}
