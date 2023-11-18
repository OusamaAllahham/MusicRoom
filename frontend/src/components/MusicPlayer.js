import React, { useState, useEffect } from "react";
import { Grid, Typography, Card, IconButton, LinearProgress, CardContent, CardMedia } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#3C3C3C',
        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        borderRadius: '10px',
        minWidth: 500, // Set the minimum width of the music player card
        '&:hover': {
            boxShadow: '0 16px 32px 0 rgba(0,0,0,0.2)',
        },
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
        flexShrink: 0, // This prevents the cover from shrinking
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        color: '#B0B0B0',
        '& button:hover': {  // Hover pseudo-class for the buttons within controls
            backgroundColor: '#555555',  // Lighter grey for the hover effect
        },
        '& button': {  
            transition: 'background-color 0.1s ease', // Slowing down the transition effect
        },
        '& button:active': {  // Active pseudo-class for the buttons within controls
            backgroundColor: '#6E6E6E',  // Lighter grey for the clicked effect
        },
    },
    playIcon: {
        height: 38,
        width: 38,
        color: '#B0B0B0',
    },
    skipIcon: {
        color: '#B0B0B0',
    },
    progress: {
        height: '10px',
    },
    content: {
        color: '#B0B0B0',
    }
}));

function HomePage(props) {
    const classes = useStyles();
    const [isPlaying, setIsPlaying] = useState(props.is_playing); // Initialize using prop value
    const songProgress = (props.time / props.duration) * 100;

    // Listen to changes in props.is_playing and update local state accordingly
    useEffect(() => {
        setIsPlaying(props.is_playing);
    }, [props.is_playing]);

    const skipSong = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/skip", requestOptions);
    }

    const pauseSong = () => {
        setIsPlaying(false); // Update the state instantly
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/pause", requestOptions);
    }

    const playSong = () => {
        setIsPlaying(true); // Update the state instantly
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/play", requestOptions);
    }

    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        {props.title}
                    </Typography>
                    <Typography variant="subtitle1">
                        <span style={{color: '#B0B0B0'}}>{props.artist}</span> 
                    </Typography>
                </CardContent>
                <div className={classes.controls}>
                    <IconButton aria-label="play/pause" onClick={() => {isPlaying ? pauseSong() : playSong()}}>
                        {isPlaying ? <PauseIcon className={classes.playIcon}/> : <PlayArrowIcon className={classes.playIcon}/>}
                    </IconButton>
                    <IconButton aria-label="next" onClick={() => skipSong()}>
                        <span style={{color: '#B0B0B0'}}>{props.votes} / {props.votes_required}</span> 
                        <SkipNextIcon className={classes.skipIcon} />
                    </IconButton>
                </div>
            </div>
            <CardMedia
                className={classes.cover}
                image={props.image_url}
                title={props.title}
            />
            <LinearProgress className={classes.progress} variant="determinate" value={songProgress} />
        </Card>
    );
}
  
export default HomePage;
