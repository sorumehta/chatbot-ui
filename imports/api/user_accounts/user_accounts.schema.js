import SimpleSchema from 'simpl-schema';


export const UserAccountSchema = new SimpleSchema({
    userId: { type: String},
    accountId: { type: String}
})
