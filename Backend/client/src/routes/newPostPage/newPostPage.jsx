import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import 'quill/dist/quill.snow.css'; // ✅ correct CSS path for react-quill v2

import apiRequest from "../../lib/apiReq";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";


function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Validate required fields
    if (!inputs.title || !inputs.price || !inputs.address || !inputs.city ||
        !inputs.bedroom || !inputs.bathroom || !inputs.latitude || !inputs.longitude) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate images
    if (images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    try {
      console.log("Submitting new post:", {
        title: inputs.title,
        city: inputs.city,
        type: inputs.type,
        property: inputs.property
      });

      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });

      console.log("Post created successfully:", res.data);
      navigate("/list?city=" + inputs.city);
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.message || "Failed to create post. Please try again.");
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton">Add</button>
            {error && <span className="error-message">{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dnblrkycn",
            uploadPreset: "HomeNest",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;