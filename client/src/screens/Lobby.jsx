import { useCallback, useState, useEffect } from "react";
import { useSocket } from "../context/socketProvider";
import { useNavigate } from "react-router";
export default function Lobby() {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();
  console.log(socket);
  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handlJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handlJoinRoom);
    return () => {
      socket.off("room:join", handlJoinRoom);
    };
  }, [socket]);

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">email:</label>
        <input
          type="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br></br>
        <label htmlFor="roomNo">Room No:</label>
        <input
          type="text"
          id="roomNo"
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
}
