import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {Button, Loading} from '../components/common/';
import axios from 'axios';

export default class LoggedIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            email: '',
            user_id: '',
            username: '',
            error: ''
        }
    }

    componentDidMount() {
        // console.log(this.props.jwt);
        const headers = {
            'Authorization': 'JWT ' + this.props.jwt
        };
        axios({
            method: 'POST',
            url: 'http://218e4777.ngrok.io/user/',
            headers: headers,
        }).then((response) => {
            console.log(response);
            this.setState({
                email: response.data.email,
                user_id: response.data.user_id,
                username: response.data.username,
                loading: false
            });
        }).catch((error) => {
            console.log(error);
            this.setState({
                error: 'Error retrieving data',
                loading: false
            });
        });
    }

    render() {
        const {container, emailText, errorText} = styles;
        const {loading, email, error} = this.state;

        if (loading) {
            return (
                <View style={container}>
                    <Loading size={'large'}/>
                </View>
            )
        } else {
            return (
                <View style={container}>
                    <View>
                        {email ?
                            <Text style={emailText}>
                                Your email: {email}
                            </Text>
                            :
                            <Text style={errorText}>
                                {error}
                            </Text>}
                    </View>
                    <Button onPress={this.props.deleteJWT}>
                        Log Out
                    </Button>
                </View>
            );
        }
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    emailText: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 20
    },
    errorText: {
        alignSelf: 'center',
        fontSize: 18,
        color: 'red'
    }
};