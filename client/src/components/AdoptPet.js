import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardActionArea,
  Grid,
  Typography,
} from "@mui/material";
import AnimalDetail from "./modals/AnimalDetail";
import noImage from "../img/download.jpeg";

function AdoptPet(props) {
  let card;
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [openModal,setOpenModal] = useState(false);
  const [animal,setAnimal] = useState(null);
  const clientId = "BVnaCxeYALlTyVuSQNWR8uFlad3Yk8lEC51O3t7Hm6o7PFqJHX";
  const clientSecret = "l1bJ7O2rRafSVNt4ORYnhZwaQo5L8Ac5P3oGg4U7";
console.log(data);
  useEffect(() => {
    async function fetchToken() {
      const response = await fetch(
        "https://api.petfinder.com/v2/oauth2/token",
        {
          method: "POST",
          body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const t = await response.json();

      setToken(t.access_token);
    }
    fetchToken();
  }, []);

  // Make an API request
  useEffect(() => {
    async function fetchData() {
      await fetch(`https://api.petfinder.com/v2/animals?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
            console.log(response)
            setData(response.animals)});
    }
    if (token) {
      fetchData();
    }
  }, [token, page]);

  const handleOpenModal=(event)=>{
    setOpenModal(true);
    setAnimal(event);
  }
  const handleCloseModals = () => {
    setOpenModal(false);
  };

  const buildCard = (event)=>{
    const characterists = event.tags.map((tag)=>{
        return `${tag} `;
    })
    return(
        <Grid item xs={8} sm={6} md={4} lg={3} xl={2.5} key={event.id}>
            <Card className='card' variant='outlined'>
                <CardActionArea>
                    <div onClick={handleOpenModal(event)}>
                    <CardMedia
                        className='media'
                        component='img'
                        image={event.photos&&event.photos[0] ? event.photos[0].medium : noImage}
                        title='event image'
                        sx={{width:'305px', height:'300px'}}
                    />
                    <CardContent>
                        <Typography className='titleHead' variant='h5' component='h2'>
                            {event.name?event.name:<span></span>}
                        </Typography>
                        <Typography variant='body1' component='span'>
                            {event.age?<span>{event.age} </span>: <span> </span> }{event.breeds.primary? <span>| {event.breeds.primary}</span>:<span> </span>}{event.breeds.secondary?<span> x {event.breeds.secondary}</span>:<span></span>}
                        </Typography>
                        <Typography variant='body1' component='span' sx={{objectFit:'contain'}}>
                            {characterists?<span><br/>{characterists}</span>:<span></span>}
                        </Typography>
                    </CardContent>
                    </div>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

  if (data) {
    card = data && data.map((event) => {
        return buildCard(event);
      });
  }

  return (
    <div>
      <Grid container className="grid" spacing={5}>
        {card}
      </Grid>

      {openModal && openModal && (
        <AnimalDetail
            isOpen={openModal}
            handleClose={handleCloseModals}
            animal={animal}
        />
        )}
    </div>
  );
}

export default AdoptPet;
