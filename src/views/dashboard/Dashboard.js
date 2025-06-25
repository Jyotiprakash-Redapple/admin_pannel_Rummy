import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


import WidgetsDropdown from '../widgets/WidgetsDropdown'
import Service from "../../apis/Service";
import RouteURL from "../../apis/ApiURL";

import { Constants } from "../../apis/Constant";
export default function Dashboard() {
  
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.user.token);
   const [bonusAmt, setBonusAmt] = useState({ total: 0, list: [] });
  const [cashDepositeAmt, setCashDepositeAmt] = useState({ total: 0, list: [] });
  const [dealRummy, setDealRummy] = useState({ total: 0, list: [] });
  const [player, setPlayer] = useState({ total: 0, list: [] });
  const [pointRummy, setPointRummy] = useState({ total: 0, list: [] });
  const [poolRummy, setPoolRummy] = useState({ total: 0, list: [] });
  const [referal, setReferal] = useState({ total: 0, list: [] });
  const [withdrawAmt, setWithdrawAmt] = useState({ total: 0, list: [] });

const PlayerDashboardDetails = () => {
		

		Service.apiPostCallRequest(
			RouteURL.admin_dashboard,
			{ },
			token
		)
			.then((res) => {
				console.log(res, "player dashboard details");
				if (res.err === Constants.API_RESPONSE_STATUS_SUCCESS) {
          setBonusAmt(res.data.dashboarddata.bonusamt)
          
          setCashDepositeAmt(res.data.dashboarddata.cashdepositeamt)
          setDealRummy(res.data.dashboarddata.dealrummy
)
          setPlayer(res.data.dashboarddata.player)
          setPointRummy(res.data.dashboarddata.pointrummy
)
          setPoolRummy(res.data.dashboarddata.poolrummy
)
          setReferal(res.data.dashboarddata.referal
)
          setWithdrawAmt(res.data.dashboarddata.widthdranamt)
				} else {
					toast.error(res.data.message, {
						position: "bottom-right",
						closeOnClick: true,
					});
				}
			})
      .catch((error) => {
        console.log(error, "error")
				toast.error(error.response.data.message, {
					position: "bottom-right",
				});
			});
};
  
  useEffect(() => {
    PlayerDashboardDetails()
  },[])
  return (
    <>
      <ToastContainer/>
      <WidgetsDropdown  bonusAmt={bonusAmt} cashDepositeAmt={cashDepositeAmt} dealRummy={dealRummy} player={player} pointRummy={pointRummy} poolRummy={poolRummy} referal={referal} withdrawAmt={withdrawAmt} />
     
      
    </>
  )
}


