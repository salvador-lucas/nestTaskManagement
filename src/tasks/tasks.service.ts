import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {    
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getTaskById(
        id: number,
        user: User
        ): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        
        if(!found){
            throw new NotFoundException(`Task with id ${id} not found!`);
        }
        return found;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
        ): Promise<Task>{
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTask(
        id: number,
        user: User
        ): Promise<string> {
        const result = await this.taskRepository.delete({  id, userId: user.id })
        
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }

        return `Task deleted. Id: ${id}`;
    }

    async updateTaskStatus(
        id: number,
        status: TaskStatus,
        user: User
        ): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }

    async getTasks(
        filterDto: GetTaskFilterDto,
        user: User,
    ): Promise<Task[]>{
        return this.taskRepository.getTasks(filterDto, user);
    }
}
