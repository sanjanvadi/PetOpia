import React, { useState } from "react";
import "../../App.css";
import ReactModal from 'react-modal'
import { Card,CardContent,CardHeader,CardMedia,IconButton, Typography } from "@mui/material";
import noImage from '../../img/noImage.jpg';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from "react";
//For react-modal
ReactModal.setAppElement("#root");
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    height:"80%",
    border: "1px solid #28547a",
    borderRadius: "4px",
    backgroundColor:'#f5f5f5'
  },
};

function AnimalDetail(props) {
  const [openModal, setOpenModal] = useState(props.isOpen);
  const [animal, setAnimal] = useState(props.animal);
  const [org,setOrg] = useState(null);
  const [token] = useState(props.token)
  const handleCloseModal = () => {
    setOpenModal(false);
    setAnimal(null);
    props.handleClose();
  };

  useEffect(() => {
    async function fetchData() {
        await fetch(`https://api.petfinder.com/v2/organizations/${animal.organization_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            })
            .then((response) => response.json())
            .then((response) => {
                setOrg(response.organization)});
    }
    if (token) {
      fetchData();
    }
  }, [token,animal]);

  return (
    <ReactModal
    name="detailModal"
    isOpen={openModal}
    contentLabel="Animal Details"
    style={customStyles}>
    <div>
    <IconButton
        className="close-button"
        onClick={handleCloseModal}
        sx={{ position:'fixed', top: 0, right: 0, zIndex: 9999 }}
    >
        <CloseIcon />
    </IconButton>
      
      <Card className="card" sx={{backgroundColor:'#f5f5f5 '}}>
        <CardHeader className="titleHead" title={animal.name}/>
        <CardMedia
            className='media'
            component='img'
            image={animal.photos&&animal.photos[0] ? animal.photos[0].full : noImage}
            title='animal image'
            sx={{objectFit:'contain'}}
        />
        <CardContent>
            <Typography component='span'>
                {animal.species?<span className="color">{animal.species} | </span>:<span></span>}
                {animal.gender?<span className="color">{animal.gender} | </span>:<span></span>}
                {animal.breeds.primary?<span className="color">{animal.breeds.primary}</span>:<span></span>}
                {animal.breeds.secondary?<span className="color"> x {animal.breeds.secondary}</span>:<span></span>}
            </Typography>
            <Typography component='span'>
                {animal.description?<div><p>Meet {animal.name}</p><span>{animal.description}</span></div>:<span></span>}
            </Typography>
            <Typography component='span'>
                {animal.coat||animal.attributes?<p>Attributes</p>:<span></span>}
                {animal.coat?<dl><dt>Coat : </dt><dd className="color">{animal.coat}</dd></dl>:<span></span>}
                {animal.attributes&&animal.attributes.declawed?<dl><dt>Declawed : </dt><dd className="color">Yes</dd></dl>:<dl><dt>Declawed : </dt><dd className="color">No</dd></dl>}
                {animal.attributes&&animal.attributes.house_trained?<dl><dt>House Trained : </dt><dd className="color">Yes</dd></dl>:<dl><dt>House Trained : </dt><dd className="color">No</dd></dl>}
                {animal.attributes&&animal.attributes.shots_current?<dl><dt>Vaccination : </dt><dd className="color">Up to date</dd></dl>:<dl><dt>Vaccination : </dt><dd className="color">Not Vaccinated</dd></dl>}
                {animal.attributes&&animal.attributes.spayed_neutered?<dl><dt>Spayed / Neutered : </dt><dd className="color">Yes</dd></dl>:<dl><dt>Spayed / Neutered : </dt><dd className="color">No</dd></dl>}
            </Typography>
            <Typography component='span'>
                {org&&org.name?<p>Shelter</p>:<span></span>}
                {org&&org.name?<span className="main">{org.name}<br/></span>:<span></span>}

                {animal.contact.address.address1?<span className="color">{animal.contact.address.address1}, </span>:<span></span>}
                {animal.contact.address.address2?<span className="color">{animal.contact.address.address2}, </span>:<span></span>}
                {animal.contact.address.city?<span className="color">{animal.contact.address.city}, </span>:<span></span>}
                {animal.contact.address.state?<span className="color">{animal.contact.address.state}, </span>:<span></span>}
                {animal.contact.address.postcode?<span className="color">{animal.contact.address.postcode}</span>:<span></span>}

                {animal.contact&&animal.contact.email?<span><br/>Email : <span className="color">{animal.contact.email}</span><br/></span>:<span></span>}
                {animal.contact&&animal.contact.phone?<span>Phone : <span className="color">{animal.contact.phone}</span></span>:<span></span>}

                {org&&org.url?<a href={org.url} target='_blank' rel='noopener noreferrer'><br/><br/><button className="button">More Info</button></a>:<span></span>}
            </Typography>
        </CardContent>
      </Card>
    </div>
    </ReactModal>
  );
}

export default AnimalDetail;
