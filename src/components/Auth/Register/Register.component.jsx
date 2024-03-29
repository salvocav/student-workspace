import React, {useState,useEffect} from "react"; //useState serve a manternere lo stato fra i component
import { Grid, Form, Segment, Header, Icon, Button, Message, Dropdown } from "semantic-ui-react";
import "../Auth.css"
import * as firebase from '../../../server/firebase';
import {createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {ref, set, getDatabase, get, child} from "firebase/database";
import { Link } from "react-router-dom";
// per creare l'ui del form utilizzo il pacchetto semantic-ui-reactù
// npm install semantic-ui-react
// npm install semantic-ui-css
//grazie a questo pacchetto ho accesso a diversi component che non devo creare da zero, così posso creare ad esempio il form più facilmente
// npm install react-router-dom 
//quest'altro pacchetto mi serve per abilitare il routing nella web app, così posso far navigare l'user da un component all'altro 
// in manierea più fluida senza ricaricare davvero la pagina 



//creo il component register


const Register = () => {

    //default user object

    let user={
        userName : '',
        email : '',
        password : '',
        confirmpassword : '',
        years: '',
        corso: ''

    }

    const courses= [];
    const [CourseState, setCourseState]= useState({name: 'Seleziona Corso'});

   /* const corsi = [
        { name:"corso" ,key: 'I', text: 'Ingegneria Informatica', value: 'Inf' },
        { name:"corso", key: 'E', text: 'Ingegneria Industriale', value: 'Elettr' },
        { name:"corso", key: 'In', text: 'Ingegneria Meccanica', value: 'Indu' },
      ]
      const anni = [
        { key: '1', text: 'Primo Anno', value: '1' },
        { key: '2', text: 'Secondo Anno', value: '2' },
        { key: '3', text: 'Terzo Anno', value: '3' },
      ]*/

    //default error object
    let errors = [];

    //Riferimento alla collection degli utenti sul realtime database di firebase, se non è presente sul database verrà creata automaticamente

    //let userCollectionRef = ref(firebase.db, 'users/'+ createdUser.user.uid);

    const [userState, setuserState] = useState(user);
    const [errorState, seterrorState] = useState(errors); 
    //stato per indicare che la pagina sta facendo il loading delle informazioni sul server
    const[isLoading, setIsLoading]= useState(false);
    const[isSuccess, setIsSuccess]= useState(false);

    useEffect ( () => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `courses`)).then((snapshot) => {
        if (snapshot.exists()) {
              Object.keys(snapshot.val()).forEach(key => courses.push(snapshot.val()[key]));      
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        console.error(error);
        });
    },[courses])

    //funzione handleInpt che riceve gli eventi degli oggetti
    const handleInput = (event) => {

        //event target
        let target= event.target;
        //console.log(target);
        /*console.log(target.name);
        console.log(target.value);*/
        //update dello stato
        setuserState((currentState) => {
            let currentuser = { ...currentState }; //clono l'oggetto currentState
            currentuser[target.name] = target.value; //usen name o email o password
            //console.log(currentuser);
            return currentuser; //aggiorno il valore dell'oggetto user
        })
        

    }

    const handleInput2 = (event) => {
        let target =event.target //cioè l'elemento con cui l'utente sta interagendo
       
        
        let vettTarget=[];
        vettTarget.push(target);
       
        setCourseState((currentState) => {
            let updatedState ={...currentState}  //usando lo spread operator vado a creare un clone di currentState 
           
            updatedState.name = vettTarget[0].innerText;
            
            return updatedState;
        })
    }

    //validazione del form
    const checkForm = () =>
    {
        if(isFormEmpty()){
            seterrorState((error) => error.concat({message : "Riempi tutti i campi del form"}))
            return false;    
        }
        else if(!checkPassword())
        {
            
            return false;
        }
        return true;
    }

    //controllo se uno dei campi del form è vuoto
    const isFormEmpty = () => 
    {
        return !userState.userName.length ||
        !userState.email.length ||
        !userState.password.length ||
        !userState.confirmpassword.length;

    }

    // check della password
    const checkPassword = () => {
        if(userState.password.length<8){
            seterrorState((error) => error.concat({message : "La password deve contenere almeno 8 caratteri"}));
            return false;
        }
        else if(userState.password !== userState.confirmpassword )
        {
            seterrorState((error) => error.concat({message : "La due password non coincidono"}));
            return false;
        }
        return true;
    }

    //azione del form al submit
    const onSubmit = (event) => {

        seterrorState(() => []); //svuoto l'array degli errori ad ogni submit
        setIsSuccess(false);
        if(checkForm())
        {
            setIsLoading(true); //setto isLoading true per indicare che sta caricando e l'utente non può fare submit più volte
            //creo l'utente su firebase usando il metodo predefinito di firebase che ritorna una promise 
            createUserWithEmailAndPassword(firebase.auth,userState.email,userState.password)
            .then(createdUser => {
                setIsLoading(false); //setto isLoading false per indicare che è finito il caricamento
                updateuserDetails(createdUser);  //chiamo la funzione updateuserDetails per settare il displayName e l'url della foto prodilo utilizzando l' API gravatar
            }).catch((servererror) => {
                setIsLoading(false);
                seterrorState((error) => error.concat(servererror));
                //console.log(servererror.code);
                //console.log(servererror.message);
                
            })
        

        } 
    }


    //uso questa funzione per settare il display name e l'url della photo profilo utilizzando l'app gravatar
    const updateuserDetails = (createdUser) => {
        if (createdUser) {
                setIsLoading(true);
                console.log(createdUser.user);
                updateProfile(createdUser.user, {
                    displayName: userState.userName,
                    photoURL: `http://gravatar.com/avatar/${createdUser.user.uid}?d=identicon`,
                    
                })//l'API ritorna una promise che gestisco così 
                .then(() => {
                    setIsLoading(false);
                    console.log(createdUser);
                    saveUserInDB(createdUser);
                })
                .catch((serverError) => {
                    setIsLoading(false);
                    seterrorState((error) => error.concat(serverError));
                })
        }
    }

    //funzione per salvare effettivamente le informazioni dell'utente sul database
    //salvo sul database solo l'uid, display name e l'url della foto 
    const saveUserInDB = (createdUser) => {
        setIsLoading(true);

        let Clength=courses.length;
               
                
        let courseYear;
        for(let i=0;i<Clength;i++)
        {
            console.log(courses[i].value);
            console.log(CourseState.name);
            if(courses[i].value==CourseState.name)
            courseYear=courses[i].years;
        }

        set(ref(firebase.db, 'users/'+ createdUser.user.uid),{
            displayName: createdUser.user.displayName,
            photoURL: createdUser.user.photoURL,
            corso: CourseState.name,
            years: courseYear
        })
        .then(() => {
            setIsLoading(false);
            setIsSuccess(true);
            console.log('utente salvato sul RT Database');
        })
        .catch(serverError => {
            setIsLoading(false);
            seterrorState((error) => error.concat(serverError));
        })
    }


    //funzione per la formattazione della visualizzazione degli errori
    const formaterrors = () =>
    {
        return errorState.map((error,index) => <p key={index}>{error.message}</p>)
    }
    
//uso il component grid di semantic-ui
return (
<Grid verticalAlign="middle" textAlign="center" className="grid-form">
<Grid.Column style={{maxWidth : '500px'}}>
    <Header icon as="h2">
        <Icon name="university"/>
        Register
    </Header>
    <Form onSubmit={onSubmit}>
        <Segment stacked>
            <Form.Input
                name="userName"
                value={userState.userName}
                icon="user"   //presa da semantic ui, per vedere le altre icone disponibile leggere la documentation
                iconPosition="left"
                onChange={handleInput}
                type="text"
                placeholder="User Name"
            />
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
            <Form.Input
                name="confirmpassword"
                value={userState.confirmpassword}
                icon="lock"
                iconPosition="left"
                onChange={handleInput}
                type="password"
                placeholder="Confirm Password"
            />
            <Dropdown
            name="courseRemove" 
            fluid
            search
            selection
            options={courses}
            onChange={handleInput2}
            placeholder={CourseState.name}
                />  
        </Segment>
        <Button disabled={isLoading} loading={isLoading}>Submit</Button>
    </Form>
    
    {errorState.length > 0 &&  // se errorstate è settato verrà visualizzata la sezione relativa ai messaggi d'errrore
        <Message error>
            <h3>Errors</h3>
            {formaterrors()}
        </Message>
        
    }
    {isSuccess &&  // se errorstate è settato verrà visualizzata la sezione relativa ai messaggi d'errrore
        <Message success>
            <h3>Registrato Correttamente</h3>
        </Message>
        
    }

    <Message>
        Sei già iscritto? <Link to="/login">Login </Link>
    </Message>
</Grid.Column>

</Grid>)

}

export default Register;