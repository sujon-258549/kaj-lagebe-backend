import type { Prisma } from "@prisma/client";
import prisma from "../../utils/prismaClient.js";

/**
 * Single Upsert: Create or update a site setting by key
 */
const upsertSetting = async (payload: any, userId?: string) => {
  const { key, ...data } = payload;

  if (userId) {
    data.updatedById = userId;
  }

  // Smart logic: If type is 'image' and value is a string, treat value as imageId
  if (data.type === "image" && typeof data.value === "string") {
    data.imageId = data.value;
  }

  // Get existing one for history
  const existing = await prisma.siteSetting.findUnique({ where: { key } });

  const result = await prisma.siteSetting.upsert({
    where: { key },
    update: data,
    create: { key, ...data },
    include: { image: true },
  });

  // Create history record
  await prisma.siteSettingHistory.create({
    data: {
      siteSettingId: result.id,
      oldValue: (existing?.value as any),
      newValue: (result.value as any),
      updatedById: userId ?? null,
    },
  });

  return {
    ...result,
    image: result.image?.url || null,
    url: result.image?.url || null,
  };
};

/**
 * Bulk Upsert: Create or update multiple settings at once
 */
const bulkUpsertSettings = async (settings: any[], userId?: string) => {
  const results = await Promise.all(
    settings.map(async (setting) => {
      const { key, ...data } = setting;

      if (userId) {
        data.updatedById = userId;
      }
      
      // Smart logic for image handling
      if (data.type === "image" && typeof data.value === "string") {
        data.imageId = data.value;
      }

      // Get existing one for history
      const existing = await prisma.siteSetting.findUnique({ where: { key } });

      const result = await prisma.siteSetting.upsert({
        where: { key },
        update: data,
        create: { key, ...data },
        include: { image: true },
      });

      // Create history record
      await prisma.siteSettingHistory.create({
        data: {
          siteSettingId: result.id,
          oldValue: (existing?.value as any),
          newValue: (result.value as any),
          updatedById: userId ?? null,
        },
      });

      return {
        ...result,
        image: result.image?.url || null,
        url: result.image?.url || null,
      };
    })
  );
  return results;
};

/**
 * Get all settings grouped by their category
 */
const getSettingsByGroup = async (group: string) => {
  const settings = await prisma.siteSetting.findMany({
    where: { group, isActive: true },
    include: { image: true },
  });

  return settings.map((curr: any) => ({
    ...curr,
    image: curr.image?.url || null,
    url: curr.image?.url || null,
  }));
};

/**
 * Get all settings as a key-value object for easy frontend usage
 */
const getSettingsMap = async (group?: string) => {
  const where: any = { isActive: true };
  if (group) where.group = group;

  const settings = await prisma.siteSetting.findMany({ 
    where,
    include: { image: true }
  });
  
  return settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = {
      ...curr,
      image: curr.image?.url || null,
      url: curr.image?.url || null,
      imageId: curr.imageId,
    };
    return acc;
  }, {});
};

/**
 * Delete single setting
 */
const deleteSetting = async (key: string) => {
  return await prisma.siteSetting.delete({
    where: { key },
  });
};

/**
 * Bulk Delete settings by keys
 */
const bulkDeleteSettings = async (keys: string[]) => {
  return await prisma.siteSetting.deleteMany({
    where: {
      key: { in: keys },
    },
  });
};

/**
 * Get all settings with pagination
 */
const getAllSettings = async (query: any) => {
  const { group, type, isActive, searchTerm } = query;
  
  const where: any = {};
  if (group) where.group = group;
  if (type) where.type = type;
  if (isActive !== undefined) where.isActive = isActive === 'true';
  
  if (searchTerm) {
    where.OR = [
      { key: { contains: searchTerm, mode: 'insensitive' } },
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  const settings = await prisma.siteSetting.findMany({
    where,
    include: { 
      image: true, 
      updatedBy: {
        select: {
          id: true,
          email: true,
          profile: true,
        }
      },
      histories: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          updatedBy: {
            select: {
              id: true,
              email: true,
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return settings.map((curr: any) => ({
    ...curr,
    image: curr.image?.url || null,
    url: curr.image?.url || null,
  }));
};

export const SiteSettingService = {
  upsertSetting,
  bulkUpsertSettings,
  getSettingsByGroup,
  getSettingsMap,
  deleteSetting,
  bulkDeleteSettings,
  getAllSettings,
};
