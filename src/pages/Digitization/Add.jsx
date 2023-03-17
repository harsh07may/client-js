import React from "react";
import { useState } from "react";
import MunicipalProperty from "../../components/Digitization/forms/MunicipalProperty";
import HouseTax from "../../components/Digitization/forms/HouseTax";
import ConLisc from "../../components/Digitization/forms/ConstructionLicense";
import BirthRecords from "../../components/Digitization/forms/BirthRecords";
import "./Add.css";
import { Layout } from "antd";
const { Content, Header, Sider } = Layout;

const Add = () => {
  const [documentType, setDocumentType] = useState("Properties");
  const [selectedButtonId, setSelectedButtonId] = useState("1");

  const handleClick = (e, key) => {
    console.log(documentType + " " + selectedButtonId);
    setDocumentType(e.target.value);
    setSelectedButtonId(key);
  };

  return (
    <>
      <Layout
        style={{
          "margin-top": "2.5rem",
          // "flex-direction": "row",
        }}
      >
        <Sider theme="light" style={{ margin: "0 20px" }}>
          <button
            key="1"
            onClick={(e) => handleClick(e, 1)}
            value="Properties"
            //   className="bg-slate-400 rounded-lg m-2 p-6"
            className={selectedButtonId == "1" ? "btn" : "btn btn-selected"}
          >
            MUNCIPALITY PROPERTY RECORDS
          </button>
          <button
            key="2"
            onClick={(e) => handleClick(e, 2)}
            value="HouseTax"
            className={selectedButtonId == "2" ? "btn" : "btn btn-selected"}
          >
            HOUSE TAX RECORDS
          </button>
          <button
            key="3"
            onClick={(e) => handleClick(e, 3)}
            value="ConLisc"
            className={selectedButtonId == "3" ? "btn" : "btn btn-selected"}
          >
            CONSTRUCTION LICENSES
          </button>
          <button
            key="4"
            onClick={(e) => handleClick(e, 4)}
            value="BirthRecords"
            className={selectedButtonId == "4" ? "btn" : "btn btn-selected"}
          >
            BIRTH RECORDS
          </button>
        </Sider>
        <Content
          // theme="light"
          style={{ margin: "20px 1.25rem", padding: "0 20px" }}
        >
          {documentType == "Properties" && <MunicipalProperty />}
          {documentType == "HouseTax" && <HouseTax />}
          {documentType == "ConLisc" && <ConLisc />}
          {documentType == "BirthRecords" && <BirthRecords />}
        </Content>
      </Layout>
    </>
  );
};

export default Add;
