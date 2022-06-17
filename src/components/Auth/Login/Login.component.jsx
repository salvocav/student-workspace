import React, {useState} from "react";
import "../Auth.css"
import * as firebase from '../../../server/firebase';
import {signInWithEmailAndPassword} from "firebase/auth";
import {ref, set} from "firebase/database";
import { Link } from "react-router-dom";
import { Grid, Form, Segment, Header, Icon, Button, Message } from "semantic-ui-react";


//creo il component login

const Login = () => {

    // default user per il login
    let user={
        email : '',
        password : ''
    }


    //default error object
    let errors = [];

    const [userState, setuserState] = useState(user);
    const [errorState, seterrorState] = useState(errors);
    //variabile per indicare che la pagina sta facendo il loading delle informazioni sul server
    const[isLoading, setIsLoading]= useState(false);
    const[isSuccess, setIsSuccess]= useState(false);

    //funzione handleInpt che riceve gli eventi degli oggetti
    const handleInput = (event) => {

        //event target
        let target= event.target;
        //update dello stato
        setuserState((currentState) => {
            let currentuser = { ...currentState }; //clono l'oggetto currentState
            currentuser[target.name] = target.value; //usen name o email o password
            return currentuser; //aggiorno il valore dell'oggetto user
        })


    }

    //validazione del form
    const checkForm = () =>
    {
        if(isFormEmpty()){
            seterrorState((error) => error.concat({message : "Riempi tutti i campi del form"}))
            return false;    
        }
        return true;
    }

    //controllo se uno dei campi del form è vuoto
    const isFormEmpty = () => {
        return !userState.password.length ||
            !userState.email.length;
    }

    const onSubmit = (event) => {

        seterrorState(() => []); //svuoto l'array degli errori ad ogni submit
        //setIsSuccess(false);
        if(checkForm())
        {
            setIsLoading(true); //setto isLoading true per indicare che sta caricando e l'utente non può fare submit più volte
            //creo l'utente su firebase usando il metodo predefinito di firebase che ritorna una promise 
            signInWithEmailAndPassword(firebase.auth,userState.email,userState.password)
            .then(user => {
                setIsLoading(false); //setto isLoading false per indicare che è finito il caricamento
                console.log(user);  //chiamo la funzione updateuserDetails per settare il displayName e l'url della foto prodilo utilizzando l' API gravatar
            }).catch((servererror) => {
                setIsLoading(false);
                seterrorState((error) => error.concat(servererror));
                //console.log(servererror.code);
                //console.log(servererror.message);
                
            })
        

        } 
    }
     //funzione per la formattazione della visualizzazione degli errori
     const formaterrors = () =>
     {
         return errorState.map((error,index) => <p key={index}>{error.message}</p>)
     }

    return (<Grid verticalAlign="middle" textAlign="center" className="grid-form">
<Grid.Column style={{maxWidth : '500px'}}>
    <Header icon as="h2">
        <Icon name="university"/>
        Login
    </Header>
    <Form onSubmit={onSubmit}>
        <Segment stacked>
            <Form.Input
                name="email"
                value={userState.email}
                icon="mail"
                iconPosition="left"
                onChange={handleInput}
                type="email"
                placeholder="User Email"
            />
            <Form.Input
                name="password"
                value={userState.password}
                icon="lock"
                iconPosition="left"
                onChange={handleInput}
                type="password"
                placeholder="User Password"
            />
        </Segment>
        <Button disabled={isLoading} loading={isLoading}>Login</Button>
    </Form>
    
    {errorState.length > 0 &&  // se errorstate è settato verrà visualizzata la sezione relativa ai messaggi d'errrore
        <Message error>
            <h3>Errors</h3>
            {formaterrors()}
        </Message>
        
    }
    

    <Message>
        Non sei già iscritto? <Link to="/register">Registrati </Link>
    </Message>
</Grid.Column>

</Grid>)
}

export default Login;