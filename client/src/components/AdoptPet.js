import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Grid,
  Typography,
  Button
} from "@mui/material";
import AnimalDetail from "./modals/AnimalDetail";
import noImage from "../img/noImage.jpg";
import ErrorHandler from "./ErrorHandler";

function AdoptPet() {
  let card;
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [openModal,setOpenModal] = useState(false);
  const [maxPage,setMaxPage] = useState(null);
  const [error,setError] = useState(null);
  const [animal,setAnimal] = useState(null);
  const clientId = 'mR1WfUgThjt5RpjyZuTHIHMf5BC0SzUbTuJjJnSyJZiRodfiPA';
  const clientSecret = 'dep3PivKfHYkOfGRYbrkwD2EefMrogmngnPjdomZ';

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
            setMaxPage(response.pagination.total_pages)
            setData(response.animals)
            setError(null)})
        .catch(error=>setError(error.message));
    }
    if (token) {
        fetchData();
    }
  }, [token,page]);

  const handleOpenModal=(event)=>{
    setOpenModal(true);
    setAnimal(event);
  }
  const handleCloseModals = () => {
    setOpenModal(false);
  };

  const handlePrevios=()=>{
    setPage(page-1);
  };
  const handleNext=()=>{
    setPage(page+1);
  };

  const buildCard = (event)=>{
    const characterists = event.tags.map((tag)=>{
        return `${tag} `;
    })
    return(
        <Grid item xs={8} sm={6} md={4} lg={3} xl={3} key={event.id}>
            <Card className='card' sx={{minHeight:'550px',maxHeight:'550px'}} variant='outlined'>
                <CardActionArea>
                    <div onClick={()=>handleOpenModal(event)}>
                    <CardMedia
                        className='media'
                        component='img'
                        image={event.photos&&event.photos[0] ? event.photos[0].large : noImage}
                        title={`${event.name} image`}
                        sx={{width:'100%', height:'400px'}}
                    />
                    
                    <CardContent sx={{alignItems:'center'}}>
                        <Typography className='titleHead' variant='h5' component='h2'>
                            {event.name?event.name:<span></span>}
                        </Typography>
                        <Typography variant='body1' component='span'>
                            {event.age?<span>{event.age} </span>: <span> </span> }{event.gender?<span>| {event.gender}</span>:<span> </span>}{event.breeds.primary? <span> | {event.breeds.primary}</span>:<span> </span>}{event.breeds.secondary?<span> x {event.breeds.secondary}</span>:<span></span>}
                        </Typography>
                        <Typography variant='body1' component='span' sx={{objectFit:'contain'}}>
                            {characterists?<span className="character"><br/>{characterists}</span>:<span></span>}
                        </Typography>
                    </CardContent>
                    </div>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

  if (data) {
    // let filteredData = data.filter((event)=>(
    //     event.photos.length!==0
    // ))
    
    card = data && data.map((event) => {
        return buildCard(event);
      });
  }

  if(error){
    return(
        <ErrorHandler error={error}></ErrorHandler>
    )
  }
  else{
  return (
    <div>
        <span className="pageTitle">Adopt a Pet</span>
        <br/>
        <br/>
        {page>1?<Button sx={{color:'#996600',borderBlockColor:'#db9b43'}} variant="outlined" onClick={()=>handlePrevios()}>Previous</Button>:<span></span>}
        <span className="pageSpace">{page}</span>
        {page<maxPage?<Button sx={{color:'#996600',borderBlockColor:'#db9b43'}} variant="outlined" onClick={()=>handleNext()}>Next</Button>:<span></span>}
        <br/>
        <br/>
        <br/>
        <Grid container justifyContent={'center'}  className="grid" spacing={7}>
            {card}
        </Grid>
      {openModal && openModal && (
        <AnimalDetail
            isOpen={openModal}
            handleClose={handleCloseModals}
            animal={animal}
            token={token}
        />
        )}
    </div>
  )};
}

export default AdoptPet;
