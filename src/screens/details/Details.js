import {
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import "./Details.css";
import YouTube from "react-youtube";
import { StarBorder } from "@material-ui/icons";

const Details = (props) => {
  const [genres, setGenres] = useState([]);
  const [details, setDetailed] = useState(Object);
  const [duration, setDuration] = useState();
  const [releaseDate, setReleaseDate] = useState();
  const [rating, setRating] = useState();
  const [storyLine, setStoryLine] = useState();
  const [videoId, setVideoID] = useState();
  const [artists, setArtists] = useState([]);
  const [movieId, setMovieId] = useState();
  const [starRating,setStarRating] = useState(0);

  useEffect(() => {
    async function executeForState() {
      let location = window.location.href;
      let id = location.split("movie/")[1];
      setMovieId(id);
      fetch(`http://localhost:8085/api/v1/movies/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((receivedRes) => {
          setDetailed(receivedRes);
          setGenres((arr) => [...arr, ...receivedRes.genres]);
          setDuration(receivedRes.duration);
          const d = new Date(receivedRes.release_date);
          setReleaseDate(d.toDateString());
          setRating(receivedRes.rating);
          setStoryLine(receivedRes.storyline);
          let videoDetails = receivedRes.trailer_url.split("v=")[1];
          let ampersandPosition = videoDetails.indexOf("&");
          if (ampersandPosition !== -1) {
            videoDetails = videoDetails.substring(0, ampersandPosition);
          }
          setVideoID(videoDetails);
          if (receivedRes.artists != null) {
            setArtists((arr) => [...arr, ...receivedRes.artists]);
          } else {
            let artists = [
              {
                profile_url: "",
                first_name: "No",
                last_name: "Data",
              },
            ];
            setArtists((arr) => [...arr, ...artists]);
          }
        });
    }

    executeForState();
  }, []);

  return (
    <div>
      <Header
        buttonNeeded="Book Show"
        buttonRequest={true}
        getDetails={movieId}
      ></Header>
      <Link to="/">
        <Typography variant="button" className="back-button">
          &lt; Back To Home
        </Typography>
      </Link>
      <div className="Details-Page">
        <div className="first-quadrant">
          <img src={details.poster_url} alt={details.title} />
        </div>
        <div className="second-quadrant">
          <Typography variant="headline" component="h2">
            {details.title}
          </Typography>

          <Typography>
            <b>Genres: </b>
            {genres.map((genre) => (
              <span>{genre},</span>
            ))}
          </Typography>
          <Typography>
            <b>Duration: </b>
            {duration}
          </Typography>
          <Typography>
            <b>Release Date: </b>
            {releaseDate}
          </Typography>
          <Typography>
            <b>Rating :</b>
            {rating}
          </Typography>
          <Typography className="plot-details">
            <b>Plot:</b> (<a href={details.wiki_url}>wiki_url</a>) {storyLine}
          </Typography>
          <div className="youtube-trailer">
            <Typography>
              <b>Trailer:</b>
            </Typography>
            <YouTube videoId={videoId}></YouTube>
          </div>
        </div>
        <div className="third-quadrant">
          <Typography>
            <b>Rate this movie:</b>
          </Typography>
          {new Array(5).fill(5).map((s, i) => (
            <StarBorder style={{color: i<starRating?'yellow':'black'}} key={i} onClick={()=>{setStarRating(i+1)}}/>
          ))}
          
          <Typography className="artist-tag">
            <b>Artists:</b>
          </Typography>
          <GridList cols={2} className="artists-details-grid">
            {artists.map((tile) => (
              <GridListTile key={tile.profile_url}>
                <img src={tile.profile_url} alt={tile.title} />
                <GridListTileBar
                  title={tile.first_name.concat(" ", tile.last_name)}
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      </div>
    </div>
  );
};

export default Details;
