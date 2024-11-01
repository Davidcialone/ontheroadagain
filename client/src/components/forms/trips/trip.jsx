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
import ReactStars from "react-stars";
import { deleteTrip } from "../../../api/tripApi";
import { UpdateTripModal } from "../modals/updateTripModal";
import { DeleteTripModal } from "../modals/deleteTripModal";
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';




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

  // Actions
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

  const handleDeleteTrip = async () => {
    try {
      await deleteTrip(id);
      onTripDeleted(id);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  // UI Handlers
  const openUpdateModal = () => setIsUpdateOpen(true);
  const openDeleteModal = () => setIsDeleteOpen(true);

  const color = "gray";
  const backgroundColor = "#f4f4f4";

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 8, '&:hover': { boxShadow: 12 } }}>
      <CardMedia
        component="img"
        height="400"
        image={photo || updatedTrip.photo}
        alt={title || updatedTrip.title || "Title not available"}
        sx={{ 
          objectFit: "cover", 
          transition: 'transform 0.3s ease-in-out',
          '&:hover': { transform: 'scale(1.1)' },
        }}
      />
      <CardContent>
        <Card sx={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}
          >
            {title || updatedTrip.title || "Title not available"}
          </Typography>
          <CardActions sx={{ padding: 0, marginRight: -1 }}>
            <Box display="flex" gap={0.5} alignItems="center">
              <Button
                onClick={openUpdateModal}
                size="small"
                color={color}
                startIcon={<EditIcon />}
                sx={{ minWidth: 0, padding: 0.5 }} // Réduit le padding autour de l'icône
              />
              <Button
                onClick={openDeleteModal}
                size="small"
                color={color}
                startIcon={<DeleteIcon />}
                sx={{ minWidth: 0, padding: 0.5 }} // Réduit le padding autour de l'icône
              />
            </Box>
          </CardActions>
        </Card>

        {/* Dates Section */}
        <Box mt={2}>
          <Badge 
            color={color} 
            sx={{ 
              mr: 1, 
              backgroundColor: backgroundColor,
              border: '1px solid #a9a9a9',
              padding: '1px 8px',
              borderRadius: '8px',
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
          <Badge color={color} 
            sx={{ 
              mr: 1, 
              backgroundColor: backgroundColor,
              border: '1px solid #a9a9a9',
              padding: '1px 8px',
              borderRadius: '8px',
            }}
          >
            Description
          </Badge>
          <Typography variant="body2" mt={1}>
            {description || updatedTrip.description}
          </Typography>
        </Box>

        {/* Rating Section */}
        <Box mt={2}>
          <Badge color={color}  
            sx={{ 
              mr: 1, 
              backgroundColor: backgroundColor,
              border: '1px solid #a9a9a9',
              padding: '1px 8px',
              borderRadius: '8px',
            }}
          >
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

      <Box display="flex" justifyContent="flex-end">
        <Button
          sx={{
            m: 1,
            boxShadow: 2,
            '&:hover': { boxShadow: 4 },
          }}
          component={RouterLink}
          to={`/me/trips/${id}`} // Utilisation de `id` ici
          variant="outlined"
          size="small"
          color={color}
          startIcon={<VisibilityIcon />}
        >
          Visites
        </Button>
      </Box>

      {/* Modales */}
      <UpdateTripModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        onUpdateTrip={handleUpdateTrip}
        tripId={id}
        title={title}
        photo={photo}
        dateStart={new Date(dateStart)}
        dateEnd={new Date(dateEnd)}
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

// Définir les prop types
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
