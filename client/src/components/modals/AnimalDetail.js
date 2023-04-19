import React, { useState } from "react";
import "../../App.css";
import ReactModal from "react-modal";
import { Card,CardMedia } from "@mui/material";
import noImage from '../../img/download.jpeg';
import CloseIcon from '@mui/icons-material/Close';

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
    border: "1px solid #28547a",
    borderRadius: "4px",
  },
};

function AnimalDetail(props) {
  const [openModal, setOpenModal] = useState(props.isOpen);
  const [animal, setAnimal] = useState(props.animal);

  const handleCloseDeleteModal = () => {
    setOpenModal(false);
    setAnimal(null);
    props.handleClose();
  };

  return (
    <div>
      <ReactModal
        name="detailModal"
        isOpen={openModal}
        contentLabel="Animal Details"
        style={customStyles}
      ></ReactModal>
      <Card className="card">
        <IconButton
            className="close-button"
            onClick={() => setOpenModal(false)}
            sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}
        >
            <CloseIcon />
        </IconButton>
        <CardMedia
            className='media'
            component='img'
            image={animal.photos&&animal.photos[0] ? animal.photos[0].medium : noImage}
            title='animal image'
            sx={{width:'305px', height:'300px'}}
        />
      </Card>
    </div>
  );
}

export default AnimalDetail;
