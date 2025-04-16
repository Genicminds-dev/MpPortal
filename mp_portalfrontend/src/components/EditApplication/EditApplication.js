import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { useParams } from "react-router-dom";
import api from "../../api";
import { AiOutlineCalendar } from "react-icons/ai";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import HeaderAdmin from "../HeaderAdmin/HeaderAdmin";
// import Sidebar from "../Sidebar/Sidebar";
// import FooterAdmin from "../FooterAdmin/FooterAdmin";
import Swal from "sweetalert2";

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const EditApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grievance, setGrievance] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [booths, setBooths] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [senders, setSenders] = useState([]);
  const [status, setStatus] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGrievance();
    fetchSubjects();
    fetchBooths();
    fetchAssistants();
    fetchSenders();
    fetchStatus();
    fetchTalukas();
    fetchGroups();
    //eslint-disable-next-line
  }, [id]);

  const fetchGrievance = async () => {
    try {
      const response = await api.get(`/grievances/${id}`);
      const grievanceData = response.data;
      grievanceData.date = formatDate(grievanceData.date);
      setGrievance(grievanceData);
    } catch (err) {
      setError("Failed to fetch grievance data");
    } finally {
      setLoading(false);
    }
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

  const handleUpdate = async () => {
    try {
      const updatedGrievance = {
        ...grievance,
        subject: grievance.subject,
        fullName: grievance.fullName,
        mobileNo: grievance.mobileNo,
        boothNo: grievance.boothNo,
        handledBy: grievance.handledBy,
        complaintSentTo: grievance.complaintSentTo,
        date: formatDate(grievance.date),
        applicationStatus: grievance.applicationStatus,
        district: grievance.district,
        taluka: grievance.taluka,
        village: grievance.village,
        city: grievance.city,
        pincode: grievance.pincode,
        whatsappGroup: grievance.whatsappGroup,
        remark: grievance.remark,
      };

      await api.put(`/grievances/${id}`, updatedGrievance);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Grievance updated successfully!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        console.error("Alert closed");
      });
      navigate("/all-grievance-list");
    } catch (err) {
      console.error("Error updating grievance:", err);
      alert("Failed to update grievance");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!grievance) {
    return <div>No grievance data found</div>;
  }
  return (
    <>
      {/* <HeaderAdmin /> */}
      {/* <Sidebar /> */}
      <div class="main-content app-content">
        <div class="container-fluid">
          <div class="d-flex align-items-center justify-content-between page-header-breadcrumb flex-wrap gap-2">
            <div>
              <nav>
                <ol class="breadcrumb mb-1">
                  <li class="breadcrumb-item">
                    <Link to="/dashboard">Home</Link>{" "}
                  </li>
                  <HiOutlineArrowNarrowRight className="mx-2 align-self-center" />
                  <li class="breadcrumb-item active" aria-current="page">
                    Edit Grievance
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div class="row">
            <div class="col-xl-12">
              <div class="card custom-card">
                <div class="card-header justify-content-between">
                  <div class="card-title fs-5">{grievance.inwardNo}</div>
                </div>
                <div class="card-body">
                  <div class="row gy-3">
                    <div class="col-xl-3 col-md-6">
                      <label for="input-rounded" class="form-label">
                        Subject <span class="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={grievance.subject}
                        onChange={(e) =>
                          setGrievance({
                            ...grievance,
                            subject: e.target.value,
                          })
                        }
                      >
                        <option>Select PA</option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.subject_name}>
                            {subject.subject_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div class="col-xl-3 col-md-6">
                      <label for="input-rounded" class="form-label">
                        Full Name <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={grievance.fullName}
                        onChange={(e) =>
                          setGrievance({
                            ...grievance,
                            fullName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div class="col-xl-3 col-md-6">
                      <label for="input-rounded" class="form-label">
                        Mobile No. <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={grievance.mobileNo}
                        onChange={(e) =>
                          setGrievance({
                            ...grievance,
                            mobileNo: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div class="col-xl-3 col-md-6">
                      <label for="input-rounded" class="form-label">
                        Booth No. <span class="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={grievance.boothNo}
                        onChange={(e) =>
                          setGrievance({
                            ...grievance,
                            boothNo: e.target.value,
                          })
                        }
                      >
                        <option>Select Booth No.</option>
                        {booths.map((booth) => (
                          <option key={booth.id} value={booth.booth_no}>
                            {booth.booth_no}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div class="col-xl-3 col-md-6">
                      <label for="input-rounded" class="form-label">
                        Handled by <span class="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={grievance.handledBy}
                        onChange={(e) =>
                          setGrievance({
                            ...grievance,
                            handledBy: e.target.value,
                          })
                        }
                      >
                        <option>Select PA</option>
                        {assistants.map((assistant) => (
                          <option key={assistant.id} value={assistant.name}>
                            {assistant.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div class="col-xl-3 col-md-6">
                      <label for="input-rounded" class="form-label">
                        Complaint Send to <span class="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={grievance.complaintSentTo}
                        onChange={(e) =>
                          setGrievance({
                            ...grievance,
                            complaintSentTo: e.target.value,
                          })
                        }
                      >
                        <option>Select Sender</option>
                        {senders.map((sender) => (
                          <option key={sender.id} value={sender.sender}>
                            {sender.sender}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-xl-3 col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          Entry Date <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <div className="input-group-text text-muted">
                            <AiOutlineCalendar size={15} />
                          </div>
                          <ReactDatePicker
                            selected={
                              grievance.date ? new Date(grievance.date) : null
                            }
                            dateFormat="dd-MM-yyyy"
                            onChange={(date) =>
                              setGrievance({ ...grievance, date: date })
                            }
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="col-xl-3 col-md-6">
                      <label for="input-rounded" class="form-label">
                        Application Status <span class="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={grievance.applicationStatus}
                        onChange={(e) =>
                          setGrievance({
                            ...grievance,
                            applicationStatus: e.target.value,
                          })
                        }
                      >
                        <option>Select Status</option>
                        {status.map((status) => (
                          <option key={status.id} value={status.status}>
                            {status.status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div class="col-xl-3 col-md-6">
                      <label for="input-rounded" class="form-label">
                        Disctrict <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={grievance.district}
                        onChange={(e) =>
                          setGrievance({
                            ...grievance,
                            district: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div class="col-xl-3 col-md-6">
                      <label for="input-rounded" class="form-label">
                        Taluka <span class="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={grievance.taluka}
                        onChange={(e) =>
                          setGrievance({ ...grievance, taluka: e.target.value })
                        }
                      >
                        <option>Select Taluka</option>
                        {talukas.map((taluka) => (
                          <option key={taluka.id} value={taluka.taluka_name}>
                            {taluka.taluka_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div class="col-xl-3 col-md-6">
                      <label for="input-rounded" class="form-label">
                        Village
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={grievance.village}
                        onChange={(e) =>
                          setGrievance({
                            ...grievance,
                            village: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div class="col-xl-3 col-md-6">
                      <label for="input-rounded" class="form-label">
                        City
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={grievance.city}
                        onChange={(e) =>
                          setGrievance({ ...grievance, city: e.target.value })
                        }
                      />
                    </div>
                    <div class="col-xl-3 col-md-6">
                      <label for="input-rounded" class="form-label">
                        Pincode
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={grievance.pincode}
                        onChange={(e) =>
                          setGrievance({
                            ...grievance,
                            pincode: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div class="col-xl-3 col-md-6">
                      <label for="input-rounded" class="form-label">
                        Whatsapp Group
                      </label>
                      <select
                        className="form-select"
                        value={grievance.whatsappGroup}
                        onChange={(e) =>
                          setGrievance({
                            ...grievance,
                            whatsappGroup: e.target.value,
                          })
                        }
                      >
                        <option>Select Group</option>
                        {groups.map((group) => (
                          <option key={group.id} value={group.group_name}>
                            {group.group_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div class="col-xl-6">
                      <label for="input-rounded" class="form-label">
                        Remark
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="input-rounded"
                        placeholder="Enter Remark"
                        value={grievance.remark}
                        onChange={(e) =>
                          setGrievance({ ...grievance, remark: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={handleUpdate}
                      className="btn btn-purple-gradient btn-wave waves-effect waves-light"
                    >
                      Update
                    </button>
                    <Link
                      to="/all-grievance-list"
                      className="btn btn-danger-gradient btn-wave waves-effect waves-light mx-1"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditApplication;
