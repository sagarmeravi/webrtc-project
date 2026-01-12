import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/socketProvider";

const Room = () => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const socket = useSocket();

  const onClickUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
  }, []);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("user:joined", handleUserJoined);
    return () => {
      socket.off("user:joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);

  return (
    <div>
      <h1>Room Page</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>

      {remoteSocketId && <button onClick={onClickUser}>CALL</button>}

      {myStream && (
        <video
          height="300"
          width="600"
          autoPlay
          muted
          ref={(video) => {
            if (video) video.srcObject = myStream;
          }}
        />
      )}
    </div>
  );
};

export default Room;
