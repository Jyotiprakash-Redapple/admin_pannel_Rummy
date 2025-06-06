import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Wallet Management
const WalletHistory = React.lazy(() => import('./views/project-files/wallet-management/wallet-history'))
const WalletTransactionLog = React.lazy(() => import('./views/project-files/wallet-management/transaction-log'))
const UpdateWalletBalance = React.lazy(() => import('./views/project-files/wallet-management/update-wallet-balance'))
const WalletManualAdjustments = React.lazy(() => import('./views/project-files/wallet-management/manual-adjustments'))

// Client Management

const ClientAccountBasedCurrency = React.lazy(() => import('./views/project-files/client-management/account-base-currency'))
const ClientList = React.lazy(() => import('./views/project-files/client-management/client-list'))

const TransactionHistory = React.lazy(() => import('./views/project-files/client-management/transaction-history'))
const AddEditClient = React.lazy(() => import('./views/project-files/client-management/addEditClient'));
const ClientAccount = React.lazy(() => import('./views/project-files/client-management/client-accountList'));
const ClientTransferBalance = React.lazy(() => import('./views/project-files/client-management/transfer-balance'));
const ClientManageAccountDetailsMainPage = React.lazy(() => import('./views/project-files/client-management/manage-account/client-manage-accountMainPage'));


// Provider

const ProviderList = React.lazy(() => import('./views/project-files/provider-manangement/provider-list'));
const AddEditProvider = React.lazy(() => import('./views/project-files/provider-manangement/addEditProvider'));


// Game
const GameList = React.lazy(() => import('./views/project-files/game-management/game-list'));

// Player
const PlayerList = React.lazy(() => import('./views/project-files/player-management/player-list'));
const PlayerDetails = React.lazy(() => import('./views/project-files/player-management/player-details'));
const PlayerTransactionSummary = React.lazy(() => import('./views/project-files/player-management/player-transaction-summary'));
// profile
const ClientProfile = React.lazy(() => import('./views/project-files/profile-details/profile'))

const MyProfile = React.lazy(() => import('./views/project-files/profile-details/MyProfile'))

const ClientAccountList = React.lazy(() => import('./views/project-files/client-management/client-accountList'))

const AccountPlayerDetails = React.lazy(() => import('./views/project-files/client-management/manage-account/account-player-details'))

const Test = React.lazy(() => import('./views/project-files/client-management/test'))
const AssignProvider = React.lazy(() => import('./views/project-files/assign-provider/AssignProviders'))
const AssignGames = React.lazy(() => import('./views/project-files/assign-games/AssignGames'))
const ProviderWiseReport = React.lazy(() => import('./views/project-files/reports/ProviderWiseReport'))
const CategoryWiseReport = React.lazy(() => import('./views/project-files/reports/CategoryWiseReport'))
const GameWiseReport = React.lazy(() => import('./views/project-files/reports/GameWiseReport'))
const WalletTransactionReport = React.lazy(() => import('./views/project-files/reports/WalletTransactionReport'))
const Rolelist = React.lazy(() => import('./views/project-files/role-management/RoleList'))

const UserManagement = React.lazy(() => import('./views/project-files/user-management/Usermanagement'))

const Permission = React.lazy(() => import('./views/project-files/role-management/ManagePermission'))

const PlayerDetailsTransaction = React.lazy(() => import('./views/project-files/player-management/PlayerDetails'))

const ReferralManagement = React.lazy(() => import('./views/project-files/referal-management/ReferalList'))

const GamePlayTransaction = React.lazy(() => import('./views/project-files/Transaction-management/GamePlayTransaction'))

const AdminTransaction = React.lazy(() => import('./views/project-files/Transaction-management/AdminTransaction'))
const AddCashTransaction = React.lazy(() => import('./views/project-files/Transaction-management/AddcashTransaction'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/manage-permission', name: 'Manage Permission', element: Permission },
  { path: '/role-management', name: 'Dashboard', element: Rolelist },
  { path: '/user-management', name: 'Dashboard', element: UserManagement },
  { path: '/my-account-list', name: 'Account List', element: MyProfile, exact: true },
  { path: '/my-account-list/client-manage-account', name: 'Manage Account', element: ClientManageAccountDetailsMainPage },

  { path: '/test', name: 'My Profile', element: Test },

{ path: '/referral-list', name: 'Referral List', element: ReferralManagement },
{ path: '/game-play-transaction-list', name: 'Game Play Transaction List', element: GamePlayTransaction },

  { path: '/add-cash-transaction-list', name: 'Add Cash Transaction List', element: AddCashTransaction },
{ path: '/admin-transaction-list', name: 'Admin Transaction List', element: AdminTransaction },
  { path: '/wallet-history', name: 'Wallet History', element: WalletHistory },
  { path: '/transaction-log', name: 'Transaction Log', element: WalletTransactionLog },
  { path: '/update-wallet-balance', name: 'Update Wallet Balance', element: UpdateWalletBalance },
  { path: '/manual-adjustments', name: 'Manual Adjustments', element: WalletManualAdjustments },

  { path: '/client-list/manage-client', name: 'Manage Client', element: ClientAccountBasedCurrency },
  { path: '/client-list', name: 'Client Management - Client List', element: ClientList, exact: true },
  { path: '/client-list/client-add', name: 'Add Client', element: AddEditClient, },
  { path: '/client-list/client-update', name: 'Update Client', element: AddEditClient, },
  { path: '/client-list/client-account-list', name: 'Client Account List', element: ClientAccountList },
  { path: '/client-list/client-transfer-balance', name: 'Client Transfer Balance', element: ClientTransferBalance },
  { path: '/client-list/client-manage-account', name: 'Manage Account', element: ClientManageAccountDetailsMainPage },


  { path: '/client-transaction-history', name: 'Client Transaction History', element: TransactionHistory },
  { path: '/client-account', name: 'Client Account List', element: ClientAccount },



  { path: '/provider-list', name: 'Provider', element: ProviderList },
  { path: '/provider-add', name: 'Provider Add', element: AddEditProvider },
  { path: '/provider-update', name: 'Provider Update', element: AddEditProvider },

  { path: '/game-list', name: 'Game List', element: GameList },

  { path: '/player-list', name: 'Player Management - Player List', element: PlayerList , exact: true},
  { path: '/player-details', name: 'Player List', element: PlayerDetails },
  { path: '/player-list/account-player-details', name: 'Player Details', element: AccountPlayerDetails },
  { path: '/player-list/player-details', name: 'Player Details', element: PlayerDetailsTransaction },
  { path: '/player-list/transaction-summary', name: 'Transaction Summary', element: PlayerTransactionSummary },

  { path: '/assign-provider', name: 'Assign Providers', element: AssignProvider, exact: true },
  { path: '/assign-games', name: 'Assign Games', element: AssignGames, exact: true },


  { path: '/provider-wise-report', name: 'Report Management - Provider Wise Report', element: ProviderWiseReport, exact: true },
  { path: '/category-wise-report', name: 'Report Management - Category Wise Report', element: CategoryWiseReport, exact: true },
  { path: '/game-wise-report', name: 'Report Management - Game Wise Report', element: GameWiseReport, exact: true },
  { path: '/wallet-transaction-report', name: 'Report Management - Wallet Transaction Report', element: WalletTransactionReport, exact: true },

]

export default routes
