import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();
const ROLES = ["OWNER","MANAGING_DIRECTOR","OPERATIONS_MANAGER","PROJECT_MANAGER","SITE_ENGINEER","ARCHITECT","QUANTITY_SURVEYOR","PROCUREMENT_OFFICER","ACCOUNTANT","HR","STORE_MANAGER","SAFETY_OFFICER","EQUIPMENT_MANAGER","DRIVER","RECEPTIONIST","CLIENT"];
const PERMISSIONS = ["projects:read","projects:write","employees:read","employees:write","clients:read","clients:write","invoices:read","invoices:write","finance:read","finance:write","hr:read","hr:write","settings:write","audit:read"];
const ROLE_PERMISSIONS: Record<string,string[]> = { OWNER: PERMISSIONS, MANAGING_DIRECTOR: PERMISSIONS, OPERATIONS_MANAGER:["projects:read","projects:write","employees:read","clients:read"], PROJECT_MANAGER:["projects:read","projects:write","employees:read"], SITE_ENGINEER:["projects:read"], ARCHITECT:["projects:read"], QUANTITY_SURVEYOR:["projects:read","finance:read"], PROCUREMENT_OFFICER:["projects:read","finance:read"], ACCOUNTANT:["finance:read","finance:write","invoices:read","invoices:write"], HR:["hr:read","hr:write","employees:read","employees:write"], STORE_MANAGER:["projects:read"], SAFETY_OFFICER:["projects:read"], EQUIPMENT_MANAGER:["projects:read"], DRIVER:["projects:read"], RECEPTIONIST:["clients:read"], CLIENT:["projects:read","invoices:read"] };

async function main() {
  for (const key of PERMISSIONS) await prisma.permission.upsert({ where:{key}, update:{}, create:{key,label:key} });
  for (const roleName of ROLES) await prisma.role.upsert({ where:{name:roleName}, update:{ permissions:{ set:[], connect: (ROLE_PERMISSIONS[roleName] ?? []).map(key=>({key})) } }, create:{name:roleName, permissions:{connect:(ROLE_PERMISSIONS[roleName] ?? []).map(key=>({key}))}} });
  const ownerRole = await prisma.role.findUniqueOrThrow({ where:{name:"OWNER"} });
  const clientRole = await prisma.role.findUniqueOrThrow({ where:{name:"CLIENT"} });
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
  await prisma.user.upsert({ where:{email:"owner@bubble.example"}, update:{roleId:ownerRole.id}, create:{email:"owner@bubble.example",passwordHash,firstName:"BUBBLE",lastName:"Owner",roleId:ownerRole.id} });
  const clientUser = await prisma.user.upsert({ where:{email:"client@bubble.example"}, update:{roleId:clientRole.id}, create:{email:"client@bubble.example",passwordHash,firstName:"Demo",lastName:"Client",roleId:clientRole.id} });
  const client = await prisma.client.upsert({ where:{email:"client@bubble.example"}, update:{userId:clientUser.id}, create:{userId:clientUser.id,companyName:"Meridian Development Group",contactName:"Demo Client",email:"client@bubble.example",phone:"+254 700 000 000",address:"Nairobi, Kenya"} });
  const project = await prisma.project.upsert({ where:{code:"BBL-001"}, update:{clientId:client.id}, create:{code:"BBL-001",name:"Meridian Tower",description:"Flagship commercial development for the BUBBLE portfolio demo.",status:"IN_PROGRESS",clientId:client.id,budget:480000000,startDate:new Date("2026-01-15"),endDate:new Date("2027-06-30"),address:"Nairobi CBD, Kenya",latitude:-1.2864,longitude:36.8172} });
  const milestones = [
    ["Design coordination", "2026-03-15", true],
    ["Foundation package", "2026-05-20", true],
    ["Structural frame", "2026-10-30", false],
    ["MEP coordination", "2027-02-15", false],
    ["Handover", "2027-06-30", false],
  ] as const;
  for (const [title,dueDate,completed] of milestones) await prisma.milestone.upsert({ where:{id:`seed-${title.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`}, update:{completed}, create:{id:`seed-${title.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,projectId:project.id,title,dueDate:new Date(dueDate),completed} });
  const milestone = await prisma.milestone.findFirstOrThrow({where:{projectId:project.id,title:"Structural frame"}});
  const taskSeed = [["Coordinate structural drawings","DONE"],["Pour level 8 slab","IN_PROGRESS"],["Review MEP clashes","TODO"],["Issue weekly client report","DONE"]] as const;
  for (const [title,status] of taskSeed) await prisma.task.upsert({where:{id:`seed-task-${title.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`},update:{status},create:{id:`seed-task-${title.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,projectId:project.id,milestoneId:milestone.id,title,status,dueDate:new Date("2026-10-15")}});
  console.log("Seed complete.");
  console.log("Development owner: owner@bubble.example / ChangeMe123!");
  console.log("Development client: client@bubble.example / ChangeMe123!");
}
main().catch(error=>{console.error(error);process.exit(1)}).finally(()=>prisma.$disconnect());
