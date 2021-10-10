import {
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
} from "@material-ui/core";
import { FavoriteBorderOutlined } from "@material-ui/icons";
import React, { useEffect } from "react";
import Header from "../../common/header/Header";
import "./Home.css";

const Home = function (props) {
  const [responser, setResponser] = React.useState([]);
  const posterArray = [];
  let titleArray = [];
  let properArray = [];
  let properArrayTwo = [];
  useEffect(() => {
    async function checkTheResponse() {
      const rawResponse = await fetch("http://localhost:8085/api/v1/movies", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((rawsTheResponse) => rawsTheResponse.json())
        .then((receivedRes) => {
          let tmpArray = [];
          for (var i = 0; i < receivedRes.movies.length; i++) {
            tmpArray.push(receivedRes.movies[i].poster_url);
            titleArray.push(receivedRes.movies[i].title);
          }
          properArray = receivedRes.movies;
          console.log(properArray);
          setResponser([...properArray]);
          console.log(responser);
        });
      //console.log(rawResponse);
      //setResponse(rawResponse);
      //console.log(response);
    }

    checkTheResponse();
  }, []);

  
  const tileData = [
    {
      img: "https://i.imagesup.co/images2/0__05c7e898ac694e.jpg",
      title: "fun",
      author: "Image by Free-Photos on Pixabay",
      cols: 2,
      featured: true,
    },
    {
      img: "https://i.imagesup.co/images2/0__05c7e8a33418ff.jpg",
      title: "dog",
      author: "Image by Free-Photos on Pixabay",
    },
    {
      img: "https://cdn.pixabay.com/photo/2014/12/27/15/31/camera-581126_1280.jpg",
      title: "Camera",
      author: "Image by Free-Photos on Pixabay",
    },
    {
      img: "https://cdn.pixabay.com/photo/2017/05/12/08/29/coffee-2306471_1280.jpg",
      title: "Morning",
      author: "Image by Free-Photos on Pixabay",
      featured: true,
    },
    {
      img: "https://cdn.pixabay.com/photo/2017/05/13/12/40/fashion-2309519__480.jpg",
      title: "Hats",
      author: "Hans",
    },
    {
      img: "https://cdn.pixabay.com/photo/2015/10/26/11/10/honey-1006972__480.jpg",
      title: "Honey",
      author: "Image by Free-Photos on Pixabay",
    },
  ];

  const modArray = properArray;
  console.log("this is mod array" + properArray);
  return (
    <div>
      <div className="home-container">
        <Header></Header>
        <div className="homePageHeader">Upcoming Movies</div>
        <GridList cols={6} rows={1}>
          {console.log("rhis is the tem paray " , properArray)}
          {tileData.map((tile) => (
            <GridListTile key={tile.img} rows={1}>
              {console.log(tile.img)}
              <img
                src={tile.img}
                alt={tile.title}
                className="gridHeightAdjuster"
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
      </div>
    </div>
  );
};

export default Home;
