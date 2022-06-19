import {React} from 'react';
import { Grid, Header, Icon, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';


// nelle props ho le informazioni dell'utente loggato
const UserInfo = (props) => {
    if(props.user){
    return (
        <Grid>
            <Grid.Column>
                <Grid.Row>
                    <Header>
                        <Icon name="university"/>
                        <Header.Content>Student Workspace</Header.Content>
                    </Header>
                    <Header>
                        <span>
                            <Image>src={props.user.photoURL}</Image>
                            {props.user.displayName}
                        </span>
                    </Header>
                </Grid.Row>
            </Grid.Column>
        </Grid>
    )
    }
    reutn null;
}

const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser
    }
}

export default connect (mapStateToProps)(UserInfo) // 