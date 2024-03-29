import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";


export class TaskSatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ];

    transform(value: any){
        value = value.toUpperCase();
        if(!this.isStatusValid(value)){
            throw new BadRequestException(`${value} is an invalid status`);
        }
        return value;
    }

    private isStatusValid(status: any){
        let index = this.allowedStatuses.indexOf(status);
        return index !== -1;
    }
}