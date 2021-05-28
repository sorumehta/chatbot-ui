import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import {
    getUserScopes, areScopeReady, can,
} from '../../lib/scopes';
import {UserAccounts} from '../../api/user_accounts/user_accounts.collection'

class Index extends React.Component {
    componentDidMount() {
        this.route();
    }

    componentDidUpdate(prevProps) {
        const { projectsReady } = this.props;
        if (projectsReady !== prevProps.projectsReady) {
            this.route();
        }
    }

    roleRouting = (pId, accountId) => {
        if (can('projects:r')) {
            return `/accounts/${accountId}/projects`;
        }
        if (can('stories:r', pId)) {
            return `/project/${pId}/dialogue`;
        }
        if (can('users:r', { anyScope: true })) {
            return `/accounts/${accountId}/users`;
        }
        if (can('roles:r', { anyScope: true })) {
            return `/accounts/${accountId}/roles`;
        }
        if (can('global-settings:r', { anyScope: true })) {
            return `/accounts/${accountId}/settings`;
        }
        if (can('nlu-data:r', pId)) {
            return `/project/${pId}/nlu/models`;
        }
        if (can('responses:r', pId)) {
            return `/project/${pId}/responses`;
        }
        if (can('export:x', pId) || can('import:x', pId)) {
            return `/project/${pId}/settings/import-export`;
        }
        if (can('git-credentials:r', pId)) {
            return `/project/${pId}/settings/git-credentials`;
        }
        return ('/404');
    };

    route = () => {
        const { router, projectsReady } = this.props;
        if (Meteor.userId()) {
            Tracker.autorun(() => {
                if (Meteor.user() && areScopeReady() && projectsReady) {
                    const projects = getUserScopes(Meteor.userId());
                    console.log(`Meteor userId = ${Meteor.userId()}`)
                    const accountObj = UserAccounts.findOne({userId: Meteor.userId()})
                    console.log("accountObj inside index.js returned as")
                    console.log(accountObj)
                    router.push(this.roleRouting(projects[0], accountObj.accountId));
                }
            });
        } else {
            router.push('/login/');
        }
    };

    render() {
        return <div />;
    }
}

Index.propTypes = {
    router: PropTypes.object.isRequired,
    projectsReady: PropTypes.bool.isRequired,
};

export default withTracker(() => {
    const projectsHandler = Meteor.subscribe('projects.names');
    Meteor.subscribe('user_accounts');

    return {
        projectsReady: projectsHandler.ready(),
    };
})(Index);
