import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardActions,
  Badge,
  CardMedia,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactStars from "react-stars";
import { UpdateVisitModal } from "../modals/updateVisitModal";
import { DeleteVisitModal } from "../modals/deleteVisitModal";
import { useParams } from "react-router-dom";
import Slider from "react-slick";

export function Visit({
  title,
  dateStart,
  dateEnd,
  rating,
  comment,
  onVisitUpdated,
  onVisitDeleted,
  visitId,
}) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [images, setImages] = useState([]);
  const { tripId } = useParams();

  const handleUpdateClick = () => setIsUpdateOpen(true);
  const handleDeleteClick = () => setIsDeleteOpen(true);

  const handleUpdateVisit = (updatedVisitData) => {
    onVisitUpdated(updatedVisitData);
    setIsUpdateOpen(false);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  const color = "#F5DEB3"

    return (
      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 8, padding: 2,
        '&:hover': {
          boxShadow: 12,
        },
      }}>
        <Grid container spacing={2}>
          {/* Left Section - Details */}
          <Grid item xs={12} md={4} sx={{ borderRight: "1px solid #b0bec5", marginTop: 2, padding: 2 }}>
            {/* Title and Icons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {title || "Titre non disponible"}
              </Typography>
              <Box display="flex" gap={0.5}>
                <Button size="small" startIcon={<EditIcon />} onClick={handleUpdateClick} sx={{ color: 'black', minWidth: 0, padding: 0.5 }} />
                <Button size="small" startIcon={<DeleteIcon />} onClick={handleDeleteClick} sx={{ color: 'black', minWidth: 0, padding: 0.5 }} />
              </Box>
            </Box>
  
            {/* Dates Section */}
            <CardContent sx={{ mt: 2 }}>
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
                <ReactStars count={5} value={rating} size={24} half={true} edit={false} color2={"#ffd700"} color1={"#a9a9a9"} />
              </Box>
  
              {/* Comment Section */}
              <Badge color="gray" sx={{ mb: 1, backgroundColor: "#f4f4f4", padding: "1px 8px", borderRadius: "8px", mt: 2 }}>
                Commentaire
              </Badge>
              <Typography variant="body2">{comment || "Aucun commentaire disponible"}</Typography>
            </CardContent>
          </Grid>
  
          {/* Right Section - Image Upload and Carousel */}
          <Grid item xs={12} md={8} sx={{ padding: 2 }}> {/* Changed to md={8} for 2/3 width */}
            <CardMedia>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-button"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="upload-button">
                <Button sx={{ variant: "contained", color: "black", component: "span", boxShadow: '8' }}>
                  Ajouter des images
                </Button>
              </label>
  
              {images.length > 0 && (
                <Box mt={2} sx={{ border: "1px dashed #90a4ae", padding: 2, borderRadius: 1 }}>
                  <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
                    {images.map((image, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={image}
                        alt={`Uploaded ${index}`}
                        width="100%"
                        height="300px"
                        sx={{ objectFit: "cover", borderRadius: 1 }}
                      />
                    ))}
                  </Slider>
                </Box>
              )}
            </CardMedia>
          </Grid>
        </Grid>
  
        {/* Update Visit Modal */}
        <UpdateVisitModal
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          visit={{ title, dateStart, dateEnd, rating, comment, id: visitId }}
          onUpdateVisit={handleUpdateVisit}
        />
  
        {/* Delete Modal */}
        <DeleteVisitModal
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          visitId={visitId}
          onDelete={() => {
            onVisitDeleted(visitId);
            setIsDeleteOpen(false);
          }}
        />
      </Card>
    );
  
}

Visit.propTypes = {
  title: PropTypes.string.isRequired,
  dateStart: PropTypes.string.isRequired,
  dateEnd: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string,
  onVisitUpdated: PropTypes.func,
  onVisitDeleted: PropTypes.func,
  visitId: PropTypes.number.isRequired,
};
