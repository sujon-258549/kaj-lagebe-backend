import prisma from "../../../utils/prismaClient.ts";

const onlineUsers = async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const [byHeartbeat, recentSessions] = await Promise.all([
    prisma.user.count({
      where: {
        OR: [
          { isOnline: true },
          { lastActive: { gte: fiveMinutesAgo } },
        ],
        isDeleted: false,
      },
    }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: fiveMinutesAgo }, isBot: false },
      distinct: ["sessionId"],
      select: { sessionId: true },
    }),
  ]);

  return {
    onlineUsers: byHeartbeat,
    liveSessions: recentSessions.length,
  };
};

const liveActivityFeed = async (limit = 15) => {
  const [recentUsers, recentApps, recentContacts] = await Promise.all([
    prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        email: true,
        createdAt: true,
        profile: { select: { name: true, photo: true } },
      },
    }),
    prisma.application.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        applyStatus: true,
        job: { select: { title: true } },
        user: {
          select: {
            email: true,
            profile: { select: { name: true } },
          },
        },
      },
    }),
    prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        firstName: true,
        subject: true,
        createdAt: true,
      },
    }),
  ]);

  type FeedItem = {
    type: "signup" | "application" | "contact";
    id: string;
    label: string;
    detail: string;
    createdAt: Date;
  };

  const feed: FeedItem[] = [
    ...recentUsers.map((u) => ({
      type: "signup" as const,
      id: u.id,
      label: `${u.profile?.name || u.email} signed up`,
      detail: u.email,
      createdAt: u.createdAt,
    })),
    ...recentApps.map((a) => ({
      type: "application" as const,
      id: a.id,
      label: `${a.user.profile?.name || a.user.email} applied to ${a.job?.title || "a job"}`,
      detail: a.applyStatus,
      createdAt: a.createdAt,
    })),
    ...recentContacts.map((c) => ({
      type: "contact" as const,
      id: c.id,
      label: `${c.firstName || "Someone"} sent a message`,
      detail: c.subject ?? "",
      createdAt: c.createdAt,
    })),
  ];

  return feed
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};

export const RealtimeDashboardServices = {
  onlineUsers,
  liveActivityFeed,
};
