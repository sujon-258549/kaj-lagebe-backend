import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { JwtHelpers } from "./jwtHelpers.js";
import config from "../config/index.js";

let io: Server;

export const socketIO = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust this in production (e.g., config.clientUrl)
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  // Authentication Middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
    
    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    try {
      const decoded = JwtHelpers.verifyToken(
        actualToken,
        config.accessSecret as string,
      ) as any;

      // Attach user info to socket
      socket.data.user = {
        id: decoded?.data?.id,
        email: decoded?.data?.email,
        role: decoded?.data?.role,
      };

      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const user = socket.data.user;
    
    if (user?.id) {
      socket.join(user.id);
      console.log(`📡 [Socket] User joined personal room: ${user.id} (${user.email})`);

      // Update online status in DB
      try {
        const { default: prisma } = await import("./prismaClient.js");
        await prisma.user.update({
          where: { id: user.id },
          data: { isOnline: true, lastActive: new Date() },
        });
        // Notify others if needed (optional)
        io.emit("user-status-change", { userId: user.id, isOnline: true });
      } catch (error) {
        console.error("❌ [Socket] Error updating online status:", error);
      }
    }

    // Role-based rooms
    if (user?.role) {
      socket.join(`role:${user.role}`);
      console.log(`📡 [Socket] User joined role room: role:${user.role} (${user.email})`);
    }

    socket.on("disconnect", async (reason) => {
      console.log(`📡 [Socket] User disconnected: ${user?.email}. Reason: ${reason}`);
      
      if (user?.id) {
        try {
          const { default: prisma } = await import("./prismaClient.js");
          await prisma.user.update({
            where: { id: user.id },
            data: { isOnline: false, lastActive: new Date() },
          });
          io.emit("user-status-change", { userId: user.id, isOnline: false });
        } catch (error) {
          console.error("❌ [Socket] Error updating offline status:", error);
        }
      }
    });

    socket.on("error", (error) => {
      console.error(`📡 [Socket] Error for ${user?.email}:`, error);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

/**
 * Utility to emit to a specific user
 */
export const emitToUser = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(userId).emit(event, data);
  }
};

/**
 * Utility to emit to all users with a specific role
 */
export const emitToRole = (role: string, event: string, data: any) => {
  if (io) {
    io.to(`role:${role}`).emit(event, data);
  }
};

