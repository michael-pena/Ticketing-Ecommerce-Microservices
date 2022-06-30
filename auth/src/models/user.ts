import mongoose, { mongo } from "mongoose";
import { Password } from '../services/password';

//interface - properties required to create new user
interface UserAttrs {
    email: string;
    password: string;
}

//interface - properties for user model
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

//interface - properties that a user document has / single user
interface UserDoc extends mongoose.Document{
    email: string;
    password: string;
}


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        //obtains the hashed password from the user doc
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);        
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };