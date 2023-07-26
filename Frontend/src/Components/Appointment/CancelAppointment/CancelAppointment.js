import React from "react";
import { useEffect, useState } from "react";
import { AppointmentRepo } from "../../../Repo/Appointment";
import { useNavigate } from "react-router-dom";

import {
  ListContainer,
  AppointmentCard,
  DoctorName,
  HospitalName,
  PatientName,
  AppointmentDateAndTime,
  Reshedular,
} from "./CancelAppointmentStyles";

const CancelAppointment = (props) => {
  const appointmentRepo = new AppointmentRepo();

  const [appointments, setAppointments] = useState([]);
  const [cancelClicked, setCancelClicked] = useState(false);
  const [appointmendId, setAppointmentId] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await appointmentRepo.getAppointments();
      if (res.length) {
        setAppointments(res);
      }
    })();
  }, []);

  const onCancelClick = (id) => {
    setAppointmentId(id);
    setCancelClicked(true);
  };

  const onConfirmClick = async () => {
    const res = await appointmentRepo.cancelAppointment(appointmendId);
    if (res === 200) {
      setSuccess(true);
      navigate(-2);
    }
  };

  return (
    <>
      {appointments.length === 0 && (
        <h3>You don't have any appointment to cancel !</h3>
      )}
      {!cancelClicked && appointments.length > 0 && (
        <div>
          <h3>Please select the appointment you want to cancel</h3>
          <ListContainer>
            {appointments.map((appointment) => {
              return (
                <AppointmentCard>
                  <HospitalName>Hospital : {appointment.hospital}</HospitalName>
                  <DoctorName>Doctor : {appointment.doctorName}</DoctorName>
                  <PatientName>
                    Patient Name : {appointment.patientName}
                  </PatientName>
                  <AppointmentDateAndTime>
                    Date : {appointment.appointmentDate}
                  </AppointmentDateAndTime>
                  <AppointmentDateAndTime>
                    Time : {appointment.appointmentTime}
                  </AppointmentDateAndTime>
                  <button onClick={() => onCancelClick(appointment._id)}>
                    Cancel
                  </button>
                </AppointmentCard>
              );
            })}
          </ListContainer>
        </div>
      )}
      {cancelClicked && (
        <>
          {!success && (
            <Reshedular>
              <h2 style={{ color: "red" }}>
                Are you sure to cancel appointment of {props.doctor.hospital}{" "}
                with doctor {props.doctor.name} ?
              </h2>
            </Reshedular>
          )}
          {!success && (
            <button onClick={() => onConfirmClick()}>Confirm</button>
          )}
        </>
      )}
      {success && (
        <h2 style={{ color: "green" }}>Appointment canceled successfully!</h2>
      )}
    </>
  );
};

export default CancelAppointment;
