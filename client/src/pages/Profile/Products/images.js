import { Button, message, Upload } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import { EditProduct, UploadProductImage } from "../../../apicalls/products";

function Images({ selectedProduct, getData, setShowProductForm }) {
  const [showPreview = false, setShowPreview] = useState(true);
  const [images = [], setImages] = useState(selectedProduct.images);
  const [file = null, setFile] = useState(null);
  const dispatch = useDispatch();

  const upload = async () => {
    try {
      dispatch(SetLoader(true));
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", selectedProduct._id);
      const response = await UploadProductImage(formData);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        setImages([...images, response.data]);
        setShowPreview(false);
        setFile(null);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const deleteImage = async (image) => {
    try {
      dispatch(SetLoader(true));
      const updatedImagesArray = images.filter((img) => img!== image);
      const updatedProduct = {...selectedProduct, images : updatedImagesArray};

      const response = await EditProduct(selectedProduct._id, updatedProduct);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        setImages(updatedImagesArray);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  return (
    <div>
      <div className="flex mb-5 gap-5">
        {images.map((image) => {
          return (
            <div className="flex gap-2 border border-solid border-gray-500 p-2 rounded items-end">
              <img className=" h-20 w-20 object-cover" src={image} alt="" />
              <i
                className="ri-delete-bin-line cursor-pointer"
                onClick={() => {
                  deleteImage(image);
                }}
              ></i>
            </div>
          );
        })}
      </div>
      <Upload
        listType="picture"
        beforeUpload={() => false}
        onChange={(info) => {
          setFile(info.file);
          setShowPreview(true);
        }}
        showUploadList={showPreview}
      >
        <Button type="dashed">Upload Image</Button>
      </Upload>

      <div className="flex justify-end gap-5 mt-5">
        <Button type="default" onClick={() => setShowProductForm(false)}>
          Cancel
        </Button>

        <Button type="primary" disabled={!file} onClick={upload}>
          Upload
        </Button>
      </div>
    </div>
  );
}

export default Images;
