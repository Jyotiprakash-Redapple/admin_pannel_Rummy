import React from "react";
import { CForm } from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import PlayerLogDetails from "./player-log-details";

export default function PlayerDetails() {
	return (
		<>
			<ToastContainer />
			<div className=''>
				<div className='d-flex bd-highlight'>
					<div className='p-2 w-100 bd-highlight'>
						<h3 className='hed_txt pt-2'>VIEW USER DETAILS</h3>
					</div>
					<div className='p-2 flex-fill  bd-highlight'></div>
				</div>

				<div className=''>
					<div className='card rounded '>
						<span className='play_del'>
							<b>User Details</b>{" "}
						</span>
						<div className='card-body play_del_inn'>
							<div className='row'>
								<div className='col'>
									<CForm className='justify-content-center' style={{ margin: 10 }}>
										<div className='row grid gap-3'>
											<div className=' g-col-12 '>
												<label>
													User ID : <b>{}</b>
												</label>
											</div>
											<div className=' g-col-12'>
												<label>
													External User ID : <b>{}</b>
												</label>
											</div>

											<div className=' g-col-12'>
												<label>
													Status : <b>{}</b>
												</label>
											</div>
											<div className=' g-col-12'>
												<label>
													Bet Count :<b>{}</b>{" "}
												</label>
											</div>
											<div className=' g-col-12'>
												<label>
													Total Win : <b>{}</b>
												</label>
											</div>
											<div className=' g-col-12'>
												<label>
													Client ID : <b>{}</b>
												</label>
											</div>
											<div className=' g-col-12'>
												<label>
													Account ID : <b>{}</b>
												</label>
											</div>
										</div>
									</CForm>
								</div>
								<div className='col'>
									<CForm className='justify-content-center' style={{ margin: 10 }}>
										<div className='row grid gap-3'>
											<div className=' g-col-12 '>
												<label>
													Username : <b>{}</b>
												</label>
											</div>
											<div className=' g-col-12'>
												<label>
													Currency : <b>{}</b>
												</label>
											</div>

											<div className=' g-col-12'>
												<label>
													Last Log In : <b>{}</b>
												</label>
											</div>
											<div className=' g-col-12'>
												<label>
													Total Bet :<b>{}</b>{" "}
												</label>
											</div>
											<div className=' g-col-12'>
												<label>
													Average RTP (%): <b>{}</b>
												</label>
											</div>
											<div className=' g-col-12'>
												<label>
													Client Name : <b>{}</b>
												</label>
											</div>
											<div className=' g-col-12'>
												<label>
													Account Name : <b>{}</b>
												</label>
											</div>
										</div>
									</CForm>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className=''>
					<PlayerLogDetails />
				</div>
			</div>
		</>
	);
}
