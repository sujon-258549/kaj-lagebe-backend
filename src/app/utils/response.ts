import type { Response } from "express";

const sendResponse = <T>(
  res: Response,
  jsonData: {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T | null | undefined;
    meta?: { page: number; limit: number; total: number; totalPage?: number } | undefined;
  }
) => {
  const meta = jsonData.meta
    ? {
        ...jsonData.meta,
        totalPage: Math.ceil(jsonData.meta.total / jsonData.meta.limit),
      }
    : undefined;

  res.status(jsonData.statusCode).json({
    success: jsonData.success,
    message: jsonData.message,
    data: jsonData.data ?? undefined,
    meta: meta,
  });
};

export default sendResponse;