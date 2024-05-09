import React, { useState } from "react";
import {
  MDBCol,
  MDBCollapse,
  MDBContainer,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";

export default function PageWorkerFAQ() {

  const [collapse7, setCollapse7] = useState(false);
  const [collapse8, setCollapse8] = useState(false);
  const [collapse9, setCollapse9] = useState(false);
  const [collapse10, setCollapse10] = useState(false);
  const [collapse11, setCollapse11] = useState(false);
  const [collapse12, setCollapse12] = useState(false);

  const toggleCollapse = (callback: any) => callback((prev: any) => !prev);

  return (
    <MDBContainer className="mt-5" style={{ maxWidth: "1000px" }}>

      <p className="mb-1 mt-3">With small icons</p>
      <MDBListGroup>
        <MDBListGroupItem
          tag="a"
          onClick={() => toggleCollapse(setCollapse7)}
          action
        >
          <MDBTypography tag="h5">
            <MDBIcon fas icon="question me-2" />
            Question 1
          </MDBTypography>
          <p className="mb-1">Short & concise version of the answer.</p>
          <small>
            <u>Learn more</u>
          </small>
          <MDBCollapse open={collapse7}>
           
          </MDBCollapse>
        </MDBListGroupItem>
        <MDBListGroupItem
          tag="a"
          action
          onClick={() => toggleCollapse(setCollapse8)}
        >
          <MDBTypography tag="h5">
            <MDBIcon fas icon="question-circle me-2" />
            Question 2
          </MDBTypography>
          <p className="mb-1">Short & concise version of the answer.</p>
          <small>
            <u>Learn more</u>
          </small>
          <MDBCollapse open={collapse8}>
            
          </MDBCollapse>
        </MDBListGroupItem>
        <MDBListGroupItem
          tag="a"
          action
          onClick={() => toggleCollapse(setCollapse9)}
        >
          <MDBTypography tag="h5">
            <MDBIcon far icon="question-circle me-2" />
            Question 3
          </MDBTypography>
          <p className="mb-1">Short & concise version of the answer.</p>
          <small>
            <u>Learn more</u>
          </small>
          <MDBCollapse open={collapse9}>
           
          </MDBCollapse>
        </MDBListGroupItem>
      </MDBListGroup>

      <p className="mb-1 mt-3">With large icons</p>
      <MDBListGroup>
        <MDBListGroupItem
          tag="a"
          onClick={() => toggleCollapse(setCollapse10)}
          action
        >
          <div className="d-flex w-100 justify-content-between">
            <MDBRow className="w-100">
              <MDBCol
                size="1"
                className="text-center d-flex align-items-center"
              >
                <MDBIcon fas iconmoney="-bill me-2" size="3x" />
              </MDBCol>
              <MDBCol size="10">
                <MDBTypography tag="h5">Question about price?</MDBTypography>
                <p className="mb-1">Short & concise version of the answer.</p>
                <small>
                  <u>Learn more</u>
                </small>
                <MDBCollapse open={collapse10}>
                  
                </MDBCollapse>
              </MDBCol>
            </MDBRow>
          </div>
        </MDBListGroupItem>
        <MDBListGroupItem
          tag="a"
          onClick={() => toggleCollapse(setCollapse11)}
          action
        >
          <div className="d-flex w-100 justify-content-between">
            <MDBRow className="w-100">
              <MDBCol
                size="1"
                className="text-center d-flex align-items-center"
              >
                <MDBIcon fas icon="user-cog me-2" size="3x" />
              </MDBCol>
              <MDBCol size="10">
                <MDBTypography tag="h5">Question about technical support?</MDBTypography>
                <p className="mb-1">Short & concise version of the answer.</p>
                <small>
                  <u>Learn more</u>
                </small>
                <MDBCollapse open={collapse11}>
                  
                </MDBCollapse>
              </MDBCol>
            </MDBRow>
          </div>
        </MDBListGroupItem>
      </MDBListGroup>
    </MDBContainer>
  );
}

export{};