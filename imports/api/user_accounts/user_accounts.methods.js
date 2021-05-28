
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { UserAccounts } from './user_accounts.collection';
import { checkIfCan } from '../../lib/scopes';
import { auditLogIfOnServer } from '../../lib/utils';


function handleError(e) {
    if (e.code === 11000) {
        throw new Meteor.Error(400, 'Account already exists');
    }
    throw new Meteor.Error(500, 'Server Error');
}

Meteor.methods({
    'accounts.insert'(userId) {
        // checkIfCan('stories:w', projectId);
        // check(slot, Object);
        // check(projectId, String);
        // validateSchema(slot);
        try {
            const num_accounts = UserAccounts.find({}).count()
            return UserAccounts.insert({userId: userId, accountId: num_accounts+1});
        } catch (e) {
            console.error(e)
            return handleError(e);
        }
    },
});
