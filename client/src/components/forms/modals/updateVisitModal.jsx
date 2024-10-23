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

export function UpdateVisitModal({ isOpen, onClose, visit, onUpdateVisit }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (visit) {
      setTitle(visit.title || "");
      setStartDate(visit.startDate ? new Date(visit.startDate) : null);
      setEndDate(visit.endDate ? new Date(visit.endDate) : null);
      setRating(Number(visit.rating) || 0);
      setComment(visit.comment || "");
    }
  }, [visit]);

  const handleSave = () => {
    if (!startDate || !endDate || endDate < startDate) {
      console.error("Invalid start or end date");
      return;
    }

    const visitDetails = {
      title,
      startDate,
      endDate,
      rating,
      comment,
    };
    console.log(visitDetails);
    onUpdateVisit(visitDetails);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Visit</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Title"
            variant="outlined"
            placeholder="Visit title"
            value={title}
            onChange={(e) => setTitle(e.target.value || "")}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Typography>Date Start</Typography>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Typography>Date End</Typography>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
            minDate={startDate}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Typography>Rating</Typography>
          <ReactStars
            count={5}
            size={24}
            value={rating}
            onChange={(newRating) => setRating(Number(newRating))}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Comment"
            variant="outlined"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value || "")}
            placeholder="Add a comment"
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

UpdateVisitModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  visit: PropTypes.object,
  onUpdateVisit: PropTypes.func.isRequired,
};
