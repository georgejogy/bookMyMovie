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
  const [genreList, setGenreList] = useState([]);
  const [artistsNameList, setArtistNameList] = useState([]);
  const [selectedArtist, setSelected] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [releaseDateStart, setReleaseDateStart] = useState("");
  const [releaseDateEnd, setReleaseDateEnd] = useState("");
  const [filteredMovies, setFilteredMovie] = useState([]);

  useEffect(() => {
    async function checkTheResponse() {
      fetch("http://localhost:8085/api/v1/movies/?page=1&limit=20", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((rawsTheResponse) => rawsTheResponse.json())
        .then((receivedRes) => {
          setResponser((arr) => [...arr, ...receivedRes.movies]);
          setFilteredMovie((arr) => [...arr, ...receivedRes.movies]);
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
          setArtistNameList((arr) => [...arr, ...artistNameArray]);
        });
    }

    checkTheResponse();
  }, []);

  // Used to handle the filters in home page for movies
  const handleFilter = async () => {
    console.log(selectedGenre);
    console.log(selectedArtist);
    console.log(releaseDateEnd);
    console.log(releaseDateStart);
    console.log(movieName);

    setFilteredMovie(
      responser
        .filter((movie) => movie.title.startsWith(movieName))
        .filter((movie) => {
          if (selectedGenre.length > 0)
            return movie.genres.some((x) => selectedGenre.indexOf(x) > -1);
          else return movie;
        })
        .filter((movie) => {
          if (selectedArtist.length > 0 && movie.artists) {
            return movie.artists.some(
              (x) =>
                selectedArtist.indexOf(x.first_name + " " + x.last_name) > -1
            );
          } else {
            return movie;
          }
        })
        .filter((movie) => {
          let givenDate = new Date(releaseDateStart);
          let movieDate = new Date(movie.release_date);
          if (releaseDateStart.length > 0) {
            if(givenDate < movieDate){
              return movie;
            }
            else{
              return null;
            }
          } else {
            return movie;
          }
        }).filter((movie) => {
          let movieDate = new Date(movie.release_date);
          let givenDate = new Date(releaseDateEnd);
          if (releaseDateEnd.length > 0) {
            if(givenDate > movieDate){
              return movie;
            }
            else{
              return null;
            }
          } else {
            return movie;
          }
        })
    );
  };

  //Used to handle the changes in artist dropdown filter
  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(
        selectedArtist.length === artistsNameList.length ? [] : artistsNameList
      );
      return;
    }
    setSelected(value);
  };

  //Used to handle the changes in genre dropdown filter
  const handleGenreChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelectedGenre(
        selectedArtist.length === genreList.length ? [] : genreList
      );
      return;
    }
    setSelectedGenre(value);
  };

  return (
    <div>
      <div className="home-container">
        <Header></Header>
        <div className="homePageHeader">Upcoming Movies</div>
        <GridList cols={6} className="custom-grid" cellHeight={250}>
          {responser.map((tile) => (
            <GridListTile key={tile.poster_url} rows={1}>
              <img src={tile.poster_url} alt={tile.title} />
              <GridListTileBar title={tile.title} />
            </GridListTile>
          ))}
        </GridList>
        <div className="home-details">
          <div className="movie-display">
            <GridList cols={4} className="movie-home-grid" cellHeight={350}>
              {filteredMovies.map((tile) => (
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
                        value={selectedArtist}
                        onChange={handleChange}
                        renderValue={(selected) => selected.join(", ")}
                      >
                        {artistsNameList.map((option) => (
                          <MenuItem key={option} value={option}>
                            <ListItemIcon>
                              <Checkbox
                                checked={selectedArtist.indexOf(option) > -1}
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
                      placeholder="dd-mm-yyyy"
                      onChange={(e) => setReleaseDateStart(e.target.value)}
                    />
                    <TextField
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={releaseDateEnd}
                      label="Release date end"
                      placeholder="dd-mm-yyyy"
                      onChange={(e) => setReleaseDateEnd(e.target.value)}
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
