import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DesignVorlage.css';

export function PageRegistration() {
    return (
        <div className="background">
            <div className="container-frame">

            <div style={{ height: '300px' }}></div>


            <div className="input-group mb-3">
                

    
  <label className="input-group-text" htmlFor="inputGroupSelect01">Options</label>
  <select className="form-select" id="inputGroupSelect01">
    <option selected>Choose...</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
</div>

<div className="input-group mb-3">
  <select className="form-select" id="inputGroupSelect02">
    <option selected>Choose...</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
  <label className="input-group-text" htmlFor="inputGroupSelect02">Options</label>
</div>

<div className="input-group mb-3">
  <button className="btn btn-outline-secondary" type="button">Button</button>
  <select className="form-select" id="inputGroupSelect03" aria-label="Example select with button addon">
    <option selected>Choose...</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
</div>

<div className="input-group">
  <select className="form-select" id="inputGroupSelect04" aria-label="Example select with button addon">
    <option selected>Choose...</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
  <button className="btn btn-outline-secondary" type="button">Button</button>
</div>
<div style={{ height: '400px' }}></div>

            </div>

        </div>
    );
}
