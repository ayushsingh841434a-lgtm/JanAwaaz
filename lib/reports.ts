import { prisma } from "./db";

/** Atomically allocate the next JA- public report ID. */
export async function nextPublicId(): Promise<string> {
  const setting = await prisma.$transaction(async (tx) => {
    const s = await tx.setting.findUnique({ where: { key: "report_counter" } });
    const next = (s ? parseInt(s.value, 10) : 10000) + 1;
    await tx.setting.upsert({
      where: { key: "report_counter" },
      update: { value: String(next) },
      create: { key: "report_counter", value: String(next) },
    });
    return next;
  });
  return `JA-${setting}`;
}

/** Append a status change + notify the reporter. */
export async function changeReportStatus(
  reportId: string,
  toStatus: "REPORTED" | "AUTHORITY_IDENTIFIED" | "SUBMITTED" | "ACKNOWLEDGED" | "UNDER_REVIEW" | "ACTION_TAKEN" | "RESOLVED" | "REJECTED",
  opts?: { note?: string; actorId?: string }
) {
  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) throw new Error("Report not found");

  await prisma.$transaction([
    prisma.statusHistory.create({
      data: {
        reportId,
        fromStatus: report.status,
        toStatus,
        note: opts?.note,
        actorId: opts?.actorId,
      },
    }),
    prisma.report.update({ where: { id: reportId }, data: { status: toStatus } }),
    prisma.notification.create({
      data: {
        userId: report.userId,
        type: "STATUS_CHANGE",
        title: "Complaint status updated",
        body: `Your report ${report.publicId} moved to "${toStatus}". Track it for details.`,
        link: `/track/${report.publicId}`,
      },
    }),
  ]);

  return prisma.report.findUnique({ where: { id: reportId } });
}
