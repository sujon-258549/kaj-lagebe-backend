import prisma from "../../../utils/prismaClient.ts";

interface TimePoint {
  date: string;
  applications?: number;
  jobs?: number;
  applicants?: number;
}

interface DashboardOverview {
  role: string;
  myApplicationsCount?: number;
  pendingApplications?: number;
  acceptedApplications?: number;
  rejectedApplications?: number;
  reviewingApplications?: number;
  myJobsCount?: number;
  myActiveJobsCount?: number;
  totalApplicantsReceived?: number;
  pendingApplicantsToReview?: number;
  myBlogsCount?: number;
  myPublishedBlogsCount?: number;
  myBlogCommentsCount?: number;
  totalUsersCount?: number;
  totalJobsCount?: number;
  totalApplicationsCount?: number;
  totalBlogsCount?: number;
  recentJobs?: any[];
  recentApplications?: any[];
  recentApplicationsReceived?: any[];
  recentBlogs?: any[];
  recentNotifications?: any[];
  timeseries?: TimePoint[];
  applicationStatusBreakdown?: { status: string; count: number }[];
  topJobsByApplicants?: {
    id: string;
    title: string;
    applicantsCount: number;
  }[];
}

const formatDateKey = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const buildLast14Days = () => {
  const days: { date: string; label: string }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      date: formatDateKey(d),
      label: d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    });
  }
  return days;
};

const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN"]);
const WORKER_ROLES = new Set(["WORKER"]);
const USER_ROLES = new Set(["USER"]);

const getOverview = async (
  userId: string,
  role: string,
): Promise<DashboardOverview> => {
  const upperRole = (role || "").toUpperCase();
  const isAdmin = ADMIN_ROLES.has(upperRole);
  const isWorker = WORKER_ROLES.has(upperRole);
  const isUser = USER_ROLES.has(upperRole);

  const result: DashboardOverview = { role: upperRole };

  result.recentNotifications = await prisma.notification.findMany({
    where: { userId, isDeleted: false },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  if (isWorker || isAdmin) {
    const [
      myApplicationsCount,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      reviewingApplications,
      recentApplications,
    ] = await Promise.all([
      prisma.application.count({ where: { userId, isDeleted: false } }),
      prisma.application.count({
        where: { userId, applyStatus: "PENDING", isDeleted: false },
      }),
      prisma.application.count({
        where: { userId, applyStatus: "ACCEPTED", isDeleted: false },
      }),
      prisma.application.count({
        where: { userId, applyStatus: "REJECTED", isDeleted: false },
      }),
      prisma.application.count({
        where: { userId, applyStatus: "REVIEWING", isDeleted: false },
      }),
      prisma.application.findMany({
        where: { userId, isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          job: { select: { id: true, title: true, company: true } },
        },
      }),
    ]);
    result.myApplicationsCount = myApplicationsCount;
    result.pendingApplications = pendingApplications;
    result.acceptedApplications = acceptedApplications;
    result.rejectedApplications = rejectedApplications;
    result.reviewingApplications = reviewingApplications;
    result.recentApplications = recentApplications;
  }

  if (isUser || isAdmin) {
    const [
      myJobsCount,
      myActiveJobsCount,
      totalApplicantsReceived,
      pendingApplicantsToReview,
      recentJobs,
      recentApplicationsReceived,
    ] = await Promise.all([
      prisma.job.count({ where: { authorId: userId, isDeleted: false } }),
      prisma.job.count({
        where: { authorId: userId, isPublished: true, isDeleted: false },
      }),
      prisma.application.count({
        where: { job: { authorId: userId }, isDeleted: false },
      }),
      prisma.application.count({
        where: {
          job: { authorId: userId },
          applyStatus: "PENDING",
          isDeleted: false,
        },
      }),
      prisma.job.findMany({
        where: { authorId: userId, isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          isPublished: true,
          applicantsCount: true,
          createdAt: true,
        },
      }),
      prisma.application.findMany({
        where: { job: { authorId: userId }, isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          job: { select: { id: true, title: true } },
          user: {
            select: {
              id: true,
              email: true,
              profile: { select: { name: true, photo: true } },
            },
          },
        },
      }),
    ]);
    result.myJobsCount = myJobsCount;
    result.myActiveJobsCount = myActiveJobsCount;
    result.totalApplicantsReceived = totalApplicantsReceived;
    result.pendingApplicantsToReview = pendingApplicantsToReview;
    result.recentJobs = recentJobs;
    result.recentApplicationsReceived = recentApplicationsReceived;
  }

  const [
    myBlogsCount,
    myPublishedBlogsCount,
    myBlogCommentsCount,
    recentBlogs,
  ] = await Promise.all([
    prisma.blog.count({ where: { authorId: userId } }),
    prisma.blog.count({ where: { authorId: userId, isPublished: true } }),
    prisma.blogComment.count({
      where: { blog: { authorId: userId }, isDeleted: false },
    }),
    prisma.blog.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        isPublished: true,
        createdAt: true,
        _count: { select: { comments: true } },
      },
    }),
  ]);
  result.myBlogsCount = myBlogsCount;
  result.myPublishedBlogsCount = myPublishedBlogsCount;
  result.myBlogCommentsCount = myBlogCommentsCount;
  result.recentBlogs = recentBlogs;

  const days = buildLast14Days();
  const fromDate = new Date();
  fromDate.setHours(0, 0, 0, 0);
  fromDate.setDate(fromDate.getDate() - 13);

  const bucket: Record<string, TimePoint> = {};
  for (const d of days) {
    bucket[d.date] = {
      date: d.label,
      applications: 0,
      jobs: 0,
      applicants: 0,
    };
  }

  if (isWorker || isAdmin) {
    const myApps = await prisma.application.findMany({
      where: { userId, isDeleted: false, createdAt: { gte: fromDate } },
      select: { createdAt: true },
    });
    for (const a of myApps) {
      const key = formatDateKey(new Date(a.createdAt));
      if (bucket[key]) bucket[key].applications! += 1;
    }
  }

  if (isUser || isAdmin) {
    const [myJobs, recvApps] = await Promise.all([
      prisma.job.findMany({
        where: {
          authorId: userId,
          isDeleted: false,
          createdAt: { gte: fromDate },
        },
        select: { createdAt: true },
      }),
      prisma.application.findMany({
        where: {
          job: { authorId: userId },
          isDeleted: false,
          createdAt: { gte: fromDate },
        },
        select: { createdAt: true },
      }),
    ]);
    for (const j of myJobs) {
      const key = formatDateKey(new Date(j.createdAt));
      if (bucket[key]) bucket[key].jobs! += 1;
    }
    for (const a of recvApps) {
      const key = formatDateKey(new Date(a.createdAt));
      if (bucket[key]) bucket[key].applicants! += 1;
    }
  }

  result.timeseries = days.map((d) => bucket[d.date]!);

  if (isWorker || isAdmin) {
    result.applicationStatusBreakdown = [
      { status: "PENDING", count: result.pendingApplications ?? 0 },
      { status: "REVIEWING", count: result.reviewingApplications ?? 0 },
      { status: "ACCEPTED", count: result.acceptedApplications ?? 0 },
      { status: "REJECTED", count: result.rejectedApplications ?? 0 },
    ];
  }

  if (isUser || isAdmin) {
    const top = await prisma.job.findMany({
      where: { authorId: userId, isDeleted: false, applicantsCount: { gt: 0 } },
      orderBy: { applicantsCount: "desc" },
      take: 5,
      select: { id: true, title: true, applicantsCount: true },
    });
    result.topJobsByApplicants = top.map((j) => ({
      id: j.id,
      title: j.title,
      applicantsCount: j.applicantsCount ?? 0,
    }));
  }

  if (isAdmin) {
    const [
      totalUsersCount,
      totalJobsCount,
      totalApplicationsCount,
      totalBlogsCount,
    ] = await Promise.all([
      prisma.user.count({ where: { isDeleted: false } }),
      prisma.job.count({ where: { isDeleted: false } }),
      prisma.application.count({ where: { isDeleted: false } }),
      prisma.blog.count(),
    ]);
    result.totalUsersCount = totalUsersCount;
    result.totalJobsCount = totalJobsCount;
    result.totalApplicationsCount = totalApplicationsCount;
    result.totalBlogsCount = totalBlogsCount;
  }

  return result;
};

export const OverviewDashboardServices = {
  getOverview,
};
