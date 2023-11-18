import React, { useState, useEffect } from "react"; // <-- Import useState and useEffect
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import { Button, Grid, Typography, ButtonGroup } from "@material-ui/core";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom"; // <-- Import Navigate instead of RedirectFunction
import Room from "./Room";

function HomePage() {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    // Fetching logic
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        setRoomCode(data.code);
      })
      .catch((error) => {
        console.error("Error fetching room code:", error);
      });
  }, []);

  const RenderHomePage = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" component="h3" style={{color:'white'}}>
            Seemo's Spotify Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to='/join' component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to='/create' component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  }

  const clearRoomCode = () => {
    setRoomCode(null);
  } 

  return (
      <Routes>
          <Route
            path="/"
            element={
              roomCode ? <Navigate to={`/room/${roomCode}`} /> : <RenderHomePage /> // Use Navigate for redirection
            }
          />
          <Route path="/join" element={<RoomJoinPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route 
              path="/room/:roomCode"
              element={<Room leaveRoomCallback={clearRoomCode} />}
          />
      </Routes>
  );
}

export default HomePage;
