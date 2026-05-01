import { Server } from "socket.io";
import { Server as HttpServer } from "http";
export declare const socketIO: (server: HttpServer) => Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const getIO: () => Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
/**
 * Utility to emit to a specific user
 */
export declare const emitToUser: (userId: string, event: string, data: any) => void;
/**
 * Utility to emit to all users with a specific role
 */
export declare const emitToRole: (role: string, event: string, data: any) => void;
//# sourceMappingURL=socket.d.ts.map