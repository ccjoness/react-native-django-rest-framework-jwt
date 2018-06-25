import React, {Component, Fragment} from 'react';
import {View, Text} from 'react-native';
import {Input, TextLink, Loading, Button} from './common';
import axios from 'axios';
import deviceStorage from '../services/deviceStorage';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            loading: false
        };

        this.loginUser = this.loginUser.bind(this);
        this.onLoginFail = this.onLoginFail.bind(this);
    }

    loginUser() {
        const {email, password, password_confirmation} = this.state;

        this.setState({error: '', loading: true});

        axios.post("http://218e4777.ngrok.io/api-token-auth/", {
            email: email,
            password: password
        }, {
            headers: {
                'Accept': 'application/json',
            }
        })
            .then((response) => {
                // console.log(response);
                deviceStorage.saveKey("id_token", response.data.token);
                this.props.newJWT(response.data.token);
            })
            .catch((error) => {
                console.log(error);
                this.onLoginFail();
            });
    }

    onLoginFail() {
        this.setState({
            error: 'Login Failed',
            loading: false
        });
    }

    render() {
        const {email, password, error, loading} = this.state;
        const {form, section, errorTextStyle} = styles;

        return (
            <Fragment>
                <View style={form}>
                    <View style={section}>
                        <Input
                            placeholder="Username"
                            label="Email"
                            value={email}
                            onChangeText={email => this.setState({email})}
                        />
                    </View>

                    <View style={section}>
                        <Input
                            secureTextEntry
                            placeholder="password"
                            label="Password"
                            value={password}
                            onChangeText={password => this.setState({password})}
                        />
                    </View>

                    <Text style={errorTextStyle}>
                        {error}
                    </Text>

                    {!loading ?
                        <Button onPress={this.loginUser}>
                            Login
                        </Button>
                        :
                        <Loading size={'large'}/>
                    }

                </View>
                <TextLink onPress={this.props.authSwitch}>
                    Don't have an account? Register!
                </TextLink>
            </Fragment>
        );
    }
}

const styles = {
    form: {
        width: '100%',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    section: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#ddd',
    },
    errorTextStyle: {
        alignSelf: 'center',
        fontSize: 18,
        color: 'red'
    }
};
export {Login};