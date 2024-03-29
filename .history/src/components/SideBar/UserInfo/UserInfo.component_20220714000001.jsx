import {React} from 'react';
import { Grid, Header, Icon, Image, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import "./UserInfo.css";
import * as firebase from '../../../server/firebase';
import { signOut } from 'firebase/auth';



// nelle props ho le informazioni dell'utente loggato
const UserInfo = (props) => {
    const adminMail="admin@gmail.com"
    //console.log(props.user.uid);
    const getDropDownOptions = () => {
        return [{
            key : 'signout',
            text : <span onClick={logout}> Logout </span>
        }]
    }

    const logout = () => {
        signOut(firebase.auth).then(() => console.log("user signed out"));
    }

    if(props.user){

        if(props.user.email===adminMail)
        {
            return (
                <Grid>
                    <Grid.Column>
                        <Grid.Row className="userinfo_grid_row">
                            <Header inverted as="h2">
                                <Icon name="university"/>
                                <Header.Content>Student Workspace ADMIN</Header.Content>
                            </Header>
                            <Header className="userinfo_displayname" inverted as="h4">
                                <Dropdown
                                trigger = {
                                    <span>
                                        <Image src={props.user.photoURL} avatar ></Image> 
                                        {props.user.displayName}
                                    </span>
                                }
                                options={getDropDownOptions()}
                                >
                                </Dropdown>                       
                            </Header>
                        </Grid.Row>
                    </Grid.Column>
                </Grid>
            )

        }
        else {
            return (
            <Grid>
                <Grid.Column>
                    <Grid.Row className="userinfo_grid_row">
                        <Header inverted as="h2">
                            <Icon name="university"/>
                            <Header.Content>Student Workspace</Header.Content>
                        </Header>
                        <Header className="userinfo_displayname" inverted as="h4">
                            <Dropdown
                            trigger = {
                                <span>
                                    <Image src={props.user.photoURL} avatar ></Image> 
                                    {props.user.displayName}
                                </span>
                            }
                            options={getDropDownOptions()}
                            >
                            </Dropdown>                       
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        )
        }
    }
    return null;
}

const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser
    }
}

export default connect (mapStateToProps)(UserInfo) // 