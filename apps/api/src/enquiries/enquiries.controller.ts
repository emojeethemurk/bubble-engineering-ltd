import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { EnquiriesService } from "./enquiries.service";
import { CreateEnquiryDto } from "./dto/create-enquiry.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { Permissions } from "../auth/decorators/permissions.decorator";

@Controller("enquiries")
export class EnquiriesController {
  constructor(private readonly service: EnquiriesService) {}
  @Post()
  create(@Body() dto: CreateEnquiryDto) { return this.service.create(dto); }
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  @Permissions("projects:read")
  findAll() { return this.service.findAll(); }
}
