import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactStars from "react-stars";
import { updateTrip, uploadImageToCloudinary } from "../../../api/tripApi";

export function UpdateTripModal({
  isOpen,
  onClose,
  onUpdateTrip,
  tripId,
  title: initialTitle,
  photo: initialPhoto,
  startDate: initialStartDate,
  endDate: initialEndDate,
  rating: initialRating,
  description: initialDescription,
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [photo, setPhoto] = useState(initialPhoto || null);
  const [startDate, setStartDate] = useState(initialStartDate || null);
  const [endDate, setEndDate] = useState(initialEndDate || null);
  const [rating, setRating] = useState(initialRating || 3);
  const [description, setDescription] = useState(initialDescription || "");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  // Reset fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle || "");
      setPhoto(initialPhoto || null);
      setStartDate(initialStartDate || null);
      setEndDate(initialEndDate || null);
      setRating(Number(initialRating) || 3);
      setDescription(initialDescription || "");
      setImageFile(null);
      setError(null);
    }
  }, [isOpen, initialTitle, initialPhoto, initialStartDate, initialEndDate, initialRating, initialDescription]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        console.error("Invalid file type:", file.type);
        setError("Please upload an image (JPEG, PNG, GIF).");
        return;
      }
      setPhoto(URL.createObjectURL(file));
      setImageFile(file);
      setError(null);
      console.log("Selected image file:", file);
    } else {
      setError("No file selected");
    }
  };

  const handleSave = async () => {
    setError(null);

    if (!title || !startDate || !endDate || !description || !imageFile) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      // Convert dates to ISO format
      const isoStartDate = startDate ? new Date(startDate).toISOString() : null;
      const isoEndDate = endDate ? new Date(endDate).toISOString() : null;

      // Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(imageFile);

      const tripUpdateDetails = {
        title,
        photo: imageUrl,
        dateStart: isoStartDate,
        dateEnd: isoEndDate,
        rating: Number(rating),
        description,
      };

      // Send update to API
      const updatedTripData = await updateTrip(tripId, tripUpdateDetails);

      if (updatedTripData) {
        onUpdateTrip(updatedTripData);
        onClose();
      } else {
        console.error("Updated data not available after update.");
      }
    } catch (error) {
      console.error("Error updating trip:", error);
      setError("An error occurred while updating the trip.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Trip</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}
        <FormControl fullWidth margin="normal" error={!!error}>
          <TextField
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <input type="file" onChange={handlePhotoUpload} />
          <FormHelperText>Upload an image (JPEG, PNG, GIF)</FormHelperText>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <Typography>Date Start</Typography>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              if (endDate && date > endDate) {
                setEndDate(null); // Reset endDate if startDate changes
              }
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a start date"
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Typography>Date End</Typography>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select an end date"
            minDate={startDate} // Prevent selecting dates before startDate
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Typography>Rating</Typography>
          <ReactStars
            count={5}
            size={24}
            value={rating}
            onChange={(newRating) => setRating(newRating)}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Comment"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UpdateTripModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateTrip: PropTypes.func.isRequired,
  tripId: PropTypes.number.isRequired,
  title: PropTypes.string,
  photo: PropTypes.string,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  rating: PropTypes.number,
  description: PropTypes.string,
};
