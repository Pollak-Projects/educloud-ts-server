import {Module} from '@nestjs/common';
import {AdminModuleController} from './admin.module.controller';
import {AdminModuleService} from './admin.module.service';
import { AdminAssignmentModule } from '../assignment/admin.assignment.module';
import { AdminUserModule } from '../user/admin.user.module';

@Module({
    imports: [],
    controllers: [AdminModuleController],
    providers: [AdminModuleService],
})
export class AdminModuleModule {
}