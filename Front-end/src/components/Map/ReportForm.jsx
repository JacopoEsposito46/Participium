import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Form, Button, Alert, Dropdown } from "react-bootstrap";
import "../styles/ReportForm.css";
import API from "../../API/API";
import { getCategoryIcon } from "../../constants/categoryIcons";
import {
  MapPin,
  Type,
  AlignLeft,
  Camera,
  Image,
  X,
  Send,
  AlertTriangle,
  Wrench,
  UserX,
} from "lucide-react";

function ReportForm({ position, onFormSubmit: _onFormSubmit, onReportResult }) {
  // Form state management
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [citizenId, setCitizenId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const uploadedPhotosRef = useRef(uploadedPhotos);

  // Sync ref with state
  useEffect(() => {
    uploadedPhotosRef.current = uploadedPhotos;
  }, [uploadedPhotos]);

  useEffect(() => {
    // Load categories
    const loadCategories = async () => {
      try {
        const fetchedCategories = await API.getAllCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        console.error(err);
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  // Get citizen ID on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await API.getUserInfo();
        setCitizenId(user.profile.id);
      } catch (err) {
        console.error(err);
        setError("Error loading user information. Please login again.");
      }
    };
    fetchUserInfo();
  }, []);

  // Cleanup effect for object URLs
  useEffect(() => {
    return () => {
      uploadedPhotosRef.current.forEach((photo) => {
        if (photo.preview) {
          URL.revokeObjectURL(photo.preview);
        }
      });
    };
  }, []);

  /**
   * Handle photo file upload
   */
  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    // Check if adding new files would exceed the 3 photo limit
    if (uploadedPhotos.length + files.length > 3) {
      setError("You can upload a maximum of 3 photos.");
      return;
    }

    // Check if any file exceeds the size limit
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setError(
        `Some files exceed the 5 MB limit: ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    setUploadingPhotos(true);
    setError("");

    try {
      // Upload each file immediately
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadedFile = await API.uploadFile(formData);

        // Store file ID and create preview
        const newPhoto = {
          fileId: uploadedFile.fileId,
          filename: uploadedFile.filename,
          preview: URL.createObjectURL(file),
          size: uploadedFile.size,
        };

        setUploadedPhotos((prev) => [...prev, newPhoto]);
      }
    } catch (error) {
      setError(error.message || "Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhotos(false);
      event.target.value = ""; // Reset input to allow re-uploading same file
    }
  };

  /**
   * Remove a photo from the upload list and delete from temp storage
   */
  const handleRemovePhoto = async (indexToRemove, fileId) => {
    try {
      // Delete from backend temp storage
      await API.deleteTempFile(fileId);

      // Revoke object URL
      const photoToRemove = uploadedPhotos[indexToRemove];
      if (photoToRemove?.preview) {
        URL.revokeObjectURL(photoToRemove.preview);
      }

      // Remove from local state
      setUploadedPhotos((prevPhotos) =>
        prevPhotos.filter((_, index) => index !== indexToRemove)
      );
    } catch (error) {
      console.error("Failed to delete temp file:", error);
      // Still remove from UI even if backend delete fails
      const photoToRemove = uploadedPhotos[indexToRemove];
      if (photoToRemove?.preview) {
        URL.revokeObjectURL(photoToRemove.preview);
      }

      setUploadedPhotos((prevPhotos) =>
        prevPhotos.filter((_, index) => index !== indexToRemove)
      );
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Validate all required fields
    if (
      !position ||
      !title ||
      !description ||
      !categoryId ||
      uploadedPhotos.length === 0
    ) {
      setError("All fields are required.");
      return;
    }
    if (uploadedPhotos.length < 1 || uploadedPhotos.length > 3) {
      setError("You must upload between 1 and 3 photos.");
      return;
    }

    setLoading(true);

    try {
      // Prepare report data according to API specification
      const reportData = {
        isAnonymous,
        title,
        description,
        categoryId: Number.parseInt(categoryId), // Ensure categoryId is a number
        citizenId: Number.parseInt(citizenId),
        location: {
          latitude: position.lat,
          longitude: position.lng,
        },
        photoIds: uploadedPhotos.map((photo) => photo.fileId),
      };

      // Call API to create report
      await API.addNewReport(reportData);

      uploadedPhotos.forEach((photo) => {
        if (photo.preview) {
          URL.revokeObjectURL(photo.preview);
        }
      });

      // Reset form
      setTitle("");
      setDescription("");
      setCategoryId("");
      setUploadedPhotos([]);

      // Call the callback to handle success
      onReportResult(true, "Your report has been submitted successfully!");
    } catch (apiError) {
      // Call the callback to handle error
      onReportResult(
        false,
        apiError.message || "Error submitting the report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="report-form">
      {/* Error alert display */}
      {error && (
        <Alert
          variant="danger"
          className="report-form__error d-flex align-items-center gap-2"
        >
          <AlertTriangle size={18} />
          <span>{error}</span>
        </Alert>
      )}

      {/* Selected position display (read-only) */}
      <div className="report-form__section mb-4">
        <Form.Label className="report-form__label">
          <MapPin size={18} className="text-primary-blue me-2" />
          Location
        </Form.Label>
        <div className="report-form__location-card">
          {position ? (
            <>
              {position.address && (
                <div className="report-form__address mb-1">
                  {position.address}
                </div>
              )}
              <div className="report-form__coords">
                {`Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}`}
              </div>
            </>
          ) : (
            <span className="text-danger">Error: Position not found</span>
          )}
        </div>
      </div>

      {/* Anonymous toggle */}
      <Form.Group className="report-form__group">
        <div className="report-form__anonymous-toggle">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Form.Label className="report-form__label mb-1">
                <UserX size={18} className="text-primary-blue me-2" />
                Submit Anonymously
              </Form.Label>
              <div className="report-form__helper-text">
                Your name will not be visible to other users
              </div>
            </div>
            <Form.Check
              type="switch"
              id="anonymous-switch"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="custom-switch"
            />
          </div>
        </div>
      </Form.Group>

      {/* Title input field */}
      <Form.Group className="report-form__group" controlId="formTitle">
        <Form.Label className="report-form__label">
          <Type size={18} className="text-primary-blue me-2" />
          Title <span className="report-form__required">*</span>
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Brief title of the issue"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="report-form__input"
        />
      </Form.Group>

      {/* Description textarea */}
      <Form.Group className="report-form__group" controlId="formDescription">
        <Form.Label className="report-form__label">
          <AlignLeft size={18} className="text-primary-blue me-2" />
          Description <span className="report-form__required">*</span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Describe the issue in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="report-form__textarea"
        />
      </Form.Group>

      {/* Category selection dropdown */}
      <Form.Group className="report-form__group" controlId="formCategory">
        <Form.Label className="report-form__label">
          <span className="report-form__category-icon-wrapper me-2">
            {categoryId ? (
              getCategoryIcon(
                categories.find((c) => c.id === categoryId)?.name,
                18
              )
            ) : (
              <Wrench size={18} className="text-primary-blue" />
            )}
          </span>{" "}
          Category<span className="report-form__required">*</span>
        </Form.Label>
        <Dropdown className="w-100">
          <Dropdown.Toggle
            variant="light"
            id="category-dropdown"
            className="w-100 text-start d-flex align-items-center justify-content-between report-form__select"
          >
            {categoryId ? (
              <div className="d-flex align-items-center gap-2 text-dark-blue">
                <span className="fw-medium">
                  {categories.find((c) => c.id === categoryId)?.name}
                </span>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2 text-muted">
                <span>Select a category...</span>
              </div>
            )}
          </Dropdown.Toggle>
          <Dropdown.Menu className="w-100 report-form__category-menu shadow-sm">
            {categories.map((categorie) => (
              <Dropdown.Item
                key={categorie.id}
                onClick={() => setCategoryId(categorie.id)}
                active={categoryId === categorie.id}
                className="report-form__category-item"
              >
                <div className="d-flex align-items-center gap-2">
                  {getCategoryIcon(categorie.name, 18)}
                  <span>{categorie.name}</span>
                </div>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Form.Group>

      {/* Photo upload section */}
      <Form.Group className="report-form__group">
        <Form.Label className="report-form__label mb-2">
          <Camera size={18} className="text-primary-blue me-2" />
          Photos{" "}
          <span
            className="report-form__required text-muted fw-normal ms-auto"
            style={{ fontSize: "0.85rem" }}
          >
            (1 to 3 required)
          </span>
        </Form.Label>

        {/* Upload button and photo counter */}
        <div className="report-form__photo-actions">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            id="photo-upload-input"
            className="report-form__file-input-hidden"
            disabled={uploadedPhotos.length >= 3 || uploadingPhotos}
          />
          {uploadedPhotos.length < 3 && (
            <label
              htmlFor="photo-upload-input"
              className={`report-form__upload-btn ${uploadedPhotos.length >= 3 || uploadingPhotos ? "disabled" : ""}`}
            >
              {uploadingPhotos ? (
                <>Uploading...</>
              ) : (
                <>
                  <Image size={24} />
                  <span>Click to Upload Photos</span>
                </>
              )}
            </label>
          )}
        </div>

        {/* List of uploaded photos with preview and remove option */}
        {uploadedPhotos.length > 0 && (
          <div className="report-form__photo-grid">
            {uploadedPhotos.map((photo, index) => (
              <div key={photo.fileId} className="report-form__photo-card">
                <img
                  src={photo.preview}
                  alt={`Preview ${index + 1}`}
                  className="report-form__photo-preview"
                />
                <button
                  type="button"
                  className="report-form__remove-photo-btn"
                  onClick={() => handleRemovePhoto(index, photo.fileId)}
                  title="Remove photo"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Form.Group>

      {/* Submit button */}
      <Button
        variant="primary"
        type="submit"
        className="w-100 report-form__submit-btn d-flex align-items-center justify-content-center gap-2"
        disabled={loading || uploadingPhotos}
      >
        {loading ? (
          "Submitting..."
        ) : (
          <>
            <Send size={18} /> Submit Report
          </>
        )}
      </Button>
    </Form>
  );
}

ReportForm.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    address: PropTypes.string,
  }),
  onFormSubmit: PropTypes.func.isRequired,
  onReportResult: PropTypes.func.isRequired,
};

export default ReportForm;
