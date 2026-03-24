import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddProjectImageDto } from './dto/add-project-image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    createProject(@Body() createProjectDto: CreateProjectDto) {
        return this.projectService.createProject(createProjectDto);
    }

    @Get()
    getAllProjects(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number,
    ) {
        return this.projectService.getAllProjects(page, limit);
    }

    @Get('public/slug/:slug')
    getProjectBySlugPublic(@Param('slug') slug: string) {
        return this.projectService.getProjectBySlug(slug);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateProject(
        @Param('id') id: string,
        @Body() updateProjectDto: UpdateProjectDto,
    ) {
        return this.projectService.updateProject(id, updateProjectDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteProject(@Param('id') id: string) {
        return this.projectService.deleteProject(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':projectId/images')
    addProjectImage(
        @Param('projectId') projectId: string,
        @Body() dto: AddProjectImageDto,
    ) {
        return this.projectService.addProjectImage(
            projectId,
            dto.imageUrl,
            dto.caption,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete('images/:imageId')
    deleteProjectImage(@Param('imageId') imageId: string) {
        return this.projectService.deleteProjectImage(imageId);
    }
}
