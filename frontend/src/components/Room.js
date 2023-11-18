import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer"

function Room({ leaveRoomCallback }) {
    const [state, setState] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
        showSettings: false,
        spotifyAuthenticated: false,
        song: {}
    });

    const { roomCode } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getRoomDetails();
        getCurrentSong();
    }, []);
    useEffect(() => {
        if (state.isHost) {
            AuthenticateSpotify();
        }
    }, [state.isHost]);
    useEffect(() => {
        const interval = setInterval(getCurrentSong, 1000);
        return () => clearInterval(interval); // This is the cleanup function
    }, []);
    

    const getRoomDetails = () => {
        fetch('/api/get-room?code=' + roomCode)
            .then((response) => {
                if (!response.ok) {
                    leaveRoomCallback();
                    navigate("/");
                }
                return response.json();
            })
            .then((data) => {
                setState(prevState => ({
                    ...prevState,
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                }));
                if (data.is_host) {
                    AuthenticateSpotify();
                }
            });
    }

    const AuthenticateSpotify = () => {
        console.log("Authenticating with Spotify...")
        fetch("/spotify/is-authenticated")
            .then((response) => response.json())
            .then((data) => {
                setState(prevState => ({
                    ...prevState,
                    spotifyAuthenticated: data.status
                }));
                if (!data.status) {
                    fetch('/spotify/get-auth-url')
                        .then((response) => response.json())
                        .then((data) => {
                            window.open(data.url, "_self");
                        });
                }
            });
    };

    const getCurrentSong = () => {
        fetch('/spotify/current-song')
            .then((response) => {
                if (!response.ok) {
                    return null;
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                setState(prevState => ({
                    ...prevState,
                    song: data
                }));
            });
    };

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room", requestOptions)
            .then((response) => {    
                leaveRoomCallback();
                navigate("/");
            });
    }

    const updateShowSettings = (value) => {
        setState(prevState => ({
            ...prevState,
            showSettings: value,
        }));
    };
    
    const renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center" style={{ marginTop: '20px' }}>  {/* Adjusted margin here */}
                <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    const renderSettings = () => {
        return (
          <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage 
                    AuthenticateSpotify={AuthenticateSpotify}
                    update={true} 
                    defaultVotes={state.votesToSkip}  // Pass current value
                    defaultGuestCanPause={state.guestCanPause}  // Pass current value
                    roomCode={roomCode}
                    updateCallBack={getRoomDetails} 
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)}>
                    Close
                </Button>
            </Grid>
          </Grid>
        );
    }

    if (state.showSettings) {
        return renderSettings();
    }
    return (
        <Grid container spacing={1} style={{ minHeight: '100vh' }} direction="column" justify="center" alignItems="center">
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <MusicPlayer {...state.song}/>
            {state.isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center" style={{ marginTop: state.isHost ? '0' : '20px' }}>
                <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );    
}

export default Room;