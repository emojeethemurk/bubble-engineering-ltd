import { Test } from "@nestjs/testing";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { PrismaService } from "../prisma/prisma.service";

describe("ProjectsService", () => {
  let service: ProjectsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      project: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      task: {
        count: jest.fn(),
      },
      $transaction: jest.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [ProjectsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(ProjectsService);
  });

  it("throws NotFoundException when project does not exist", async () => {
    prisma.project.findUnique.mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(NotFoundException);
  });

  it("computes progress as percentage of DONE tasks", async () => {
    prisma.project.findUnique.mockResolvedValue({
      id: "p1",
      client: {},
      members: [],
      milestones: [],
      tasks: [],
      documents: [],
    });
    prisma.task.count
      .mockResolvedValueOnce(10) // total
      .mockResolvedValueOnce(3); // done

    const result = await service.findOne("p1");

    expect(result.progress).toBe(30);
  });

  it("returns 0 progress when a project has no tasks", async () => {
    prisma.project.findUnique.mockResolvedValue({
      id: "p2",
      client: {},
      members: [],
      milestones: [],
      tasks: [],
      documents: [],
    });
    prisma.task.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);

    const result = await service.findOne("p2");

    expect(result.progress).toBe(0);
  });

  it("rejects creating a project with a duplicate code", async () => {
    prisma.project.findUnique.mockResolvedValue({ id: "existing" });

    await expect(
      service.create({
        code: "DUPLICATE",
        name: "Test Project",
        clientId: "client-1",
        budget: 1000,
        startDate: "2026-01-01",
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
