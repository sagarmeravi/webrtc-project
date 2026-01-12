import { useCallback } from "react";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
export default function Lobby() {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  console.log(socket);
  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();
    socket.emit("room:join", { email, room });
    console.log({ email, room });
  });
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
