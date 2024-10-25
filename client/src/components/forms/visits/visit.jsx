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

  React.useEffect(() => {
    console.log("Trip ID:", tripId);
  }, [tripId]);

  const handleUpdateClick = () => {
    setIsUpdateOpen(true);
  };

  const handleUpdateVisit = (updatedVisitData) => {
    onVisitUpdated(updatedVisitData);
    setIsUpdateOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteOpen(true);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2, boxShadow: 1, padding: 2, border: "2px solid #b0bec5" }}>
      <Grid container spacing={2}>
        
        {/* Left Section - Details */}
        <Grid item xs={12} md={6} sx={{ border: "1px solid #b0bec5", padding: 2 }}>
          <Box sx={{display:'flex', mb: 2, boxShadow: 1, padding: 2, border: "2px solid #b0bec5"} }>
            <CardHeader
              title={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title || "Titre non disponible"}</Typography>}
            />
            <CardActions>
              <Button size="small" startIcon={<EditIcon />} onClick={handleUpdateClick}> </Button>
              <Button size="small" startIcon={<DeleteIcon />} onClick={handleDeleteClick}></Button>
            </CardActions>
          </Box>
          
          <CardContent sx={{ border: "1px dashed #90a4ae", borderRadius: 1, mt: 2, padding: 2 }}>
            <Badge color="gray" sx={{ mr: 1, backgroundColor: "#f4f4f4", padding: '1px 8px', borderRadius: '8px' }}>
              Dates
            </Badge>
            <Typography variant="body2" mt={1}>
              Du {new Date(dateStart).toLocaleDateString("fr-FR")} au {new Date(dateEnd).toLocaleDateString("fr-FR")}
            </Typography>

            <Badge color="gray" sx={{ mr: 1, backgroundColor: "#f4f4f4", padding: '1px 8px', borderRadius: '8px', mt: 2 }}>
              Note
            </Badge>
            <Box display="flex" justifyContent="center" mt={1}>
              <ReactStars count={5} value={rating} size={24} half={true} edit={false} color2={"#ffd700"} color1={"#a9a9a9"} />
            </Box>

            <Badge color="gray" sx={{ mb: 1, backgroundColor: "#f4f4f4", padding: '1px 8px', borderRadius: '8px', mt: 2 }}>
              Commentaire
            </Badge>
            <Typography>{comment || "Aucun commentaire disponible"}</Typography>
          </CardContent>
        </Grid>

        {/* Right Section - Image Upload and Carousel */}
        <Grid item xs={12} md={6} sx={{ border: "1px solid #b0bec5", padding: 2 }}>
          <CardMedia>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-button"
              multiple
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="upload-button">
              <Button variant="contained" color="primary" component="span">
                Add Image
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
