import { Server } from "http";
import { Server as SocketIo } from "socket.io";
import { IUser } from "../../entities/User";

interface CallPayload {
  from: string;
  offer: RTCSessionDescriptionInit;
  callType: "audio" | "video";
}
interface IceCandidatePayload {
  candidate: RTCIceCandidateInit;
  receiverId: string;
}

const userSockets: Map<string, { socketId: string; userDetails: IUser }> =
  new Map();
const messageNotificationCounts = new Map();
const reactionEmojis: Record<string, string> = {
  Like: "👍",
  Happy: "😄",
  Sad: "😢",
  Angry: "😡",
  Love: "😍",
};

export const setupSocket = (server: Server) => {
  const io = new SocketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("login", (userDetails) => {
      const { userId } = userDetails;
      userSockets.set(userId, { socketId: socket.id, userDetails });
    });

    socket.on("reaction", ({ userId, postAuthorId, reactionType }) => {
      const postAuthorSocket = userSockets.get(postAuthorId);
      const userDetails = userSockets.get(userId)?.userDetails;

      if (postAuthorSocket) {
        const emoji = reactionEmojis[reactionType.toString()] || "";

        io.to(postAuthorSocket.socketId).emit("recive_Reaction", {
          message: ` ${
            userDetails?.username || userId
          } reacted to your post with ${emoji}`,
          reactionType: emoji,
          user: userDetails,
        });
      } else {
        console.log(`Post author ${postAuthorId} is not currently connected.`);
      }
    });

    socket.on("follow", ({ followerId, followedId }) => {
      const followedSocket = userSockets.get(followedId);
      const followerDetails = userSockets.get(followerId)?.userDetails;

      if (followedSocket) {
        io.to(followedSocket.socketId).emit("recive_Reaction", {
          message: `${
            followerDetails?.username || followerId
          } has Requested to Follow You!`,
          follower: followerDetails,
        });
        console.log(
          `Notification sent to ${followedId} that ${followerId} followed them.`
        );
      } else {
        console.log(`User ${followedId} is not currently connected.`);
      }
    });

    socket.on("send_message", ({ message, receiverId }) => {
      const receiverSocket = userSockets.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit("receive_message", message);
      } else {
        console.log(
          `Notification sent to ${receiverId} that ${messageNotificationCounts} followed them.`
        );
      }
    });

socket.on("typing", ({ receiverId }) => {
  const receiverSocket = userSockets.get(receiverId); 

  if (receiverSocket) {
    console.log(`User ${receiverId} is typing...`);
    io.to(receiverSocket.socketId).emit("typing-status", {
      isTyping: true,
      receiverId,
    });
  } else {
    console.log(`No socket found for receiverId: ${receiverId}`);
  }
});

socket.on("stop-typing", ({ receiverId }) => {
  const receiverSocket = userSockets.get(receiverId); 

  if (receiverSocket) {
    console.log(`User ${receiverId} stopped typing.`);
    io.to(receiverSocket.socketId).emit("typing-status", {
      isTyping: false,
      receiverId,
    });
  } else {
    console.log(`No socket found for receiverId: ${receiverId}`);
  }
});

  

    socket.on("call-user", ({ receiverId, offer, callType }) => {
      const receiverSocket = userSockets.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit("receive-call", {
          from: receiverId,
          offer,
          callType,
        });
      } else {
        console.log(`Receiver ${receiverId} is not connected`);
      }
    });
    socket.on("answer-call", ({ from, answer, callType }) => {
      if (!answer) {
        console.error("Error: Missing answer in 'answer-call' event.");
        return;
      }

      socket.to(from).emit("call-answered", { answer });
    });

    socket.on(
      "ice-candidate",
      ({ receiverId, candidate }: IceCandidatePayload) => {
        const receiverSocket = userSockets.get(receiverId);
        if (receiverSocket && candidate) {
          io.to(receiverSocket.socketId).emit("ice-candidate", { candidate });
        }
      }
    );

    socket.on("end-callactivate", ({ receiverId }) => {
     
      const receiverSocket = userSockets.get(receiverId); 
      
      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit("call-ended");
        console.log("end called", receiverId);
      }
    });

    socket.on("disconnect", () => {
      userSockets.forEach((value, key) => {
        if (value.socketId === socket.id) {
          userSockets.delete(key);
          console.log(
            `User ${key} disconnected and removed from socket mapping`
          );
        }
      });
    });
  });

  return io;
};
