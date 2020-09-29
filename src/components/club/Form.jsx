import React, { useState, useEffect } from 'react'

import { Button, TextField, Paper, Typography, FormHelperText, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useFirestore } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import styles from '../auth/styles'

const useStyles = makeStyles(styles)

const ClubForm = props => {
	const [state, setState] = useState({
		name: '',
		kindOfSport: '',
		description: '',
		logo: '',
		location: ''
	})

	const [errorMessage, setErrorMessage] = useState()

	const db = useFirestore()
	const { authError, auth } = useSelector(state => state.firebase)
	const { message: authErrorMessage = '' } = authError || {}

	const classes = useStyles()

	useEffect(() => {
		setErrorMessage(authErrorMessage)
	}, [authErrorMessage])

	useEffect(() => {
		// for clear errorMessage on switch between register/login
		// else it will go from redux to other component on first open
		setErrorMessage()
		// fill form with loaded data
		const {
			clubDoc: { name = '', kindOfSport = '', description = '', logo = '', location = '' }
		} = props
		console.log('props', props)
		setState({ name, kindOfSport, description, logo, location })
	}, [])

	/* 	// fill form with loaded data
	useEffect(() => {
		setState({ name, kindOfSport, description, logo, location })
	}, [name, kindOfSport, description, logo, location]) */

	const handleChange = e => {
		setErrorMessage()
		setState({ ...state, [e.target.id]: e.target.value })
	}

	const handleSubmit = () => {
		// firebase.login(state)
		console.log('profile', props.profile)
		const {
			profile: { fullName: userName, userId },
			clubDoc
		} = props
		const actionInfo = { userName, userId, time: Date.now() }
		let createdUpdatedInfo = {}
		let clubRef
		// club exists and it is an update
		if (clubDoc) {
			createdUpdatedInfo = { updated: actionInfo }
			clubRef = db.collection('clubs').doc(clubDoc.id)
			clubRef.set({ ...state, ...createdUpdatedInfo })
		}
		// club doesn't exist and we need put it to user user profile
		else {
			createdUpdatedInfo = { created: actionInfo, updated: actionInfo }
			clubRef = db.collection('clubs').doc()
			clubRef.set({ ...state, ...createdUpdatedInfo })

			const userRef = db.collection('users').doc(userId)
			userRef.set({ club: clubRef.id }, { merge: true })
		}
	}

	if (auth.isEmpty) return <Redirect to='/login' />

	return (
		<Container maxWidth='md' className={classes.flexContainer}>
			<Paper className={classes.loginForm}>
				<Typography variant='h5' color='primary'>
					Клуб
				</Typography>
				<form onChange={handleChange}>
					<TextField
						required
						id='name'
						label='название'
						type='text'
						margin='normal'
						fullWidth
						value={state.name}
					/>
					<br />
					<TextField
						required
						id='kindOfSport'
						label='вид спорта'
						type='text'
						margin='normal'
						fullWidth
						helperText='для специфических настроек программы'
						value={state.kindOfSport}
					/>
					<br />
					<TextField
						id='logo'
						label='логотип (ссылка на картинку)'
						type='text'
						margin='normal'
						helperText='для печатных бланков и др.'
						fullWidth
						value={state.logo}
					/>
					<br />
					<TextField
						id='description'
						label='описание'
						type='text'
						margin='normal'
						fullWidth
						helperText='когда основан, сколько учеников, выдающиеся достижения и т.д. '
						multiline
						value={state.description}
					/>
					<br />

					<TextField
						id='location'
						label='местонахождение (страна, регион, населённый пункт)'
						type='text'
						margin='normal'
						fullWidth
						value={state.location}
					/>
					<br />
					<br />
					<Button
						className={classes.loginButton}
						onClick={handleSubmit}
						variant='contained'
						color='primary'
						margin='normal'
					>
						Сохранить
					</Button>
					<FormHelperText error>{errorMessage}</FormHelperText>
				</form>
			</Paper>
		</Container>
	)
}

export default ClubForm