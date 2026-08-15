import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEnquiryDto } from "./dto/create-enquiry.dto";

@Injectable()
export class EnquiriesService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreateEnquiryDto) {
    return this.prisma.enquiry.create({ data: { ...dto, email: dto.email.toLowerCase(), source: "website" }, select: { id: true, status: true, createdAt: true } });
  }
  findAll() { return this.prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { id:true,name:true,email:true,phone:true,projectType:true,budgetRange:true,message:true,status:true,createdAt:true,updatedAt:true } }); }
}
