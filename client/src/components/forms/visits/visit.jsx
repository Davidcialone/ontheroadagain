import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  IconButton,
  Snackbar,
} from "@mui/material"; // Utilisation de MUI v5
import { Star } from "@mui/icons-material"; // Star icon from MUI v5
import { Add as AddIcon } from "@mui/icons-material"; // Add icon from MUI v5
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export function Visit({ title, photos = [], startDate, endDate, rating, comment, onUpdate, onDelete }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Function to render rating stars
  const renderStars = (rating) => {
    const validRating = typeof rating === 'number' && rating >= 0 && rating <= 5 ? rating : 0;

    return Array(5)
      .fill("")
      .map((_, i) => (
        <Star key={i} color={i < validRating ? "gold" : "gray"} />
      ));
  };

  // Validating title, startDate, and endDate
  const validTitle = typeof title === 'string' && title.trim() !== "" ? title : "Titre non disponible";
  const validStartDate = typeof startDate === 'string' && startDate.trim() !== "" ? startDate : "Date de départ non disponible";
  const validEndDate = typeof endDate === 'string' && endDate.trim() !== "" ? endDate : "Date de retour non disponible";

  return (
    <Card variant="outlined" sx={{ mb: 2, boxShadow: 1 }}>
      <CardHeader
        title={<Typography variant="h6">{validTitle}</Typography>}
        action={
          <Box>
            <IconButton onClick={() => { onUpdate(); setSnackbarOpen(true); }}>
              <span>Modifier</span>
            </IconButton>
            <IconButton onClick={() => { onDelete(); setSnackbarOpen(true); }}>
              <span>Supprimer</span>
            </IconButton>
          </Box>
        }
      />

      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle2" textTransform="uppercase">Dates</Typography>
              <Typography>{`Départ : ${validStartDate} - Retour : ${validEndDate}`}</Typography>
            </Box>

            <Box mt={2}>
              <Typography variant="subtitle2" textTransform="uppercase">Évaluation</Typography>
              <Box>{renderStars(rating)}</Box>
            </Box>

            <Box mt={2}>
              <Typography variant="subtitle2" textTransform="uppercase">Commentaire</Typography>
              <Typography>
                {comment && typeof comment === 'string' && comment.trim() !== "" ? comment : "Aucun commentaire disponible"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {Array.isArray(photos) && photos.length > 0 ? (
                photos.map((photo, index) => (
                  typeof photo === 'string' && photo.trim() !== "" ? (
                    <Box key={index} cursor="pointer" onClick={() => { setPhotoIndex(index); setIsLightboxOpen(true); }}>
                      <img src={photo} alt={`Photo ${index + 1}`} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                    </Box>
                  ) : null
                ))
              ) : (
                <Typography>Aucune photo disponible</Typography>
              )}
            </Box>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => console.log("Ajouter une photo")}
            >
              Ajouter une photo
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      {/* Lightbox for photo preview */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={photos.map(src => ({ src }))}
        index={photoIndex}
      />

      {/* Snackbar for feedback on actions */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Action effectuée !"
      />
    </Card>
  );
}

Visit.propTypes = {
  title: PropTypes.string.isRequired,
  photos: PropTypes.arrayOf(PropTypes.string),
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};

export default Visit;
