import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Badge,
  CardMedia,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactStars from "react-stars";
import { deleteVisit } from "../../../api/visitApi";
import { addPhotosToVisit, getPhotosForVisit } from "../../../api/photosApi";
import { VisitPhotos } from "../../forms/visits/visitPhotosCarousel";
import { UpdateVisitModal } from "../modals/updateVisitModal";
import { DeleteVisitModal } from "../modals/deleteVisitModal";
import { AddPhotosModal } from "../modals/addPhotosModal";
import EXIF from "exif-js"; // Import EXIF library
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Import Leaflet components
// import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
// import L from "leaflet";

// // Importation explicite des images
// import markerIconUrl from '../../../../node_modules/leaflet/dist/images/marker-icon.png';
// import markerIconRetinaUrl from   '../../../../node_modules/leaflet/dist/images/marker-icon-2x.png';
// import markerShadowUrl from   '../../../../node_modules/leaflet/dist/images/marker-shadow.png';

// // Définir l'icône du marqueur
// const markerIcon = L.icon({
//   iconUrl: markerIconUrl,
//   iconRetinaUrl: markerIconRetinaUrl,
//   shadowUrl: markerShadowUrl,
// });


export function Visit({
  id,
  title,
  photo,
  dateStart,
  dateEnd,
  rating,
  comment,
  onVisitUpdated,
  onVisitDeleted,
  tripId,
  visitId,
  latitude,
  longitude,
  tripStart,
  tripEnd,
}) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddPhotosOpen, setIsAddPhotosOpen] = useState(false);
  const [currentLatitude, setCurrentLatitude] = useState(latitude);
  const [currentLongitude, setCurrentLongitude] = useState(longitude);
  const [uploadedPhoto, setUploadedPhoto] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [visitPhotos, setVisitPhotos] = useState([]);
  const [exifData, setExifData] = useState({}); // State to hold EXIF data
  
console.log("visitId", visitId);
  //  useEffect(() => {
  //   if (photo) {
  //     const img = new Image();
  //     img.src = photo;

  //     img.onload = () => {
  //       EXIF.getData(img, function() {
  //         const allExifData = EXIF.getAllTags(this);
  //         // console.log("Données EXIF complètes:", allExifData);  // Debugging

  //         // Récupération des données GPS
  //         const lat = EXIF.getTag(this, "GPSLatitude");
  //         const latRef = EXIF.getTag(this, "GPSLatitudeRef");
  //         const lon = EXIF.getTag(this, "GPSLongitude");
  //         const lonRef = EXIF.getTag(this, "GPSLongitudeRef");

  //         // Calcul des coordonnées
  //         let latitude = null;
  //         let longitude = null;

  //         if (lat !== undefined && lon !== undefined) {
  //           latitude = lat * (latRef === "N" ? 1 : -1);
  //           longitude = lon * (lonRef === "E" ? 1 : -1);
  //           console.log("Extracted Latitude:", latitude);
  //           console.log("Extracted Longitude:", longitude);
  //         } else {
  //           console.warn("Aucune donnée GPS trouvée.");
  //         }

  //         // Stocker les données EXIF dans l'état
  //         const dateTime = EXIF.getTag(this, "DateTimeOriginal");
  //         const cameraModel = EXIF.getTag(this, "Model");
  //         setExifData({ lat, lon, dateTime, cameraModel });

  //         // Mettre à jour les états de latitude et longitude
  //         setCurrentLatitude(latitude);
  //         setCurrentLongitude(longitude);
  //       });
  //     };
  //   }
  // }, [photo]);
  
  const handleUpdate = async () => {
    // Créer un objet Date à partir des dates mises à jour
    const visitStart = new Date(updatedDateStart);
    const visitEnd = new Date(updatedDateEnd);
  
    // Validation des dates : les dates doivent être comprises dans celles du voyage
    if (visitStart <= new Date(tripStart) || visitEnd >= new Date(tripEnd)) {
      setErrorMessage(
        `Les dates doivent être comprises entre ${new Date(tripStart).toLocaleDateString(
          "fr-FR"
        )} et ${new Date(tripEnd).toLocaleDateString("fr-FR")}.`
      );
      return;
    }
  
    // Si les dates sont valides, on procède à la mise à jour de la visite
    const updatedVisitData = {
      ...visitData,
      title: updatedTitle,
      dateStart: updatedDateStart,
      dateEnd: updatedDateEnd,
      rating: updatedRating,
      comment: updatedComment,
    };
    
    // Appel de la fonction onUpdateVisit pour mettre à jour la visite dans le parent
    handleUpdateVisit(updatedVisitData);
  };
  
 
  
  

//  Fetch visit photos on mount

  const fetchVisitPhotos = async () => {
    try {
      if (visitId) {
        const photos = await getPhotosForVisit(visitId);
        setVisitPhotos(photos); // Cela peut déclencher un nouveau rendu
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  useEffect(() => {
    // console.log("visitId a changé:", visitId); // Log l'ID de visite
    fetchVisitPhotos();
  }, [visitId]);
  

  const handleUpdateClick = () => setIsUpdateOpen(true);

  const handleUpdateVisit = (updatedVisitData) => {
    setCurrentLatitude(updatedVisitData.latitude);
    setCurrentLongitude(updatedVisitData.longitude);
    
    onVisitUpdated(updatedVisitData);
    console.log("Updated visit:", updatedVisitData);
    setIsUpdateOpen(false);
  };

 const handleDeleteClick = () => {
    console.log("Open delete modal for visit:", visitId);
    setIsDeleteOpen(true);
 };
  
const handleDeleteVisit = async (visitId) => {
    console.log("Attempting to delete visit:", visitId);
    try {
      await deleteVisit( visitId); // Assurez-vous que `deleteVisit` est importé correctement
      console.log("Visit deleted successfully:", visitId);
      onVisitDeleted(visitId);
    } catch (error) {
      console.error("Error deleting visit:", error);
    }
};

const handleAddPhotosClick = () => {   
    console.log("Open photos moadal for visit:", visitId, "for trip:", tripId);
    setIsAddPhotosOpen(true);
};

const handlePhotosUpload = (event) => {
    console.log("handlePhotoUpload a été appelée"); // Log pour confirmer que la fonction est appelée
    const files = event.target.files; // Obtenez les fichiers
    console.log("Fichiers sélectionnés:", files); // Log des fichiers sélectionnés

    if (files && files.length > 0) {
        const photosArray = Array.from(files).map(file => ({
            url: URL.createObjectURL(file),
            publicId: file.name
        }));
        console.log("handlePhotoUpload, Photos à ajouter:", photosArray, "type", typeof photosArray); // Vérifiez les photos ajoutées

        // Mise à jour de l'état avec les nouvelles photos
        setUploadedPhotos(prevPhotos => [...prevPhotos, ...photosArray]); // Ajoute à l'état existant

        console.log("Valeur de uploadedPhotos juste après setUploadedPhotos:", uploadedPhotos); // Vérifiez la valeur juste après
    } else {
        console.error("Aucune photo sélectionnée"); // Log pour déboguer
    }
};


const handleAddVisitsPhotos = async (uploadedPhotos) => {
  try {
    if (!uploadedPhotos || uploadedPhotos.length === 0) {
      console.error("Aucune photo valide à ajouter");
      return;
    }

    await addPhotosToVisit(visitId, uploadedPhotos);
    console.log("Photos ajoutées avec succès" , uploadedPhotos);

    setIsAddPhotosOpen(false);
    fetchVisitPhotos();
    setUploadedPhotos(); // Mise à jour de l'état avec les photos téléchargées
   } catch (error) {
    console.error("Erreur lors de l'ajout de photos:", error.message);
  }
};

 
  
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        boxShadow: 8,
        padding: 2,
        "&:hover": { boxShadow: 12 },
      }}
    >
      <Grid container spacing={2}>
        {/* Left Section - Details */}
        <Grid item xs={12} md={2} sx={{ borderRight: "1px solid #b0bec5", marginTop: 2, padding: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              {title || "Title not available"}
            </Typography>
            <Box display="flex" gap={0.5}>
              <Button size="small" startIcon={<EditIcon />} onClick={handleUpdateClick} sx={{ color: "black", minWidth: 0, padding: 0.5 }} />
              <Button size="small" startIcon={<DeleteIcon />} onClick={handleDeleteClick} sx={{ color: "black", minWidth: 0, padding: 0.5 }} />
            </Box>
          </Box>

          {/* Dates Section */}
          <CardContent sx={{ mt: 2 }}>
            <CardMedia
                component="img"
                height="200"
                image={uploadedPhoto.length > 0 ? uploadedPhoto[0].url : photo} // Utilisez la première photo téléchargée ou la photo existante
                sx={{ objectFit: "cover", transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.1)' } }}
            />
            <Badge color="gray" sx={{ mr: 1, backgroundColor: "#f4f4f4", padding: "1px 8px", borderRadius: "8px" }}>
                Dates
            </Badge>
            <Typography variant="body2" mt={1}>
                Du {new Date(dateStart).toLocaleDateString("fr-FR")} au {new Date(dateEnd).toLocaleDateString("fr-FR")}
            </Typography>



            {/* Rating Section */}
            <Badge color="gray" sx={{ mr: 1, backgroundColor: "#f4f4f4", padding: "1px 8px", borderRadius: "8px", mt: 2 }}>
              Note
            </Badge>
            <Box display="flex" justifyContent="center" mt={1}>
              <ReactStars count={5} value={parseFloat(rating.toFixed(1))} size={24} half={true} edit={false} color2={"#ffd700"} color1={"#a9a9a9"} />
            </Box>

            {/* Comment Section */}
            <Badge color="gray" sx={{ mb: 1, backgroundColor: "#f4f4f4", padding: "1px 8px", borderRadius: "8px", mt: 2 }}>
              Commentaire
            </Badge>
            <Typography variant="body2">{comment || "Aucun commentaire disponible"}</Typography>
          </CardContent>
        </Grid>

        {/* Middle Section - Location */}
        <Grid item xs={12} md={2} sx={{ borderRight: "1px solid #b0bec5", marginTop: 2, padding: 2 }}>
          <CardContent>
            <Badge color="gray" sx={{ mr: 1, backgroundColor: "#f4f4f4", padding: "1px 8px", borderRadius: "8px" }}>
              Localisation
            </Badge>
            <Box mt={2} display="flex" justifyContent="center">
            {currentLatitude && currentLongitude ? (
              <MapContainer center={[currentLatitude, currentLongitude]} zoom={14} style={{ height: "150px", width: "100%", borderRadius: "8px", overflow: "hidden" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[currentLatitude, currentLongitude]}>
                  <Popup>
                    <span>{title}</span>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <Typography variant="body2">Aucune localisation disponible. Veuillez vérifier les données GPS de votre image.</Typography>
            )}
          </Box>

          </CardContent>
        </Grid>

        {/* Right Section - Image Upload */}
        <Grid item xs={12} md={8} sx={{ padding: 2 }}>
          <CardMedia>
            <input accept="image/*" style={{ display: "none" }} id="upload-button" type="file" multiple onChange={handlePhotosUpload} />
            <label htmlFor="upload-button">
              <Button onClick={handleAddPhotosClick} sx={{ variant: "contained", color: "black", component: "span", boxShadow: "8" }}>
                Ajouter des photos
              </Button>
            </label>
            <VisitPhotos photos={visitPhotos}/>
          </CardMedia>
        </Grid>
      </Grid>

      {/* EXIF Data Display */}
      {/* <Box sx={{ marginTop: 2 }}>
        <Typography variant="subtitle1">Informations de la photo :</Typography>
        {loadingExif ? (
          <Typography variant="body2">Chargement des données EXIF...</Typography>
        ) : (
          <>
            {exifData.dateTime && (
              <Typography variant="body2">Date de prise de vue : {exifData.dateTime}</Typography>
            )}
            {exifData.cameraModel && (
              <Typography variant="body2">Modèle d'appareil photo : {exifData.cameraModel}</Typography>
            )}
            {exifData.lat && exifData.lon && (
              <Typography variant="body2">
                Coordonnées GPS : {exifData.lat}, {exifData.lon}
              </Typography>
            )}
          </>
        )}
      </Box> */}

      {/* Update Visit Modal */}
      <UpdateVisitModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        visit={{ title, dateStart, dateEnd, rating, comment, id: visitId, latitude: currentLatitude, longitude: currentLongitude }}
        onUpdateVisit={handleUpdateVisit}
      />

      {/* Delete Modal */}
      <DeleteVisitModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        visitId={visitId}
        tripId={tripId}
        onDelete={handleDeleteVisit}
      />

      {/* Add Photos Modal */}
      <AddPhotosModal
        isOpen={isAddPhotosOpen}
        onClose={() => {setIsAddPhotosOpen(false)}}
        onAddPhotos={handleAddVisitsPhotos} // Passez directement la fonction
        visitId={visitId}
        tripId={tripId}
    />
    </Card>
  );
}

Visit.propTypes = {
  id: PropTypes.number,
  tripId: PropTypes.number,
  title: PropTypes.string.isRequired,
  photo: PropTypes.string,
  dateStart: PropTypes.string.isRequired,
  dateEnd: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string,
  onVisitUpdated: PropTypes.func.isRequired,
  onVisitDeleted: PropTypes.func.isRequired,
  visitId: PropTypes.number.isRequired,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
};