import axios from "axios";
import { React, useEffect, useState } from "react";
import Modal from "react-modal/lib/components/Modal";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import ErrorHandler from "./ErrorHandler";
const cloudinaryApi = "dzlf4ut72";
const presetValue = "lqbvmbqp";

Modal.setAppElement("#root");
let userId;
const PetCenterHome = () => {
  userId = window.sessionStorage.getItem("userid");
  const [loading, setLoading] = useState(true);
  const [getMyPets, setMyPets] = useState([]);
  const [isOpenPet, setIsOpenPet] = useState(false);
  const [isOpenError, setIsOpenError] = useState(false);
  const [isOpenEmptyError, setIsOpenEmptyError] = useState(false);
  const [petImage, setPetImage] = useState("");
  const [axiosLoading, setAxiosLoading] = useState(null);
  const [count, setCount] = useState(0);
  let card = null;

  useEffect(() => {
    async function getPets() {
      let { data } = await axios.get("pets/" + userId);
      setMyPets(data);
      setLoading(false);
    }
    getPets();
  }, []);

  function showPet() {
    setIsOpenPet(!isOpenPet);
  }

  const handleImageChange = (e) => {
    setPetImage(e.target.files[0]);
  };

  function showError() {
    setAxiosLoading(false);
    setIsOpenError(!isOpenError);
  }

  function showEmptyError() {
    setAxiosLoading(false);
    setIsOpenEmptyError(!isOpenEmptyError);
  }

  function addPet(e) {
    e.preventDefault();
    setAxiosLoading(true);
    const data = new FormData(e.target);
    const formJson = Object.fromEntries(data.entries());
    let petName = formJson.petName;
    let petAge = formJson.petAge;
    let petType = formJson.petType;
    let petBreed = formJson.petBreed;

    if (!petName || !petAge || !petType || !petBreed || !Number(petAge)) {
      showEmptyError();
    } else if (
      petName.trim().length === 0 ||
      petAge.trim().length === 0 ||
      petType.trim().length === 0 ||
      petBreed.trim().length === 0
    ) {
      showError();
    } else {
      if (petImage) {
        const formData = new FormData();
        formData.append("file", petImage);
        formData.append("upload_preset", presetValue);
        axios
          .post(
            `https://api.cloudinary.com/v1_1/${cloudinaryApi}/image/upload`,
            formData
          )
          .then((response) => {
            setPetImage(response.data.url);
            const pet = {
              petImage: response.data.url,
              petName,
              petAge,
              petType,
              petBreed,
            };
            fetch("/account/pets/" + userId, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(pet),
            })
              .then((res) => res.json())
              .then((data) => {
                setCount(count + 1);
                setPetImage(null);
                setAxiosLoading(false);
                setMyPets(data);
                setIsOpenPet(!isOpenPet);
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const pet = {
          petImage: null,
          petName,
          petAge,
          petType,
          petBreed,
        };
        fetch("/account/pets/" + userId, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pet),
        })
          .then((res) => res.json())
          .then((data) => {
            setPetImage(null);
            setAxiosLoading(false);
            setMyPets(data);
            setIsOpenPet(!isOpenPet);
            setLoading(false);
          });
      }
    }
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const buildCard = (pet) => {
    const res = pet.petImage ? (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={pet._id}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 250,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
        >
          <Link to={`/account/my-pet-info/${pet._id}`}>
            <CardMedia
              sx={{
                height: "100%",
                width: "100%",
              }}
              component="img"
              image={pet.petImage}
              title={pet.petName}
            />
          </Link>

          <CardContent>
            <Link to={`/account/my-pet-info/${pet._id}`}>
              <Typography
                sx={{
                  fontWeight: "bold",
                }}
                variant="h6"
                component="h2"
              >
                <div className="post-title pet-name">{pet.petName}</div>
              </Typography>
            </Link>
          </CardContent>
        </Card>
        <br />
        <br />
      </Grid>
    ) : (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={pet._id}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 250,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
        >
          <CardContent>
            <Link to={`/account/my-pet-info/${pet._id}`}>
              <Typography
                sx={{
                  fontWeight: "bold",
                }}
                variant="h6"
                component="h2"
              >
                <div className="post-title pet-name">{pet.petName}</div>
              </Typography>
            </Link>
          </CardContent>
        </Card>
      </Grid>
    );
    return res;
  };

  card = getMyPets.length ? (
    getMyPets.map((pet) => {
      return buildCard(pet);
    })
  ) : (
    <h2>
      <br />
      No pets added yet!
    </h2>
  );

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else {
    return (
      <div>
        <div className="community">Your Pet-Center</div>
        <button className="post-link" onClick={() => showPet()}>
          Add Pet
        </button>
        <br />
        <br />
        <br />
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          {card}
        </Grid>
        <Modal
          isOpen={isOpenPet}
          onRequestClose={showPet}
          contentLabel="My dialog"
          style={customStyles}
        >
          <form onSubmit={addPet}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <h3>Add your Pet</h3>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="petImage">Image:</label>
                  </td>
                  <td>
                    <input
                      onChange={handleImageChange}
                      type={"file"}
                      id="petImage"
                      name="petImage"
                      accept="image/*"
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="petName">Name:</label>
                  </td>
                  <td>
                    <input
                      placeholder="Ex: Tommy"
                      type={"text"}
                      id="petName"
                      name="petName"
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="petAge">Age (in years):</label>
                  </td>
                  <td>
                    <input
                      placeholder="Ex: 1, 2, 1.5, etc."
                      min={0}
                      step={0.1}
                      type={"number"}
                      id="petAge"
                      name="petAge"
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="petType">Type:</label>
                  </td>
                  <td>
                    <input
                      placeholder="Ex: Dog, Cat, etc."
                      type={"text"}
                      id="petType"
                      name="petType"
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="petBreed">Breed:</label>
                  </td>
                  <td>
                    <input
                      placeholder="Ex: Husky, Lab, etc."
                      type={"text"}
                      id="petBreed"
                      name="petBreed"
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <br></br>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>{axiosLoading && <>Uploading...</>}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <input
                      type={"submit"}
                      value="Add"
                      className="post-link"
                    ></input>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </Modal>

        <Modal
          isOpen={isOpenError}
          onRequestClose={showError}
          contentLabel="My dialog"
          style={customStyles}
        >
          <h3>Input cannot be empty</h3>
        </Modal>

        <Modal
          isOpen={isOpenEmptyError}
          onRequestClose={showEmptyError}
          contentLabel="My dialog"
          style={customStyles}
        >
          <h3>Invalid Input</h3>
        </Modal>
      </div>
    );
  }
};

/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------*/

const PetInfo = () => {
  userId = window.sessionStorage.getItem("userid");

  let [loading, setLoading] = useState(true);
  let [getMyPets, setMyPets] = useState(undefined);
  let [medHidden, setMedHidden] = useState(true);
  let [appHidden, setAppHidden] = useState(true);
  let [presHidden, setPresHidden] = useState(true);
  const [isOpenMed, setIsOpenMed] = useState(false);
  const [isOpenApp, setIsOpenApp] = useState(false);
  const [isOpenPres, setIsOpenPres] = useState(false);
  const [isOpenEditPet, setIsOpenEditPet] = useState(false);
  const [isOpenDelPet, setIsOpenDelPet] = useState(false);
  const [getPresImg, setPresImg] = useState(undefined);
  const [isOpenError, setIsOpenError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isOpenEmptyError, setIsOpenEmptyError] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [displayedError, setDisplayedError] = useState(null);
  const [axiosLoading, setAxiosLoading] = useState(null);

  const { petId } = useParams();

  let navigate = useNavigate();

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  const futureDate = yyyy + 1 + "-" + mm + "-" + dd;

  useEffect(() => {
    async function getPets() {
      try {
        let { data } = await axios.get(
          "/account/pets/mypet/" + userId + "/" + petId
        );
        setMyPets(data);
        setLoading(false);
      } catch (error) {
        setErrorMsg(error.response.data.error);
        setMyPets(undefined);
        setLoading(false);
      }
    }
    getPets();
  }, [petId]);

  function medCloseFunc() {
    if (medHidden) {
      setMedHidden(false);
      document.getElementById("medCardDiv").style.display = "flex";
      document.getElementById("medHeaderDiv").style.backgroundColor = "white";
    } else {
      setMedHidden(true);
      document.getElementById("medCardDiv").style.display = "none";
      document.getElementById("medHeaderDiv").style.backgroundColor = "#ece6e6";
    }
  }

  function appCloseFunc() {
    if (appHidden) {
      setAppHidden(false);
      document.getElementById("appCardDiv").style.display = "flex";
      document.getElementById("appHeaderDiv").style.backgroundColor = "white";
    } else {
      setAppHidden(true);
      document.getElementById("appCardDiv").style.display = "none";
      document.getElementById("appHeaderDiv").style.backgroundColor = "#ece6e6";
    }
  }

  function presCloseFunc() {
    if (presHidden) {
      setPresHidden(false);
      document.getElementById("presCardDiv").style.display = "flex";
      document.getElementById("presHeaderDiv").style.backgroundColor = "white";
    } else {
      setPresHidden(true);
      document.getElementById("presCardDiv").style.display = "none";
      document.getElementById("presHeaderDiv").style.backgroundColor =
        "#ece6e6";
    }
  }

  function showMed() {
    setIsOpenMed(!isOpenMed);
  }

  function showApp() {
    setIsOpenApp(!isOpenApp);
  }

  function showPres() {
    setIsOpenPres(!isOpenPres);
  }

  function showEditPet() {
    setIsOpenEditPet(!isOpenEditPet);
  }

  function showDelPet() {
    setIsOpenDelPet(!isOpenDelPet);
  }

  function showError() {
    setIsOpenError(!isOpenError);
  }

  function showEmptyError() {
    setIsOpenEmptyError(!isOpenEmptyError);
  }

  function addMed(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const formJson = Object.fromEntries(data.entries());
    let petId = getMyPets._id;
    let medicationName = formJson.medicationName;
    let administeredDate = formJson.administeredDate;
    let dosage = formJson.dosage;

    if (
      !medicationName ||
      !administeredDate ||
      !dosage ||
      !Date.parse(administeredDate)
    ) {
      showEmptyError();
    } else if (
      medicationName.trim().length === 0 ||
      administeredDate.trim().length === 0 ||
      dosage.trim().length === 0
    ) {
      showError();
    } else {
      const med = {
        userId,
        petId,
        medicationName,
        administeredDate,
        dosage,
      };

      fetch("/account/pets/medication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(med),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("petinfo", data);
          setMyPets(data);
          setIsOpenMed(!isOpenMed);
        });
    }
  }

  function addApp(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const formJson = Object.fromEntries(data.entries());
    let petId = getMyPets._id;
    let appointmentDate = formJson.appointmentDate;
    let reason = formJson.reason;
    let clinicName = formJson.clinicName;

    if (
      !appointmentDate ||
      !reason ||
      !clinicName ||
      !Date.parse(appointmentDate)
    ) {
      showEmptyError();
    } else if (
      appointmentDate.trim().length === 0 ||
      reason.trim().length === 0 ||
      clinicName.trim().length === 0
    ) {
      showError();
    } else {
      const app = {
        userId,
        petId,
        appointmentDate,
        reason,
        clinicName,
      };

      fetch("/account/pets/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(app),
      })
        .then((res) => res.json())
        .then((data) => {
          setMyPets(data);
          setIsOpenApp(!isOpenApp);
        });
    }
  }

  function addPres(e) {
    e.preventDefault();
    setAxiosLoading(true);
    const formData = new FormData();
    formData.append("file", getPresImg);
    formData.append("upload_preset", "lqbvmbqp");
    axios
      .post("https://api.cloudinary.com/v1_1/dzlf4ut72/image/upload", formData)
      .then((response) => {
        let petId = getMyPets._id;

        const app = {
          userId,
          petId,
          imageUrl: response.data.url,
        };

        fetch("/account/pets/prescription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(app),
        })
          .then((res) => res.json())
          .then((data) => {
            setMyPets(data);
            setIsOpenPres(!isOpenPres);
            setAxiosLoading(false);
          });
      });
  }

  function deleteMed(val) {
    let petId = getMyPets._id;
    let medId = val._id;

    const app = {
      userId,
      petId,
      medId,
    };

    fetch("/account/pets/medication", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(app),
    })
      .then((res) => res.json())
      .then((data) => {
        setMyPets(data);
      });
  }

  function deleteApp(val) {
    let petId = getMyPets._id;
    let appId = val._id;

    const app = {
      userId,
      petId,
      appId,
    };

    fetch("/account/pets/appointment", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(app),
    })
      .then((res) => res.json())
      .then((data) => {
        setMyPets(data);
      });
  }

  function deletePres(imageUrl) {
    let petId = getMyPets._id;

    const app = {
      userId,
      petId,
      imageUrl,
    };

    fetch("/account/pets/prescription", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(app),
    })
      .then((res) => res.json())
      .then((data) => {
        setMyPets(data);
      });
  }

  function editPet(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const formJson = Object.fromEntries(data.entries());

    let petId = getMyPets._id;
    let petName = formJson.petName;
    let petAge = formJson.petAge;
    let petType = formJson.petType;
    let petBreed = formJson.petBreed;

    if (!petName || !petAge || !petType || !petBreed || !Number(petAge)) {
      showEmptyError();
    } else if (
      petName.trim().length === 0 ||
      petAge.trim().length === 0 ||
      petType.trim().length === 0 ||
      petBreed.trim().length === 0
    ) {
      showError();
    } else {
      setLoading(true);
      const pet = {
        petId,
        petName,
        petAge,
        petType,
        petBreed,
      };

      axios
        .put("/account/pets/" + userId, pet)
        .then((res) => {
          localStorage.setItem("petinfo", res.data);
          setMyPets(res.data);
          setIsOpenEditPet(!isOpenEditPet);
          setServerError(false);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setServerError(true);
          setDisplayedError(error.response.data.error);
          setLoading(false);
        });
    }
  }

  function delPet(e) {
    e.preventDefault();
    setAxiosLoading(true);
    let petId = getMyPets._id;

    const pet = {
      petId,
    };

    fetch("/account/pets/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pet),
    }).then(() => {
      setAxiosLoading(false);
      navigate("/account/my-pets");
    });
  }

  let medCard =
    getMyPets &&
    getMyPets.medications.map((val) => {
      return (
        <div key={val.medicationName}>
          {/* <p>{val.medicationName}</p>
                <p>{val.administeredDate}</p>
                <p>{val.dosage}</p> */}
          <table className="table">
            <tbody>
              <tr>
                <td>Name:</td>
                <td>{val.medicationName}</td>
              </tr>
              <tr>
                <td>Date to be Administered:</td>
                <td>{val.administeredDate}</td>
              </tr>
              <tr>
                <td>Dosage:</td>
                <td>{val.dosage}</td>
              </tr>
            </tbody>
          </table>
          <br></br>
          <button className="post-link" onClick={() => deleteMed(val)}>
            Delete
          </button>
          <br></br>
          <br></br>
          <br></br>
        </div>
      );
    });

  let appCard =
    getMyPets &&
    getMyPets.appointments.map((val) => {
      return (
        <div key={val.appointmentDate}>
          {/* <p>{val.appointmentDate}</p>
                <p>{val.reason}</p>
                <p>{val.clinicName}</p> */}
          <table className="table">
            <tbody>
              <tr>
                <td>Date:</td>
                <td>{val.appointmentDate}</td>
              </tr>
              <tr>
                <td>Reason:</td>
                <td>{val.reason}</td>
              </tr>
              <tr>
                <td>Clinic Name:</td>
                <td>{val.clinicName}</td>
              </tr>
            </tbody>
          </table>
          <br></br>
          <button className="post-link" onClick={() => deleteApp(val)}>
            Delete
          </button>
          <br></br>
          <br></br>
          <br></br>
        </div>
      );
    });

  let presCard =
    getMyPets &&
    getMyPets.prescription.map((val) => {
      return (
        <div key={val} style={{ float: "left" }}>
          <a rel="noreferrer" target="_blank" href={val}>
            <img
              alt="Prescription"
              src={val}
              style={{ marginBottom: "20px", width: "400px", height: "400px" }}
            ></img>
          </a>
          <button
            style={{ marginLeft: "3.3em" }}
            className="post-link"
            onClick={() => {
              deletePres(val);
            }}
          >
            Delete
          </button>
          <br></br>
        </div>
      );
    });

  let card = getMyPets && (
    <div>
      <table style={{}} className="table">
        <tbody style={{ fontSize: "x-large" }}>
          <tr>
            <td>Name:</td>
            <td>{getMyPets.petName}</td>
          </tr>
          <tr>
            <td>Age:</td>
            <td>{getMyPets.petAge} year(s)</td>
          </tr>
          <tr>
            <td>Type:</td>
            <td>{getMyPets.petType}</td>
          </tr>
          <tr>
            <td>Breed:</td>
            <td>{getMyPets.petBreed}</td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      {/* <h3>Name: {getMyPets.petName}</h3>
                <p>Age: {getMyPets.petAge}</p>
                <p>Type: {getMyPets.petType}</p>
                <p>Bread: {getMyPets.petBreed}</p> */}
      <div className="pet-things">
        <div className="medHeaderDiv" id="medHeaderDiv">
          <h2
            onClick={() => {
              medCloseFunc();
            }}
          >
            Medications
          </h2>
        </div>
        <div className="medCardDiv" id="medCardDiv">
          <div className="cardDiv">{medCard}</div>
          <button
            className="post-link add-item"
            onClick={() => {
              showMed();
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="pet-things">
        <div className="appHeaderDiv" id="appHeaderDiv">
          <h2
            onClick={() => {
              appCloseFunc();
            }}
          >
            Appointments
          </h2>
        </div>
        <div className="appCardDiv" id="appCardDiv">
          <div className="cardDiv">{appCard}</div>
          <button
            className="post-link add-item"
            onClick={() => {
              showApp();
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="pet-things">
        <div className="presHeaderDiv" id="presHeaderDiv">
          <h2
            onClick={() => {
              presCloseFunc();
            }}
          >
            Prescription Photos
          </h2>
        </div>
        <div className="presCardDiv" id="presCardDiv">
          <div className="cardDiv">{presCard}</div>
          <button
            className="post-link add-item"
            onClick={() => {
              showPres();
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else if (getMyPets) {
    return (
      <div>
        <div>
          <button onClick={() => showEditPet()} className="post-link my-posts">
            Edit
          </button>
          <button onClick={() => showDelPet()} className="post-link my-posts">
            Delete
          </button>
        </div>
        <br />
        <h2 style={{ fontWeight: "bold" }}>{getMyPets.petName + "'s Info"}</h2>
        <div>{card}</div>
        <Link to={`/account/my-pets`}>
          <button onClick={() => showDelPet()} className="post-link my-posts">
            Back to Pet-Center
          </button>
        </Link>
        <Modal
          isOpen={isOpenMed}
          onRequestClose={showMed}
          contentLabel="My dialog"
          style={customStyles}
        >
          <form onSubmit={addMed}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <h3>Add Medications</h3>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="medicationName">Name:</label>
                  </td>
                  <td>
                    <input
                      type={"text"}
                      id="medicationName"
                      name="medicationName"
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="administeredDate">
                      Date to be Administered:
                    </label>
                  </td>
                  <td>
                    <input
                      type={"date"}
                      id="administeredDate"
                      name="administeredDate"
                      min={today}
                      max={futureDate}
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="dosage">Dosage:</label>
                  </td>
                  <td>
                    <input
                      type={"text"}
                      id="dosage"
                      name="dosage"
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <br></br>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <input
                      type={"submit"}
                      value="Add"
                      className="post-link"
                    ></input>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </Modal>

        <Modal
          isOpen={isOpenApp}
          onRequestClose={showApp}
          contentLabel="My dialog"
          style={customStyles}
        >
          <form onSubmit={addApp}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <h3>Add Appointment</h3>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="appointmentDate">Appointment Date:</label>
                  </td>
                  <td>
                    <input
                      type={"date"}
                      id="appointmentDate"
                      name="appointmentDate"
                      min={today}
                      max={futureDate}
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="reason">Reason:</label>
                  </td>
                  <td>
                    <input
                      type={"text"}
                      id="reason"
                      name="reason"
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="clinicName">Clinic Name:</label>
                  </td>
                  <td>
                    <input
                      type={"text"}
                      id="clinicName"
                      name="clinicName"
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <br></br>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <input
                      type={"submit"}
                      value="Add"
                      className="post-link"
                    ></input>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </Modal>

        <Modal
          isOpen={isOpenPres}
          onRequestClose={showPres}
          contentLabel="My dialog"
          style={customStyles}
        >
          <form onSubmit={addPres}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="presImg">
                      <h3>Add Prescription</h3>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      accept="image/*"
                      id="presImg"
                      type={"file"}
                      onChange={(event) => {
                        setPresImg(event.target.files[0]);
                      }}
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <br></br>
                  </td>
                </tr>
                <tr>
                  <td>{axiosLoading && <>Uploading...</>}</td>
                </tr>
                <tr>
                  <td>
                    <input
                      type={"submit"}
                      value="Add"
                      className="post-link"
                    ></input>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </Modal>

        <Modal
          isOpen={isOpenEditPet}
          onRequestClose={showEditPet}
          contentLabel="My dialog"
          style={customStyles}
        >
          <form onSubmit={editPet}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="petName">
                      <h3>Edit Pet</h3>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Name:</p>
                  </td>
                  <td>
                    <input
                      placeholder="Ex: Tommy"
                      type={"text"}
                      id="petName"
                      name="petName"
                      defaultValue={getMyPets["petName"]}
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="petAge">Age:</label>
                  </td>
                  <td>
                    <input
                      placeholder="Ex: 1, 2, 1.5, etc."
                      min={0}
                      step={0.1}
                      type={"number"}
                      id="petAge"
                      name="petAge"
                      defaultValue={getMyPets["petAge"]}
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="petType">Type:</label>
                  </td>
                  <td>
                    <input
                      placeholder="Ex: Dog, Cat, etc."
                      type={"text"}
                      id="petType"
                      name="petType"
                      defaultValue={getMyPets["petType"]}
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="petBreed">Breed:</label>
                  </td>
                  <td>
                    <input
                      placeholder="Ex: Husky, Lab, etc."
                      type={"text"}
                      id="petBreed"
                      name="petBreed"
                      defaultValue={getMyPets["petBreed"]}
                      required
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    {serverError && <ErrorHandler error={displayedError} />}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <input
                      type={"submit"}
                      value="Update"
                      className="post-link"
                    ></input>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </Modal>

        <Modal
          isOpen={isOpenDelPet}
          onRequestClose={showDelPet}
          contentLabel="My dialog"
          style={customStyles}
        >
          <form onSubmit={delPet}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <h3>Are you sure, you want to remove this pet?</h3>
                    {axiosLoading ? <span>Deleting...</span> : <span></span>}
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      type={"submit"}
                      value="Yes"
                      className="post-link"
                      style={{ float: "left" }}
                    ></input>
                    <input
                      style={{ float: "right" }}
                      type={"button"}
                      value="No"
                      onClick={() => showDelPet()}
                      className="post-link"
                    ></input>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </Modal>

        <Modal
          isOpen={isOpenError}
          onRequestClose={showError}
          contentLabel="My dialog"
          style={customStyles}
        >
          <h3>Input cannot be empty</h3>
        </Modal>

        <Modal
          isOpen={isOpenEmptyError}
          onRequestClose={showEmptyError}
          contentLabel="My dialog"
          style={customStyles}
        >
          <h3>Invalid Input</h3>
        </Modal>
      </div>
    );
  } else {
    return (
      <ErrorHandler
        error={
          <div>
            <br />
            <br />
            <h1>{errorMsg}</h1>
            <Link to={`/account/my-pets`}>
              <button
                onClick={() => showDelPet()}
                className="post-link my-posts"
              >
                Back to Pet-Center
              </button>
            </Link>
          </div>
        }
      />
    );
  }
};

export { PetCenterHome, PetInfo };
