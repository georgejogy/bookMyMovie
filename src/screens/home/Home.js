import {
  Card,
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
  CardContent,
  FormControl,
  Button,
  InputLabel,
  Input,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = (props) => {
  const [responser, setResponser] = useState([]);
  const [movieName, setMovieName] = useState("");
  const [genres, setGenres] = useState([]);
  const [genreList, setGenreList] = useState([]);
  const [artists, setArtists] = useState([]);
  const [artistsNameList, setArtistNameList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [responseAfterFilter, setResponseAfterFilter] = useState([]);
  const [releaseDateStart, setReleaseDateStart] = useState("");
  const [releaseDateEnd, setReleaseDateEnd] = useState("");

  useEffect(() => {
    async function checkTheResponse() {
      fetch("http://localhost:8085/api/v1/movies", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((rawsTheResponse) => rawsTheResponse.json())
        .then((receivedRes) => {
          setResponser((arr) => [...arr, ...receivedRes.movies]);
          setResponseAfterFilter((checker) => [
            ...checker,
            ...receivedRes.movies,
          ]);
        });

      fetch("http://localhost:8085/api/v1/genres", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((rawsTheResponse) => rawsTheResponse.json())
        .then((receivedRes) => {
          const genreNameArray = receivedRes.genres.map((option) => {
            return option.genre;
          });
          setGenres((arr) => [...arr, ...receivedRes.genres]);
          setGenreList((checker) => [...checker, ...genreNameArray]);
        });

      fetch("http://localhost:8085/api/v1/artists", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((rawsTheResponse) => rawsTheResponse.json())
        .then((receivedRes) => {
          const artistNameArray = receivedRes.artists.map((option) => {
            return option.first_name + " " + option.last_name;
          });
          setArtists((arr) => [...arr, ...receivedRes.artists]);
          setArtistNameList((arr) => [...arr, ...artistNameArray]);
        });
    }

    checkTheResponse();
  }, []);

  const handleFilter = async () => {
    console.log(selectedGenre);
    console.log(selected);
    console.log(releaseDateEnd);
    console.log(releaseDateStart);
    console.log(movieName);
    fetch("http://localhost:8085/api/v1/movies", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((rawsTheResponse) => rawsTheResponse.json())
      .then((receivedRes) => {
        if (
          movieName === "" &&
          selectedGenre.length == 0 &&
          selected.length == 0
        ) {
          setResponseAfterFilter([]);
          setResponseAfterFilter((checker) => [
            ...checker,
            ...receivedRes.movies,
          ]);
        } else {
          let movies=receivedRes.movies;
          if (movieName != "") {
            movies = movies.filter((requiredMovie) => {
              if (requiredMovie.title === movieName) return requiredMovie;
            });
          }
          // if(selectedGenre.length>0){
          //   movies=movies.filter((requiredMovie) => {
          //     if(selectedGenre.every(requiredMovie.genres))
          //         return requiredMovie;
          //   })
          // }
          // if(selected.length>0){
          //   movies=movies.filter((requiredMovie) => {
          //     if(selected.every(requiredMovie.genre))
          //       return requiredMovie;
          //   });
          // }

          setResponseAfterFilter([]);
          setResponseAfterFilter((checker) => [...checker, ...movies]);
        }
      });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(
        selected.length === artistsNameList.length ? [] : artistsNameList
      );
      return;
    }
    setSelected(value);
  };

  const handleGenreChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedGenre(selected.length === genreList.length ? [] : genreList);
      return;
    }
    setSelectedGenre(value);
  };

  return (
    <div>
      <div className="home-container">
        <Header></Header>
        <div className="homePageHeader">Upcoming Movies</div>
        <GridList cols={6} className="custom-grid" cellHeight="250">
          {responser.map((tile) => (
            <GridListTile key={tile.poster_url} rows={1}>
              <img src={tile.poster_url} alt={tile.title} />
              <GridListTileBar title={tile.title} />
            </GridListTile>
          ))}
        </GridList>
        <div className="home-details">
          <div className="movie-display">
            <GridList cols={4} className="movie-home-grid" cellHeight="350">
              {responseAfterFilter.map((tile) => (
                <GridListTile key={tile.poster_url} rows={1}>
                  <Link to={`/movie/${tile.id}`}>
                    <img
                      src={tile.poster_url}
                      alt={tile.title}
                      width="100%"
                      height="100%"
                    />
                    <GridListTileBar title={tile.title} />
                  </Link>
                </GridListTile>
              ))}
            </GridList>
          </div>
          <div className="movie-filter">
            <Card sx={{ minWidth: 240 }}>
              <CardContent>
                {/* <MuiThemeProvider theme={theme}> */}
                <Typography variant="subheading" color="primary">
                  {" "}
                  FIND MOVIES BY:
                </Typography>
                {/* </MuiThemeProvider> */}
                <div>
                  <FormControl className="filter-forms">
                    <FormControl>
                      <InputLabel htmlFor="moviesName">Movie Name</InputLabel>
                      <Input
                        id="movieName"
                        value={movieName}
                        onChange={(e) => setMovieName(e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <InputLabel id="multiple-genre">Genre</InputLabel>
                      <Select
                        value={selectedGenre}
                        multiple
                        onChange={handleGenreChange}
                        renderValue={(selectedGenre) =>
                          selectedGenre.join(" , ")
                        }
                      >
                        {genreList.map((option) => (
                          <MenuItem key={option} value={option}>
                            <ListItemIcon>
                              <Checkbox
                                checked={selectedGenre.indexOf(option) > -1}
                              />
                            </ListItemIcon>
                            <ListItemText primary={option} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <InputLabel id="mutiple-select-label">Artists</InputLabel>
                      <Select
                        // labelId="mutiple-select-label"
                        multiple
                        value={selected}
                        onChange={handleChange}
                        renderValue={(selected) => selected.join(", ")}
                      >
                        {artistsNameList.map((option) => (
                          <MenuItem key={option} value={option}>
                            <ListItemIcon>
                              <Checkbox
                                checked={selected.indexOf(option) > -1}
                              />
                            </ListItemIcon>
                            <ListItemText primary={option} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={releaseDateStart}
                      label="Release date start"
                      onChange={(e) => setReleaseDateStart(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={releaseDateEnd}
                      label="Release date end"
                      defaultValue="dd-mm-yyyy"
                      onChange={(e) => setReleaseDateEnd(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <br />
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth=""
                      onClick={handleFilter}
                    >
                      APPLY
                    </Button>
                  </FormControl>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
