import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';

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


    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // getTaskWithFilter(filterDto: GetTaskFilterDto): Task[] {
    //     const {status, search} = filterDto;
    //     let tasks = this.getAllTasks();
    //     if(status){
    //         tasks = tasks.filter(task => task.status === status);
    //     }
    //     if(search){
    //         tasks = tasks.filter(task => 
    //             task.title.includes(search) ||
    //             task.description.includes(search)
    //         );
    //     }
    //     return tasks;
    // }

    // deleteTask(id: string): string{
    //     let found = this.getTaskById(id);
    //     this.tasks.map((task, index) => {
    //         if(task.id == found.id){
    //             this.tasks.splice(index, 1);
    //         }
    //     });
    //     return `Task deleted. Id: ${id}`
    // }

    // updateTaskStatus(id: string, status: TaskStatus): Task{
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }
}
