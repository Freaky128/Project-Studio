import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "./Booking.css";



function Profile() {
  document.body.id = 'H';
  const navigate = useNavigate();
  const accountID=history.state.usr.accountDetails.accountID
  const userName=history.state.usr.accountDetails.username
  const customerName = history.state.usr.accountDetails.name
  const customerPoints = history.state.usr.accountDetails.points
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const [customer, setCustomer] = useState([]); // get customer 
  const [cusReservation, setCusReservation] = useState([]); // get customer's reservation
  
  useEffect(() => {
    fetch(`http://localhost:6060/customer/${accountID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch customer data for account ID: ${accountID}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setCustomer(data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, [accountID]);


  useEffect(() => {
    fetch(`http://localhost:6060/reservation/${customer.customerID}`)
    .then((response) => {
      if(!response.ok)
      {
        throw new Error (`Failed to fetch reservation data for customer ID: ${customer.customerID}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      setCusReservation(data); 
    })
    .catch((err) => {
      console.error(err.message);
    })
  },[customer.customerID])

  const openConfirmationModal = () => {
    setConfirmationModalOpen(true);
  };

  const closeConfirmationModal = (e) => {
    e.preventDefault();
    setConfirmationModalOpen(false);
  };

  const handleDeleteAccount = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:6060/account/${accountID}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        console.log('Deleted successfully');
        navigate(`/login`);
      } else {
        throw new Error(`Failed to delete account: ${response.status} - ${response.statusText}`);
      }
      console.log(response)
      const responseBody = await response.json();
      console.log(responseBody)
    } catch (error) {
      console.error(error.message);
    }
  };
  


  useEffect(() => {
    console.log("user", history.state.usr)
    console.log("accountID:", accountID);
    console.log("user name:", userName);
    if(history.state.usr === undefined) {
        console.log("got here");
        navigate(`/`);
    }
  }, [history.state.usr]);

  return (
    <>
      <div>
      <h1 style={{ color: "white", textAlign: "center", fontFamily: "Arial" }}>
      Welcome back, {customerName}! You have achieved {customerPoints} points!
      </h1>
    
      {(history.state.usr.currentTier != undefined) && <div>You're in tier {history.state.usr.currentTier.tierName}</div>}
      <div className="container g-2">
        <div className="row justify-content-md-evenly"> 
          <div className="col-8">
            {cusReservation.length > 0 ?
              (<div>
                <h3>Your upcomming booking</h3>
                <table class="table table-dark">
                    <thead>
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Number of guests</th>
                        <th scope="col">Restaurant</th>
                        <th scope="col">Time</th>
                        <th scope="col">Banquet</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>1</td>
                        <td>ABC</td>
                        <td>2pm</td>
                        <td>Yes</td>
                      </tr>
                    </tbody>
              </table>
            </div>)
            :(<div>
              <h3>You dont have any booking currently !</h3>
            </div>) 
            }
          </div>
        </div>
      </div>
      <button onClick={openConfirmationModal} className="btn btn-danger mt-2">Delete Account</button>

      {/* Delete Account Confirmation Modal */}
      {/* {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Account Deletion</h3>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <button onClick={handleDeleteAccount} className="btn btn-danger">Delete</button>
            <button onClick={closeDeleteModal} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      )} */}
      </div>
      <Modal
          isOpen={isConfirmationModalOpen}
          onRequestClose={closeConfirmationModal}
          contentLabel="Confirmation Modal"
          style={{
            overlay: {
              position: "fixed",
              zIndex: 1020,
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(255, 255, 255, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            content: {
              background: "white",
              width: "45rem",
              maxWidth: "calc(100vw - 2rem)",
              maxHeight: "calc(100vh - 2rem)",
              overflowY: "auto",
              position: "relative",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
            },
          }}
        >
          <div class="modal-dialog modal-confirm">
            <div class="modal-content">
              <div class="modal-header">
                <div class="icon-box">
                  <i class="material-icons">&#xE876;</i>
                </div>
                <h2 class="modal-title w-100">
                  Are you sure to delete this account?
                </h2>
              </div>
              <hr />
              <h3 style={{fontSize:20,fontWeight:5}}>This account will be deleted immediately.You can not undo this action.</h3>
              <div class="modal-footer">
                <button
                  class="btn btn-success btn-block"
                  data-dismiss="modal"
                  onClick={closeConfirmationModal}
                >
                  Cancel
                </button>
                <button
                  class="btn btn-success btn-block"
                  data-dismiss="modal"
                  onClick={handleDeleteAccount}
                >
                  Delete
                </button>
              </div>
              
            </div>
          </div>
        </Modal>
      
    </>
  );
}

export default Profile;