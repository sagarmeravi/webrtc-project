import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/socketProvider";
import peer from "../services/peer";
import { Form } from "react-router";
const Room = () => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  cconst[(remoteStream, setRemoteStream)] = useState();
  const socket = useSocket();

  const onClickUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, []);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    console.log(`Incoming Call`, from, offer);
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted", { to: from, ans });
  }, []);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      for (const track of myStream.getStracks()) {
        peer.peer.addTrack(track, myStream);
      }
    },
    [myStream]
  );

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream);
    });
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
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
      {remoteStream && (
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
