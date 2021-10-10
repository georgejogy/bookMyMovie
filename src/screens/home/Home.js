import {
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
} from "@material-ui/core";
import { FavoriteBorderOutlined } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = (props) => {
  const [responser, setResponser] = useState([]);

  console.log(responser);
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
        });
    }

    checkTheResponse();
  }, []);

  return (
    <div>
      <div className="home-container">
        <Header></Header>
        <div className="homePageHeader">Upcoming Movies</div>
        {console.log(responser)}
        <GridList cols={6} className="custom-grid" cellHeight="250">
          {responser.map((tile) => (
            <GridListTile key={tile.poster_url} rows={1}>
              <img
                src={tile.poster_url}
                alt={tile.title}
              />
              <GridListTileBar
                title={tile.title}
                actionIcon={
                  <IconButton>
                    <FavoriteBorderOutlined />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
        <div className="home-details">
          <div className="movie-display">
            <GridList cols={4} className="movie-home-grid" cellHeight="350">
              {responser.map((tile) => (
                
                <GridListTile key={tile.poster_url} rows={1} >
                  <Link to={`/movie/${tile.id}`} >
                   <img
                    src={tile.poster_url}
                    alt={tile.title}
                  />
                  <GridListTileBar title={tile.title} />
                  </Link>
                </GridListTile>
                
              ))}
            </GridList>
          </div>
          <div className="movie-filter"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
