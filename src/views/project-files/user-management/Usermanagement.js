import React, { useState, useEffect} from "react";
import styles from "./userManagement.module.css";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CForm,
  CFormLabel,
  CFormSelect,

  CCard,
  CCardBody,
  CCardHeader,
} from "@coreui/react";
import { useSelector } from "react-redux";
import RouteURL from "../../../apis/ApiURL";
import Service from "../../../apis/Service";
import { ToastContainer, toast } from 'react-toastify';
import { Constants, REGEX, ERROR_MESSAGE } from "../../../apis/Constant";
import { setTimeout } from "core-js";


const UserRoleManagement = () => {
  const [visible, setVisible] = useState(false);
  const token = useSelector((state) => state.user.token);
  const [roleList, setRoleList] = useState([])
  const [AdminRole, setAdminRole]=useState([])//get_all_role_by_admin
  const [statusFilter, setStatusFilter] = useState("All");
  const [updateVisible, setUpdateVisible] = useState(false);
 
  //!SECTION
  const [updateAdmin, setUpdateAdmin] = useState({
   
  })
  const [newAdmin , setNewAdmin]=useState({})


  
  const filteredUsers = AdminRole.filter((u) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Active") return u.status === 'active';
    if (statusFilter === "Inactive") return u.status === 'inactive';
    return true;
  });

  const FetchRoleListDetails = () => {
         
  
          Service.apiGetCallRequest(RouteURL.get_all_role,token)
              .then((res) => {
  
  
                  if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
  
                      setRoleList(res.data.roles)
                     
  
                  } else {
                      toast.error(res.message, {
                          position: 'bottom-right',
                          autoClose: false,
                      });
                     
                  }
              })
              .catch((error) => {
                  toast.error(error?.response?.message || 'unable to fetch role list', {
                      position: 'bottom-right',
                      autoClose: false,
                  });
  
              });
  }

  const FetchRoleByAdmin = () => {
         
  
          Service.apiGetCallRequest(RouteURL.get_all_role_by_admin,token)
              .then((res) => {
  
  
                  if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
  
                      setAdminRole(res.data.roles)
                     
  
                  } else {
                      toast.error(res.message, {
                          position: 'bottom-right',
                          autoClose: false,
                      });
                     
                  }
              })
              .catch((error) => {
                  toast.error(error?.response?.message || 'unable to fetch role list', {
                      position: 'bottom-right',
                      autoClose: false,
                  });
  
              });
  }

  const UpdateAdminToServer = (e) => {
    e?.preventDefault()

    

   console.log(updateAdmin, "update admin")
     let params = JSON.stringify({
       admin_id: updateAdmin.admin_id,
       role_id: updateAdmin.role_id,
       contact: updateAdmin.contact,
       email: updateAdmin.email,
       username: updateAdmin.username,
       password: updateAdmin.password,
       status: updateAdmin.admin_status,
       admin_name: updateAdmin.admin_name
      })

        Service.apiPostCallRequest(RouteURL.update_admin, params, token)
          .then((res) => {
            setUpdateVisible(false)
            
            FetchRoleListDetails()
            FetchRoleByAdmin()
              toast.success(res.message, {
                    position: 'bottom-right',
                    autoClose: false,
              });
             //setUpdateAdmin({})
            })
            .catch((error) => {
                toast.error(error?.response?.message || 'unable to update role', {
                    position: 'bottom-right',
                    autoClose: false,
                });

            });
  }
  const addAdminToServer = (e) => {
     e.preventDefault()
     let params = JSON.stringify({
          admin_id: newAdmin.admin_id,
       role_id: newAdmin.role_id,
       contact: newAdmin.contact,
       email: newAdmin.email,
       username: newAdmin.username,
       password: newAdmin.password,
       status: "active",
       admin_name: newAdmin.admin_name
        })

    
        Service.apiPostCallRequest(RouteURL.create_admin, params, token)
          .then((res) => {
              
            setVisible(false);
            FetchRoleListDetails()
            FetchRoleByAdmin()
            setNewAdmin({})
              toast.success(res.message, {
                    position: 'bottom-right',
                    autoClose: false,
                });
            })
            .catch((error) => {
                toast.error(error?.response?.message || 'unable to add role', {
                    position: 'bottom-right',
                    autoClose: false,
                });

            });
  }
 const UpdateAdminToServerByStatus = (param) => {


    

   console.log(param, "update admin status")
     let params = JSON.stringify({
       admin_id: param.admin_id,
       role_id: param.role_id,
       contact: param.contact,
       email: param.email,
       username: param.username,
       password: param.password,
       status: param.admin_status,
       admin_name: param.admin_name
      })

        Service.apiPostCallRequest(RouteURL.update_admin, params, token)
          .then((res) => {
           
            
            FetchRoleListDetails()
            FetchRoleByAdmin()
              toast.success(res.message, {
                    position: 'bottom-right',
                    autoClose: false,
              });
            
            })
            .catch((error) => {
                toast.error(error?.response?.message || 'unable to update role', {
                    position: 'bottom-right',
                    autoClose: false,
                });

            });
  }

  

  //console.log(roleList, "roleList")
  useEffect(() => {
    FetchRoleListDetails();
    FetchRoleByAdmin()
  }, [])
  console.log(updateAdmin, "update", AdminRole)
  return (
    <div className={styles.container}>
       <ToastContainer />
      <div className={styles.filter}>
        <div>
           <label>Status</label>
        <select className={styles.select}  value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        </div>
        <CButton color="primary"  onClick={() => setVisible(true)}>
          Add User
          </CButton>

       
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ACTION</th>
            <th>ADMIN NAME</th>
            <th>USERNAME</th>
            <th>ROLE NAME</th>
            <th>CONTACT</th>
            <th>EMAIL</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.admin_id}>
              <td>
                {/* <button className={styles.iconBtn}>🔑</button> */}
                <button className={styles.deleteBtn} onClick={()=>{}}><i className="fa fa-trash-o"></i></button>
                <button className={styles.editBtn} onClick={() => {
                  
                  setUpdateVisible(true)
                  setVisible(false)
                  setUpdateAdmin({...u})
                }}><i className="fa fa-edit"></i></button>
              </td>
              <td>{u.admin_name}</td>
              <td>{u.username}</td>
              <td>{u.role_name}</td>
              <td>{u.contact}</td>
              <td>{u.email}</td>
              <td>
                <span className={u.admin_status === 'active'? styles.statusLabelSuccess : styles.statusLabelDanger }>{u.admin_status }</span>
                <label className={styles.switch}>
                  <input type="checkbox" defaultChecked={u.admin_status ? true : false} onChange={(e) => {
                    let admin_status = e.target.checked ? 'active' : 'inactive';
                    console.log(admin_status, "value")
                    
                    UpdateAdminToServerByStatus( {...u, admin_status})
                    
                 
                  }}/>
                  <span className={styles.slider}></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      
      <CModal visible={visible} onClose={() => setVisible(false)}>
       <CCard className="mb-4">
      <CCardHeader>
        <strong>Create Admin</strong>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <div className="mb-3">
            <CFormLabel htmlFor="adminame">Admin Name *</CFormLabel>
                <CFormInput type="text" id="admin_name" placeholder="Enter admin name" onChange={(e) => {
                  
                  setNewAdmin((prev) => {
                    return {
                      ...prev,
                       admin_name: e.target.value
                    }
                  })
                 
                }}/>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="role_name">Role *</CFormLabel>
            <CFormSelect id="role" onChange={(e) => {
                  
                  setNewAdmin((prev) => {
                    return {
                      ...prev,
                       role_id: e.target.value
                    }
                  })
                 
                }}>
                  <option>Select role</option>
                  {roleList.map((r) => {
                    return <option value={r.role_id}>{r.role_name}</option>
                  })}
             
            </CFormSelect>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="contact">Contact *</CFormLabel>
            <CFormInput type="text" id="contact" placeholder="Enter contact number" onChange={(e) => {
                  
                  setNewAdmin((prev) => {
                    return {
                      ...prev,
                       contact: e.target.value
                    }
                  })
                 
                }}/>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="email">Email *</CFormLabel>
            <CFormInput type="email" id="email" placeholder="Enter email" onChange={(e) => {
                  
                  setNewAdmin((prev) => {
                    return {
                      ...prev,
                       email: e.target.value
                    }
                  })
                 
                }}/>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="username">Username *</CFormLabel>
            <CFormInput type="text" id="username" placeholder="Choose a username" nChange={(e) => {
                  
                  setNewAdmin((prev) => {
                    return {
                      ...prev,
                       username: e.target.value
                    }
                  })
                 
                }} />
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="password">Password *</CFormLabel>
            <CFormInput type="password" id="password" placeholder="Enter password" nChange={(e) => {
                  
                  setNewAdmin((prev) => {
                    return {
                      ...prev,
                       password: e.target.value
                    }
                  })
                 
                }} />
          </div>

          <CButton color="primary" type="submit" onClick={addAdminToServer }>Create Admin</CButton>
        </CForm>
      </CCardBody>
    </CCard>
      </CModal>


      <CModal visible={updateVisible} onClose={() => setUpdateVisible(false)}>
       <CCard className="mb-4">
      <CCardHeader>
        <strong>Update Admin</strong>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <div className="mb-3">
            <CFormLabel htmlFor="adminName">Admin Name *</CFormLabel>
                <CFormInput type="text" id="admin_name" placeholder="Enter admin name" value={updateAdmin.admin_name} onChange={(e) => {
                  setUpdateAdmin((prev) => {
                    return {
                      ...prev,
                      admin_name: e.target.value
                    }
                  })
                }}/>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="role">Role *</CFormLabel>
                <CFormSelect id="role_name" defaultValue={updateAdmin.role_id} onChange={(e) => {
                  console.log(e.target.value, "TARGET")
                  setUpdateAdmin((prev) => {
                    return {
                      ...prev,
                     role_id: e.target.value
                    }
                  })
            }}>
              <option >Select role</option>
             {roleList.map((r) => {
                    return <option value={r.role_id}>{r.role_name}</option>
                  })}
            </CFormSelect>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="contact">Contact *</CFormLabel>
                <CFormInput type="text" id="contact" placeholder="Enter contact number" value={updateAdmin.contact} onChange={(e) => {
                  setUpdateAdmin((prev) => {
                    return {
                      ...prev,
                      contact: e.target.value
                    }
                  })
            }}/>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="email">Email *</CFormLabel>
            <CFormInput type="email" id="email" placeholder="Enter email" value={updateAdmin.email} onChange={(e) => {
                  setUpdateAdmin((prev) => {
                    return {
                      ...prev,
                      email: e.target.value
                    }
                  })
            }} />
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="username">Username *</CFormLabel>
            <CFormInput type="text" id="username" placeholder="Choose a username" value={updateAdmin.username} onChange={(e) => {
                  setUpdateAdmin((prev) => {
                    return {
                      ...prev,
                      username: e.target.value
                    }
                  })
            }}/>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="password">Password *</CFormLabel>
            <CFormInput type="password" id="password" placeholder="Enter password" value={updateAdmin.password} onChange={(e) => {
                  setUpdateAdmin((prev) => {
                    return {
                      ...prev,
                      password: e.target.value
                    }
                  })
            }}/>
          </div>

          <CButton color="primary" type="submit" onClick={UpdateAdminToServer}>Update Admin</CButton>
        </CForm>
      </CCardBody>
    </CCard>
      </CModal>
    </div>
  );
};

export default UserRoleManagement;


