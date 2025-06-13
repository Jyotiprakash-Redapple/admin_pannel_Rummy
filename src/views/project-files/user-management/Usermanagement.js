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
CBadge,
  CCard,
  CCardBody,
  CCardHeader,
} from "@coreui/react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,

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
                        
                      });
                     
                  }
              })
              .catch((error) => {
                  toast.error(error?.response?.data?.message || 'unable to fetch role list', {
                      position: 'bottom-right',
             
                  });
  
              });
  }

  const FetchRoleByAdmin = () => {
         
  
          Service.apiGetCallRequest(RouteURL.get_all_role_by_admin,token)
              .then((res) => {
        console.log(res.data.roles, "res.data.roles")
  
                  if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
  
                      setAdminRole(res.data.roles.filter((r)=>r.role_id !== 1))
                     
  
                  } else {
                      toast.error(res.message, {
                          position: 'bottom-right',
               
                      });
                     
                  }
              })
              .catch((error) => {
                  toast.error(error?.response?.data?.message || 'unable to fetch role list', {
                      position: 'bottom-right',
         
                  });
  
              });
  }

  const UpdateAdminToServer = (e) => {
    e?.preventDefault()

    

  
     let params = JSON.stringify({
       admin_id: updateAdmin.admin_id,
       role_id: updateAdmin.role_id,
       contact: updateAdmin.admin_contact,
       email: updateAdmin.
admin_email
,
       username: updateAdmin.admin_username
,
       password: updateAdmin.admin_password,
       status: updateAdmin.admin_status,
       admin_name: updateAdmin.admin_name
      })
 console.log(updateAdmin, "update admin", params)
        Service.apiPostCallRequest(RouteURL.update_admin, params, token)
          .then((res) => {
            setUpdateVisible(false)
            
            FetchRoleListDetails()
            FetchRoleByAdmin()
              toast.success(res.message, {
                    position: 'bottom-right',

              });
             //setUpdateAdmin({})
            })
          .catch((error) => {
              console.log(error, "error")
                toast.error(error?.response?.data?.message || 'unable to update role', {
                    position: 'bottom-right',
              
                });

            });
  }
  const addAdminToServer = (e) => {
     e.preventDefault()
     let params = JSON.stringify({
       role_id: newAdmin.role_id,
       contact: newAdmin.contact,
       email: newAdmin.email,
       username: newAdmin.username,
       password: newAdmin.password,
       status: "active",
       admin_name: newAdmin.admin_name
     })
    console.log(newAdmin)
    

    
        Service.apiPostCallRequest(RouteURL.create_admin, params, token)
          .then((res) => {
              
            setVisible(false);
            FetchRoleListDetails()
            FetchRoleByAdmin()
            setNewAdmin({})
              toast.success(res.message, {
                    position: 'bottom-right',

                });
            })
          .catch((error) => {
              console.log(error, "error====>")
                toast.error(error?.response?.data?.message || 'unable to add role', {
                    position: 'bottom-right',
               
                });

            });
  }
 const UpdateAdminToServerByStatus = (param) => {


    

   console.log(param, "update admin status")
     let params = JSON.stringify({
       admin_id: param.admin_id,
       role_id: param.role_id,
       contact: param.admin_contact,
       email: param.admin_email,
       username: param.admin_username,
       password: param.admin_password,
       status: param.admin_status,
       admin_name: param.admin_name
      })

        Service.apiPostCallRequest(RouteURL.update_admin, params, token)
          .then((res) => {
           
            
            FetchRoleListDetails()
            FetchRoleByAdmin()
              toast.success(res.message, {
                    position: 'bottom-right',
    
              });
            
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || 'unable to update role', {
                    position: 'bottom-right',
                   
                });

            });
  }
const DeleteAdminToServer = (param) => {


    

   console.log(param, "update admin status")
     let params = JSON.stringify({
       admin_id: param,
       
      })

        Service.apiPostCallRequest(RouteURL.delete_admin, params, token)
          .then((res) => {
           
            
            FetchRoleListDetails()
            FetchRoleByAdmin()
              toast.success(res.message, {
                    position: 'bottom-right',
    
              });
            
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || 'unable to update role', {
                    position: 'bottom-right',
                   
                });

            });
  }
  

  //console.log(roleList, "roleList")
  useEffect(() => {
    FetchRoleListDetails();
    FetchRoleByAdmin()
  }, [])
  console.log(updateAdmin, "update", newAdmin)
  return (
    <div className={styles.container}>
       <ToastContainer />
      <div className={styles.filter}>
        <div>
           <label htmlFor="status_id" className="form-label" >Status</label>
        <select className="form-select"
        id="status_id"  value={statusFilter}
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

    
<div className="table-responsive">
  <CTable hover bordered responsive>
    <CTableHead className="table-primary text-center align-middle">
      <CTableRow>
        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
        <CTableHeaderCell scope="col">Admin Name</CTableHeaderCell>
        <CTableHeaderCell scope="col">Username</CTableHeaderCell>
        <CTableHeaderCell scope="col">Role Name</CTableHeaderCell>
        <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
      </CTableRow>
    </CTableHead>

    <CTableBody>
      {filteredUsers.length > 0 ? (
        filteredUsers.map((u, index) => (
          <CTableRow key={u.admin_id || index}>
            {/* ACTION buttons */}
            <CTableDataCell className="text-center">
              <button className={styles.deleteBtn} onClick={() => {
                 DeleteAdminToServer(u.admin_id)  
              }}>
                <i className="fa fa-trash-o"></i>
              </button>
              <button
                className={styles.editBtn}
                onClick={() => {
                  
                
                  setUpdateAdmin(() => {
                    return {
                      ...u, admin_password
: ''
                    }
                    });
                  setUpdateVisible(true);
                  setVisible(false);
                  


             
                }}>
                <i className="fa fa-edit"></i>
              </button>
            </CTableDataCell>

            {/* ADMIN NAME */}
            <CTableDataCell className="text-center">{u.admin_name}</CTableDataCell>

            {/* USERNAME */}
            <CTableDataCell className="text-center">{u.
admin_username
}</CTableDataCell>

            {/* ROLE NAME */}
            <CTableDataCell className="text-center">{u.role_name}</CTableDataCell>

            {/* CONTACT */}
            <CTableDataCell className="text-center">{u.admin_contact}</CTableDataCell>

            {/* EMAIL */}
            <CTableDataCell className="text-center">{u.admin_email}</CTableDataCell>

            {/* STATUS */}
            <CTableDataCell className="text-center">
              <CBadge color={u.admin_status === 'active' ? 'success' : 'danger'} onClick={() => {
                const admin_status = u.admin_status === 'active' ? 'inactive' : 'active';
                console.log(admin_status, 'value');
                UpdateAdminToServerByStatus({ ...u, admin_status })
              }} style={{cursor: 'pointer'}}>
                          { u.admin_status === 'active' ? 'Active': 'Inactive'}
                        </CBadge>
              {/* <span
                className={
                  u.admin_status === 'active'
                    ? styles.statusLabelSuccess
                    : styles.statusLabelDanger
                }>
                {u.admin_status}

              </span> */}
              {/* <label className={styles.switch} style={{ marginLeft: '10px' }}>
                <input
                  type="checkbox"
                  defaultChecked={u.admin_status === 'active'}
                  onChange={(e) => {
                    const admin_status = e.target.checked ? 'active' : 'inactive';
                    console.log(admin_status, 'value');
                    UpdateAdminToServerByStatus({ ...u, admin_status });
                  }}
                />
                <span className={styles.slider}></span>
              </label> */}
            </CTableDataCell>
          </CTableRow>
        ))
      ) : (
        <CTableRow>
          <CTableDataCell colSpan={7} className="text-center">
            No data found
          </CTableDataCell>
        </CTableRow>
      )}
    </CTableBody>
  </CTable>
</div>


      
      <CModal visible={visible} onClose={() => setVisible(false)}>
       <CCard className="mb-4">
      <CCardHeader>
        <strong>Create Admin</strong>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <div className="mb-3">
            <CFormLabel htmlFor="adminame">Admin Name *</CFormLabel>
                <CFormInput type="text" id="admin_name" placeholder="Enter admin name" value={newAdmin.admin_name} onChange={(e) => {
                  
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
                <CFormSelect value={newAdmin.role_id} id="role" onChange={(e) => {
                  
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
            <CFormInput value={newAdmin.contact} type="text" id="contact" placeholder="Enter contact number" onChange={(e) => {
                  
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
                 
                }} value={newAdmin.email}/>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="username">Username *</CFormLabel>
                <CFormInput value={ newAdmin.username}type="text" id="username" placeholder="Choose a username" onChange={(e) => {
                  
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
            <CFormInput type="password" id="password" placeholder="Enter password" value={ newAdmin.password}onChange={(e) => {
                  
                  setNewAdmin((prev) => {
                    return {
                      ...prev,
                       password: e.target.value
                    }
                  })
                 
                }} />
          </div>

              <CButton color="primary" type="submit" onClick={addAdminToServer}>Create Admin</CButton>
              <CButton color='secondary' onClick={() => setVisible(false)} style={{marginInline: '7px'}}>
                          Cancel
                        </CButton>
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
                <CFormInput type="text" id="admin_name" placeholder="Enter admin name" value={updateAdmin.admin_name
} onChange={(e) => {
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
                <CFormSelect id="role_name" defaultValue={updateAdmin.role_id}
                  value={updateAdmin.role_id}
                  onChange={(e) => {
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
                <CFormInput type="text" id="contact" placeholder="Enter contact number" value={updateAdmin.
admin_contact
} onChange={(e) => {
                  setUpdateAdmin((prev) => {
                    return {
                      ...prev,
                      
admin_contact
: e.target.value
                    }
                  })
            }}/>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="email">Email *</CFormLabel>
            <CFormInput type="email" id="email" placeholder="Enter email" value={updateAdmin.admin_email} onChange={(e) => {
                  setUpdateAdmin((prev) => {
                    return {
                      ...prev,
                      admin_email
: e.target.value
                    }
                  })
            }} />
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="username">Username *</CFormLabel>
            <CFormInput type="text" id="username" placeholder="Choose a username" value={updateAdmin.admin_username
} onChange={(e) => {
                  setUpdateAdmin((prev) => {
                    return {
                      ...prev,
                      admin_username
: e.target.value
                    }
                  })
            }}/>
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="password">Password</CFormLabel>
            <CFormInput type="password" id="password" placeholder="Enter password" value={updateAdmin.admin_password
} onChange={(e) => {
                  setUpdateAdmin((prev) => {
                    return {
                      ...prev,
                      admin_password
: e.target.value
                    }
                  })
            }}/>
          </div>

              <CButton color="primary" type="submit" onClick={UpdateAdminToServer}>Update Admin</CButton>
               <CButton color='secondary' onClick={() => setUpdateVisible(false)} style={{marginInline: '7px'}}>
                          Cancel
                        </CButton>
        </CForm>
      </CCardBody>
    </CCard>
      </CModal>
    </div>
  );
};

export default UserRoleManagement;


