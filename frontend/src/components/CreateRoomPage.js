import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const CreateRoomPage = ({
  defaultVotes = 2,
  defaultGuestCanPause = true,
  update = false,
  roomCode = null,
  updateCallBack = () => {},
  }) => {

  const navigate = useNavigate();

  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
  const [guestCanPause, setGuestCanPause] = useState(defaultGuestCanPause);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setVotesToSkip(defaultVotes);
    setGuestCanPause(defaultGuestCanPause);
  }, [defaultVotes, defaultGuestCanPause]);

  const handleVotesChange = (e) => {
      setVotesToSkip(e.target.value);
  }

  const handleGuestCanPauseChange = (e) => {
      setGuestCanPause(e.target.value === "true" ? true : false);
  }

  const handleRoomButtonPressed = () => {
      const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              votes_to_skip: votesToSkip,
              guest_can_pause: guestCanPause,
          }),
      };
      fetch("/api/create-room", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            navigate('/room/' + data.code);
            //if (data.is_host) {
              //props.AuthenticateSpotify();
            //}
        });
  }

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            votes_to_skip: votesToSkip,
            guest_can_pause: guestCanPause,
            code: roomCode
        }),
    };
    fetch("/api/update-room", requestOptions)
        .then((response) => {
          if (response.ok) {
            setSuccessMessage("Room updated successfully!");
          } else {
            setErrorMessage("Error updating room...");
          }
        updateCallBack();
      })
  }   

  const renderCreateButtons = () => {
    return(
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    )
  }

  const renderUpdateButtons = () => {
    return(
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={handleUpdateButtonPressed}
          >
            Update Room
          </Button>
        </Grid>
      </Grid>
    )
  }

  const title = update ? "Update Room" : "Create a Room";

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
      <Collapse in={errorMessage !== "" || successMessage !== ""}>
        {successMessage != "" ? (
          <Alert severity="success" onClose={() => {setSuccessMessage("")}}>{successMessage}</Alert>
          ): (
          <Alert severity="error" onClose={() => {setErrorMessage("")}}>{errorMessage}</Alert>
        )}
      </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            value={guestCanPause.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChange}
            value={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
}

export default CreateRoomPage;
