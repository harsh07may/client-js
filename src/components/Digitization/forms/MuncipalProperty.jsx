import React from "react";
import { useState } from "react";
import axios from "axios";
import Spinner from "../../../assets/Spinner";
import Tick from "../../../assets/Tick";

const MuncipalProperty = () => {
  //data members
  const WardOptions = [
    { value: "", text: "Select a ward" },
    { value: "1", text: "1" },
    { value: "2", text: "2" },
    { value: "3", text: "3" },
    { value: "4", text: "4" },
    { value: "5", text: "5" },
    { value: "6", text: "6" },
    { value: "7", text: "7" },
    { value: "8", text: "8" },
    { value: "9", text: "9" },
  ];

  //States
  const [data, setData] = useState({
    title: "",
    ward: "",
    subdiv: "",
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInserted, setIsInserted] = useState(false);
  //Reset Form
  const resetFields = () => {
    setData({
      title: "",
      ward: "",
      subdiv: "",
      file: null,
    });
    setIsInserted(false);
  };
  //functions
  const handleFileChange = (event) => {
    const dataObjFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(dataObjFile);
    if (dataObjFile.type === "application/pdf") {
      console.log(dataObjFile);
      setData({ ...data, file: dataObjFile });
    } else console.log("File not pdf");
  };

  const handleChange = (event) => {
    const dataObj = event.target.value;
    setData({
      ...data,
      [event.target.name]: dataObj,
    });
  };
  //API Calls
  const handleSubmit = async (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append("file", data.file);
    setIsLoading(true);
    await axios
      .post("http://localhost:5000/api/v1/digitization/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.status == 200) {
          console.log("File Uploaded");
          console.log(res.data.storageLink);
          insertData(res.data.storageLink);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  };
  const insertData = async (fileLink) => {
    let jsonObject = {
      WardNo: data.ward,
      SubDivNo: data.subdiv,
      Title: data.title,
      FileLink: fileLink,
    };

    await axios
      .post("http://localhost:5000/api/v1/digitization/insert", jsonObject)
      .then((res) => {
        if (res.status == 200) {
          console.log("Data Inserted Successfully");
          setIsInserted(true);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <h1 className=" font-bold text-xl mb-2">MUNCIPAL PROPERTY RECORDS</h1>
      <form
        className="w-full"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex flex-row space-x-52 w-2/3">
          {/* <select
            value={data.ward}
            onChange={handleChange}
            name="ward"
            className="h-1/2  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {WardOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select> */}
          <input
            type="text"
            placeholder="Ward No."
            name="ward"
            value={data.ward}
            className="shadow appearance-none border-2 border-gray-500 placeholder-blue-500 rounded py-3 px-3 m-4 leading-tight"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Sub Div No."
            name="subdiv"
            value={data.subdiv}
            className="shadow appearance-none border-2 border-gray-500 placeholder-blue-500 rounded py-3 px-3 m-4 leading-tight"
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={data.title}
          className="block w-2/3 shadow appearance-none border-2 border-gray-500 placeholder-blue-500 rounded py-3 px-3 m-4 leading-tight"
          onChange={handleChange}
          required
        />

        <label
          className="block ml-2 text-blue-500 mt-5 font-bold"
          htmlFor="File"
        >
          Upload file:
        </label>
        <input
          className=" text-blue-500 file:mr-5 file:py-2 file:px-6 file:rounded file:border-0 file:text-sm file:font-bold
            file:bg-blue-500 file:text-blue-50
            hover:file:cursor-pointer m-4"
          type="file"
          name="file"
          onChange={handleFileChange}
          required
        />
        {isLoading && <Spinner />}
        {isInserted && <Tick />}
        <div className="flex flex-row justify-center space-x-52 w-2/3 mt-14">
          <input
            type="submit"
            value="Submit"
            className="inline-block m-4 px-8 py-2 text-white font-bold bg-blue-500 rounded hover:bg-blue-300"
          />
          <input
            type="reset"
            value="Reset"
            className="inline-block m-4 px-8 py-2 text-blue-500 font-bold border-2 border-blue-500 rounded hover:bg-blue-300 hover:text-white"
            onClick={resetFields}
          />
        </div>
      </form>
    </>
  );
};

export default MuncipalProperty;
