/* eslint-disable no-param-reassign */
import { Container, Segment, Step } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import React from 'react';

import StepAccount from './StepAccount';
import {UserAccounts} from '../../../api/user_accounts/user_accounts.collection'
import { wrapMeteorCallback } from '../utils/Errors';

class SetupSteps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        // Meteor.call('users.checkEmpty', (err, empty) => {
        //     if (!empty) {
        //         const { router } = this.props;
        //         router.push('/login');
        //     }
        // });
    }

    handleAccountSubmit = (doc) => {
        const { router } = this.props;
        doc.firstName = doc.firstName.trim();
        doc.lastName = doc.lastName.trim();
        doc.email = doc.email.trim();
        doc.password = doc.password.trim();
        this.setState({ loading: true });
        let setupMethodName = 'initialSetup'
        Meteor.call('users.checkEmpty', (err, empty) => {
            if (!empty) {
                console.log("users collection not empty. Will invoke newAccountSetup instead of initialSetup")
                setupMethodName = 'newAccountSetup'
            }
            Meteor.call(
                setupMethodName,
                doc,
                wrapMeteorCallback((err) => {
                    if (err) {
                        this.setState({ loading: false });
                        throw new Error(err);
                    }
                    Meteor.loginWithPassword(
                        doc.email,
                        doc.password,
                        wrapMeteorCallback(() => {
                            Promise.all([
                                Meteor.callWithPromise('nlu.chitChatSetup'),
                            ])
                                .then(() => {
                                    this.setState({ loading: false });
                                    const userAccntObj = UserAccounts.findOne({email: doc.email})
                                    console.log("userAccount object returned:")
                                    console.log(userAccntObj)
                                    router.push(`/accounts/${userAccntObj.accountId}/projects`);
                                })
                                .catch((e) => {
                                    this.setState({ loading: false });
                                    // eslint-disable-next-line no-console
                                    console.log(e);
                                });
                        }),
                    );
                }),
            );
        });
        
    };

    render() {
        const { loading } = this.state;
        return (
            <Container>
                <Segment disabled={loading}>
                    <Step.Group fluid size='large'>
                        <Step
                            active
                            title='Create your admin account'
                            onClick={this.handleAccountClick}
                            data-cy='account-step'
                        />
                    </Step.Group>
                    <StepAccount onSubmit={this.handleAccountSubmit} loading={loading} />
                </Segment>
            </Container>
        );
    }
}

SetupSteps.propTypes = {
    router: PropTypes.object.isRequired,
};

export default SetupSteps;
