import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {    
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        
        if(!found){
            throw new NotFoundException(`Task with id ${id} not found!`);
        }
        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
        return this.taskRepository.createTask(createTaskDto);
    }

    async deleteTask(id: number): Promise<string> {
        const task = await this.getTaskById(id);
        task.remove();
        return `Task deleted. Id: ${id}`;
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        console.log("service", status)
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }

    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto);
    }
}
