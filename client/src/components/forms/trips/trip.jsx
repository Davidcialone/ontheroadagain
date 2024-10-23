import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Badge,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link as RouterLink } from "react-router-dom";
import { deleteTrip } from "../../../api/tripApi";
import ReactStars from "react-stars";
import { UpdateTripModal } from "../modals/updateTripModal";
import { DeleteTripModal } from "../modals/deleteTripModal";

export function Trip({ 
  id, 
  photo = "default-image-url", 
  title, 
  dateStart, 
  dateEnd, 
  description = "No description available", 
  rating = 0, 
  onTripDeleted, 
  onTripUpdated 
}) {
  const [updatedTrip, setUpdatedTrip] = useState({});
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleUpdateClick = () => {
    setIsUpdateOpen(true);
  };

  const handleUpdateTrip = (updatedTripData) => {
    if (updatedTripData) {
      const { userId, ...tripDataWithoutUserId } = updatedTripData;
      setUpdatedTrip(tripDataWithoutUserId);
      onTripUpdated(tripDataWithoutUserId);
      setIsUpdateOpen(false);
    } else {
      console.error("updatedTripData is undefined");
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteOpen(true);
  };

  const handleDeleteTrip = async () => {
    try {
      await deleteTrip(id);
      onTripDeleted(id);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const color= "gray";
  const backgroundColor = "#f4f4f4";

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 8,
      '&:hover': {
        boxShadow: 12, // Increase shadow on hover for more effect
      }, 
      
    }}>
      <CardMedia
        component="img"
        height="400"
        image={photo || updatedTrip.photo}
        alt={title || updatedTrip.title || "Title not available"}
        sx={{ 
          objectFit: "cover", 
          transition: 'transform 0.3s ease-in-out', // Smooth zoom effect
          '&:hover': {
            transform: 'scale(1.1)', // Zoom in the image by 10% on hover
          },
        }}
      />
      <CardContent>
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', // Ajoute l'effet d'ombre ici
        }}
      >
        {title || updatedTrip.title || "Title not available"}
      </Typography>


        {/* Dates Section */}
        <Box mt={2}>
        <Badge 
            color= {color} 
            sx={{ 
              mr: 1, 
              backgroundColor: {backgroundColor}, // light gray background
              border: '1px solid #a9a9a9', // dark gray border
              padding: '1px 8px ' , // optional: some padding for better appearance
              borderRadius: '8px', // optional: rounded corners
            }}
          >
            Dates
        </Badge>

          <Typography variant="body2" mt={1}>
            Du{" "}
            {new Date(dateStart).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            au{" "}
            {new Date(dateEnd).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Typography>
        </Box>

        {/* Description Section */}
        <Box mt={2}>
          <Badge  color= {color} 
            sx={{ 
              mr: 1, 
              backgroundColor: {backgroundColor}, // light gray background
              border: '1px solid #a9a9a9', // dark gray border
              padding: '1px 8px ' , // optional: some padding for better appearance
              borderRadius: '8px', // optional: rounded corners
            }}>
            Description
          </Badge>
          <Typography variant="body2" mt={1}>
            {description || updatedTrip.description}
          </Typography>
        </Box>

        {/* Rating Section */}
        <Box mt={2}>
          <Badge  color= {color}  
            sx={{ 
              mr: 1, 
              backgroundColor: {backgroundColor}, // light gray background
              border: '1px solid #a9a9a9', // dark gray border
              padding: '1px 8px ' , // optional: some padding for better appearance
              borderRadius: '8px', // optional: rounded corners
            }}>
            Note
          </Badge>
          <Box display="flex" justifyContent="center" mt={1}>
            <ReactStars
              count={5}
              value={typeof rating === "number" ? Number(rating) : 0}
              size={24}
              half={true}
              color2={"#ffd700"}
              color1={"#a9a9a9"}
              edit={false}
            />
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'center' }}>
  <Button
    onClick={handleUpdateClick}
    variant="outlined"
    size="small"
    color={color}
    startIcon={<EditIcon />}
    sx={{
      boxShadow: 2,
      '&:hover': {
        boxShadow: 4, // Increase shadow on hover for more effect
      },
    }}
  >
    Modifier
  </Button>
  <Button
    onClick={handleDeleteClick}
    variant="outlined"
    size="small"
    color={color}
    startIcon={<DeleteIcon />}
    sx={{
      boxShadow: 2,
      '&:hover': {
        boxShadow: 4, // Increase shadow on hover for more effect
      },
    }}
  >
    Effacer
  </Button>
  <Button
    component={RouterLink}
    to={`/trips/${id}/visits`}
    variant="outlined"
    size="small"
    color={color}
    startIcon={<VisibilityIcon />}
    sx={{
      boxShadow: 2,
      '&:hover': {
        boxShadow: 4, // Increase shadow on hover for more effect
      },
    }}
  >
    Visites
  </Button>
</CardActions>


      <UpdateTripModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        onUpdateTrip={handleUpdateTrip}
        tripId={id}
        title={title}
        photo={photo}
        startDate={new Date(dateStart)}
        endDate={new Date(dateEnd)}
        rating={typeof rating === "number" ? Number(rating) : 0}
        description={description}
      />

      <DeleteTripModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        tripId={id}
        onDelete={handleDeleteTrip}
      />
    </Card>
  );
}

// Define prop types
Trip.propTypes = {
  id: PropTypes.number.isRequired,
  photo: PropTypes.string,
  title: PropTypes.string.isRequired,
  dateStart: PropTypes.string.isRequired,
  dateEnd: PropTypes.string.isRequired,
  description: PropTypes.string,
  rating: PropTypes.number,
  onTripDeleted: PropTypes.func.isRequired,
  onTripUpdated: PropTypes.func.isRequired,
};
