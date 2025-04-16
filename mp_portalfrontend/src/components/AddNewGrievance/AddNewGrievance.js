import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api";
import "flatpickr/dist/flatpickr.css";
import "./AddNewGrievance.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddNewGrievance = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [booths, setBooths] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [senders, setSenders] = useState([]);
  const [status, setStatus] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    inwardNo: "",
    subject: "",
    fullName: "",
    mobileNo: "",
    boothNo: "",
    handledBy: "",
    complaintSentTo: "",
    date: "",
    applicationStatus: "",
    district: "",
    taluka: "",
    village: "",
    city: "",
    pincode: "",
    whatsappGroup: "",
    remark: "",
  });

  const [Error, setError] = useState({
    inwardNo: "",
    subject: "",
    fullName: "",
    mobileNo: "",
    boothNo: "",
    handledBy: "",
    complaintSentTo: "",
    date: "",
    applicationStatus: "",
    district: "",
    taluka: "",
    village: "",
    city: "",
    pincode: "",
    whatsappGroup: "",
    remark: "",
  });

  const validateForm = () => {
    const newError = {
      inwardNo: "",
      subject: "",
      fullName: "",
      mobileNo: "",
      boothNo: "",
      handledBy: "",
      complaintSentTo: "",
      date: "",
      applicationStatus: "",
      district: "",
      taluka: "",
      village: "",
      city: "",
      pincode: "",
      whatsappGroup: "",
      remark: "",
    };
    let isValid = true;

    if (!formData.inwardNo.trim()) {
      newError.inwardNo = "*Inward number is required";
      isValid = false;
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d/-]+$/.test(formData.inwardNo)
    ) {
      newError.inwardNo =
        "*Inward number must contain both letters and numbers, and can include '/' and '-'";
      isValid = false;
    }

    if (!formData.subject) {
      newError.subject = "*Subject is required";
      isValid = false;
    }

    if (!formData.fullName) {
      newError.fullName = "*Full name is required";
      isValid = false;
    }

    if (!formData.boothNo) {
      newError.boothNo = "*BoothNo is required";
      isValid = false;
    }

    if (!formData.handledBy) {
      newError.handledBy = "*This field is required";
      isValid = false;
    }

    if (!formData.complaintSentTo) {
      newError.complaintSentTo = "*Complaint is required";
      isValid = false;
    }

    if (!formData.applicationStatus) {
      newError.applicationStatus = "*Application Status is required";
      isValid = false;
    }

    if (!formData.district) {
      newError.district = "*District is required";
      isValid = false;
    }
    if (!formData.taluka) {
      newError.taluka = "*Taluka is required";
      isValid = false;
    }

    if (!formData.village) {
      newError.village = "*Village is required";
      isValid = false;
    }

    if (!formData.city) {
      newError.city = "*City is required";
      isValid = false;
    }

    if (!formData.pincode) {
      newError.pincode = "*Pinocde is required";
      isValid = false;
    }

    if (!formData.whatsappGroup) {
      newError.whatsappGroup = "*This is required";
      isValid = false;
    }

    if (!formData.remark) {
      newError.remark = "*Remark is required";
      isValid = false;
    }

    const mobilePattern = /^[0-9]{10}$/;
    if (!formData.mobileNo) {
      newError.mobileNo = "*Mobile number is required.";
      isValid = false;
    } else if (!mobilePattern.test(formData.mobileNo)) {
      newError.mobileNo = "*Mobile number must be 10 digits.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };
  const handleFocus = (field) => {
    setError((prevError) => ({ ...prevError, [field]: "" }));
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchBooths = async () => {
    try {
      const response = await api.get("/booths");
      setBooths(response.data);
    } catch (error) {
      console.error("Error fetching booths:", error);
    }
  };

  const fetchAssistants = async () => {
    try {
      const response = await api.get("/personal_assistants");
      setAssistants(response.data);
    } catch (error) {
      console.error("Error fetching assistants:", error);
    }
  };

  const fetchSenders = async () => {
    try {
      const response = await api.get("/complaint_senders");
      setSenders(response.data);
    } catch (error) {
      console.error("Error fetching senders:", error);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await api.get("/application_status");
      setStatus(response.data);
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  const fetchTalukas = async () => {
    try {
      const response = await api.get("/talukas");
      setTalukas(response.data);
    } catch (error) {
      console.error("Error fetching talukas:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await api.get("/whatsapp_groups");
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchBooths();
    fetchAssistants();
    fetchSenders();
    fetchStatus();
    fetchTalukas();
    fetchGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newError = {};

    const alphaRegex = /^[A-Za-z\s]*$/;

    if (name === "inwardNo") {
      setFormData({ ...formData, [name]: value });

      if (value.trim() !== "") {
        newError[name] = "";
      } else {
        newError[name] = "*Inward number cannot be empty";
      }
    }
    if (name === "date") {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        setFormData({ ...formData, [name]: value });
      }
    }

    if (
      name === "fullName" ||
      name === "subject" ||
      name === "handledBy" ||
      name === "complaintSentTo" ||
      name === "district" ||
      name === "taluka" ||
      name === "village" ||
      name === "city" ||
      name === "whatsappGroup" ||
      name === "applicationStatus" ||
      name === "remark"
    ) {
      if (alphaRegex.test(value) || value === "") {
        setFormData({ ...formData, [name]: value });
        newError[name] = "";
      } else {
        newError[name] = `*Only alphabets are allowed for ${name}`;
      }
    } else if (
      name === "mobileNo" ||
      name === "pincode" ||
      name === "boothNo"
    ) {
      if (/^[0-9]*$/.test(value) || value === "") {
        setFormData({ ...formData, [name]: value });
        newError[name] = "";
      } else {
        newError[name] = `*Only numbers are allowed for ${name}`;
      }
    }
    setError((prevError) => ({ ...prevError, ...newError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!formData.date) {
      formData.date = new Date().toISOString().split("T")[0];
    }

    try {
      // eslint-disable-next-line
      const response = await api.post("/grievances", formData);
      const notificationData = {
        heading: "Added New Entry",
        description: `Added new grievance ${formData.inwardNo}`,
        readed: 0,
      };

      await api.post("/notification", notificationData);
      navigate("/all-grievance-list");

      setFormData({
        inwardNo: "",
        subject: "",
        fullName: "",
        mobileNo: "",
        boothNo: "",
        handledBy: "",
        complaintSentTo: "",
        date: "",
        applicationStatus: "",
        district: "",
        taluka: "",
        village: "",
        city: "",
        pincode: "",
        whatsappGroup: "",
        remark: "",
      });
    } catch (error) {
      console.error("Error adding grievances:", error);
      alert("Error adding grievance, please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      inwardNo: "",
      subject: "",
      fullName: "",
      mobileNo: "",
      boothNo: "",
      handledBy: "",
      complaintSentTo: "",
      date: "",
      applicationStatus: "",
      district: "",
      taluka: "",
      village: "",
      city: "",
      pincode: "",
      whatsappGroup: "",
      remark: "",
    });
  };
  const [selectedDate, setSelectedDate] = useState(null);
  return (
    <>
      <div class="main-content app-content">
        <div class="container-fluid">
          <div class="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
            <div>
              <nav>
                <ol class="breadcrumb mb-1">
                  <li class="breadcrumb-item">
                    <Link to="/dashboard">Home</Link>
                  </li>
                  <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                  <li class="breadcrumb-item active" aria-current="page">
                    Add New Grievance
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div class="row">
            <div class="col-xl-12">
              <div class="card custom-card">
                <div class="card-header justify-content-between">
                  <div class="card-title fs-5">New Application Data Entry</div>
                  <div class="prism-toggle"></div>
                </div>
                <div class="card-body">
                  <form onSubmit={handleSubmit} autocomplete="off">
                    <div class="row gy-3">
                      <div class="col-xl-6 col-md-6">
                        {" "}
                        <label className="form-label">
                          Inward No. <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="input-rounded"
                          name="inwardNo"
                          value={formData.inwardNo}
                          onChange={handleChange}
                          placeholder="IN/0001/23-8-24"
                          onFocus={() => handleFocus("inwardNo")}
                        />
                        {Error.inwardNo && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.inwardNo}
                          </p>
                        )}
                      </div>
                      <div className="col-xl-6 col-md-6">
                        <label htmlFor="subject-select" className="form-label">
                          Subject <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="subject-select"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => handleFocus("subject")}
                        >
                          <option selected>Select Subject</option>
                          {subjects.map((subject, index) => (
                            <option key={index} value={subject.subject_name}>
                              {subject.subject_name}
                            </option>
                          ))}
                        </select>
                        {Error.subject && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.subject}
                          </p>
                        )}
                      </div>
                      <div class="col-xl-6 col-md-6">
                        <label for="input-rounded" class="form-label">
                          Full Name <span class="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="input-rounded"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter Full Name"
                          onFocus={() => handleFocus("fullName")}
                        />
                        {Error.fullName && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.fullName}
                          </p>
                        )}
                      </div>
                      <div class="col-xl-6 col-md-6">
                        <label for="input-rounded" class="form-label">
                          Mobile No. <span class="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          maxLength={10}
                          id="input-rounded"
                          name="mobileNo"
                          value={formData.mobileNo}
                          onChange={handleChange}
                          placeholder="Enter Mobile No."
                          onFocus={() => handleFocus("mobileNo")}
                        />
                        {Error.mobileNo && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.mobileNo}
                          </p>
                        )}
                      </div>
                      <div className="col-xl-6 col-md-6">
                        <label htmlFor="booth-select" className="form-label">
                          Booth No. <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="booth-select"
                          name="boothNo"
                          value={formData.boothNo}
                          onChange={handleChange}
                          onFocus={() => handleFocus("boothNo")}
                        >
                          <option selected>Select Booth No.</option>
                          {booths.map((booth, index) => (
                            <option key={index} value={booth.booth_no}>
                              {booth.booth_no}
                            </option>
                          ))}
                        </select>
                        {Error.boothNo && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.boothNo}
                          </p>
                        )}
                      </div>
                      <div className="col-xl-6 col-md-6">
                        <label
                          htmlFor="assistant-select"
                          className="form-label"
                        >
                          Handled by <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="assistant-select"
                          name="handledBy"
                          value={formData.handledBy}
                          onChange={handleChange}
                          onFocus={() => handleFocus("handledBy")}
                        >
                          <option selected>Select Handler</option>
                          {assistants.map((assistant, index) => (
                            <option key={index} value={assistant.name}>
                              {assistant.name}
                            </option>
                          ))}
                        </select>
                        {Error.handledBy && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.handledBy}
                          </p>
                        )}
                      </div>
                      <div class="col-xl-4 col-md-6">
                        <label htmlFor="complaintSentTo" className="form-label">
                          Complaint Send to <span class="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="sender-select"
                          name="complaintSentTo"
                          value={formData.complaintSentTo}
                          onChange={handleChange}
                          onFocus={() => handleFocus("complaintSentTo")}
                        >
                          <option selected>Select Sender</option>
                          {senders.map((sender, index) => (
                            <option key={index} value={sender.sender}>
                              {sender.sender}
                            </option>
                          ))}
                        </select>
                        {Error.complaintSentTo && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.complaintSentTo}
                          </p>
                        )}
                      </div>
                      <div className="col-xl-4 col-md-4">
                        <div className="date-picker-wrapper">
                          <label
                            htmlFor="custom-datepicker"
                            className="form-label"
                          >
                            Date <span className="text-danger">*</span>
                          </label>
                          <DatePicker
                            id="custom-datepicker"
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="custom-date-picker"
                            placeholderText="Select a date"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                          />

                          {Error.date && (
                            <p style={{ color: "red", fontSize: "11px" }}>
                              {Error.date}
                            </p>
                          )}
                        </div>
                      </div>
                      <div class="col-xl-4 col-md-6">
                        <label htmlFor="applicationStatus" class="form-label">
                          Application Status <span class="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="status-select"
                          name="applicationStatus"
                          value={formData.applicationStatus}
                          onChange={handleChange}
                          onFocus={() => handleFocus("applicationStatus")}
                        >
                          <option selected>Select Status</option>
                          {status.map((status, index) => (
                            <option key={index} value={status.status}>
                              {status.status}
                            </option>
                          ))}
                        </select>
                        {Error.applicationStatus && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.applicationStatus}
                          </p>
                        )}
                      </div>

                      <div class="col-xl-4 col-md-6">
                        <label for="input-rounded" class="form-label">
                          Disctrict <span class="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="input-rounded"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          placeholder="Enter Disctrict"
                          onFocus={() => handleFocus("district")}
                        />
                        {Error.district && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.district}
                          </p>
                        )}
                      </div>
                      <div class="col-xl-4 col-md-6">
                        <label htmlFor="taluka" class="form-label">
                          Taluka <span class="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="taluka-select"
                          name="taluka"
                          value={formData.taluka}
                          onChange={handleChange}
                          onFocus={() => handleFocus("taluka")}
                        >
                          <option selected>Select Taluka</option>
                          {talukas.map((taluka, index) => (
                            <option key={index} value={taluka.taluka_name}>
                              {taluka.taluka_name}
                            </option>
                          ))}
                        </select>
                        {Error.taluka && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.taluka}
                          </p>
                        )}
                      </div>
                      <div class="col-xl-4 col-md-6">
                        <label for="input-rounded" class="form-label">
                          Village
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="input-rounded"
                          name="village"
                          value={formData.village}
                          onChange={handleChange}
                          placeholder="Enter Village"
                          onFocus={() => handleFocus("village")}
                        />
                        {Error.village && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.village}
                          </p>
                        )}
                      </div>
                      <div class="col-xl-2 col-md-6">
                        <label for="input-rounded" class="form-label">
                          City
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="input-rounded"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Enter city"
                          onFocus={() => handleFocus("city")}
                        />
                        {Error.city && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.city}
                          </p>
                        )}
                      </div>
                      <div class="col-xl-2 col-md-6">
                        <label for="input-rounded" class="form-label">
                          Pincode
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="input-rounded"
                          maxLength={6}
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="Enter Pincode"
                          onFocus={() => handleFocus("pincode")}
                        />
                        {Error.pincode && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.pincode}
                          </p>
                        )}
                      </div>
                      <div class="col-xl-2 col-md-6">
                        <label htmlFor="whatsappGroup" class="form-label">
                          Whatsapp Group
                        </label>
                        <select
                          className="form-select"
                          id="taluka-select"
                          name="whatsappGroup"
                          value={formData.whatsappGroup}
                          onChange={handleChange}
                          onFocus={() => handleFocus("whatsappGroup")}
                        >
                          <option selected>Select Whatsapp Group</option>
                          {groups.map((group, index) => (
                            <option key={index} value={group.group_name}>
                              {group.group_name}
                            </option>
                          ))}
                        </select>
                        {Error.whatsappGroup && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.whatsappGroup}
                          </p>
                        )}
                      </div>
                      <div class="col-xl-6">
                        <label for="input-rounded" class="form-label">
                          Remark
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="input-rounded"
                          name="remark"
                          value={formData.remark}
                          onChange={handleChange}
                          placeholder="Enter Remark"
                          onFocus={() => handleFocus("remark")}
                        />
                        {Error.remark && (
                          <p style={{ color: "red", fontSize: "11px" }}>
                            {Error.remark}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        to="#submit"
                        className="btn btn-purple-gradient btn-wave waves-effect waves-light"
                      >
                        Submit
                      </button>
                      <button
                        to="#cancel"
                        className="btn btn-danger-gradient btn-wave waves-effect waves-light mx-1"
                        onClick={resetForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewGrievance;
