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

const userSockets: Map<string, { socketId: string; userDetails: IUser }> = new Map();

const offers: {
  offererUserName: string;
  offer: RTCSessionDescriptionInit;
  offerIceCandidates: RTCIceCandidateInit[];
  answererUserName: string | null;
  answer: RTCSessionDescriptionInit | null;
  answererIceCandidates: RTCIceCandidateInit[];
}[] = [];
const connectedSockets: { userName: string; socketId: string }[] = [];


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

    const userName = socket.handshake.auth.userName;
    const password = socket.handshake.auth.password;

    if(password !== "x"){
        socket.disconnect(true);
        return;
    }
    connectedSockets.push({
        socketId: socket.id,
        userName
    })
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
      // If the receiver is connected, emit the call offer
      io.to(receiverSocket.socketId).emit("receive-call", {
        from: socket.id,  // Sending the caller's socket ID to the receiver
        offer,
        callType,
      });
      console.log(`Call from ${socket.id} to ${receiverId}`);
    } else {
      console.log(`Receiver ${receiverId} is not connected`);
     
    }
  });
   socket.on("answer-call", ({ from, answer, callType }) => {
    if (!answer) {
      console.error("Error: Missing answer in 'answer-call' event.");
      return;
    }

    // Send the answer to the caller
    socket.to(from).emit("call-answered", { answer });
    console.log(`Call answered by ${socket.id} from ${from}`);
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

    /////////////////////////////////////////////////////////////////////////////////////
     if(offers.length){
        socket.emit('availableOffers',offers);
    }
    
   socket.on("newOffer", (newOffer: RTCSessionDescriptionInit) => {
      const userName = socket.handshake.auth.userName;
      offers.push({
        offererUserName: userName,
        offer: newOffer,
        offerIceCandidates: [],
        answererUserName: null,
        answer: null,
        answererIceCandidates: [],
      });

      socket.broadcast.emit("newOfferAwaiting", offers.slice(-1));
    });

    socket.on('newAnswer', (offerObj, ackFunction) => {
          const userName = socket.handshake.auth.userName;
        console.log(offerObj);
      
        const socketToAnswer = connectedSockets.find(s=>s.userName === offerObj.offererUserName)
        if(!socketToAnswer){
            console.log("No matching socket")
            return;
        }
        //we found the matching socket, so we can emit to it!
        const socketIdToAnswer = socketToAnswer.socketId;
        //we find the offer to update so we can emit it
        const offerToUpdate = offers.find(o=>o.offererUserName === offerObj.offererUserName)
        if(!offerToUpdate){
            console.log("No OfferToUpdate")
            return;
        }
        //send back to the answerer all the iceCandidates we have already collected
        ackFunction(offerToUpdate.offerIceCandidates);
        offerToUpdate.answer = offerObj.answer
        offerToUpdate.answererUserName = userName
        //socket has a .to() which allows emiting to a "room"
        //every socket has it's own room
        socket.to(socketIdToAnswer).emit('answerResponse',offerToUpdate)
    })

socket.on("sendIceCandidateToSignalingServer", iceCandidateObj => {
  const { didIOffer, iceUserName, iceCandidate } = iceCandidateObj;

  if (didIOffer) {
    // This ice is coming from the offerer. Send it to the answerer.
    const offerInOffers = offers.find(o => o.offererUserName === iceUserName);

    if (offerInOffers) {
      offerInOffers.offerIceCandidates.push(iceCandidate);

      // When the answerer answers, all existing ice candidates are sent.
      // Any candidates that come in after the offer has been answered will be passed through.
      if (offerInOffers.answererUserName) {
        // Pass it through to the other socket.
        const socketToSendTo = connectedSockets.find(s => s.userName === offerInOffers.answererUserName);
        if (socketToSendTo) {
          socket.to(socketToSendTo.socketId).emit("receivedIceCandidateFromServer", iceCandidate);
        } else {
          console.log("Ice candidate received but could not find answerer");
        }
      }
    } else {
      console.log(`No offer found for user ${iceUserName}`);
    }
  } else {
    // This ice is coming from the answerer. Send it to the offerer.
    const offerInOffers = offers.find(o => o.answererUserName === iceUserName);

    if (offerInOffers) {
      const socketToSendTo = connectedSockets.find(s => s.userName === offerInOffers.offererUserName);
      if (socketToSendTo) {
        socket.to(socketToSendTo.socketId).emit("receivedIceCandidateFromServer", iceCandidate);
      } else {
        console.log("Ice candidate received but could not find offerer");
      }
    } else {
      console.log(`No offer found for user ${iceUserName}`);
    }
  }
});

    /////////////////////////////////////////////////////////////////////////////////////

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





