import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import ClubPage from './components/club/FirebaseContainer'
import Navbar from './components/layouts/Navbar'
import AthletsPage from './components/athlet/PageFirebaseContainer'
import TrainersPage from './components/trainer/PageFirebaseContainer'
import TournamentsPage from './components/tournament/PageFirebaseContainer'
import TournamentParticipantsPage from './components/tournament/ParticipantsPage'
import TournamentGridList from './components/tournament/GridListPageFirebaseContainer'
import TournamentGridForm from './components/grid/FormFirebaseContainer'

import CategoriesPage from './components/category/PageFirebaseContainer'
import ApplicationsPage from './components/application/PageFirebaseContainer'
import './index.css'

import Main from './components/main'

function App(props) {
	return (
		<BrowserRouter>
			<div>
				<Navbar />
				<Switch>
					<Route exact path='/' component={Main} />
					<Route path='/athlets' component={AthletsPage} />
					<Route path='/trainers' component={TrainersPage} />
					<Route
						path='/grid/club/:club/tournament/:tournamentId/category/:categoryId'
						component={TournamentGridForm}
					/>
					<Route path='/tournaments/:tournamentId/grids' component={TournamentGridList} />
					<Route
						path='/tournaments/:tournamentId/participants'
						component={TournamentParticipantsPage}
					/>
					<Route path='/tournaments' component={TournamentsPage} />
					<Route path='/categories' component={CategoriesPage} />
					<Route path='/applications' component={ApplicationsPage} />
					<Route path='/login' component={LoginForm} />
					<Route path='/register' component={RegisterForm} />
					<Route path='/club' component={ClubPage} />
				</Switch>
			</div>
		</BrowserRouter>
	)
}

export default App
