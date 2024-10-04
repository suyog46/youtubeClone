import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/user.model.js'; // Import user model

// import { env } from 'env';

 const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID||'859581558880-6gp4na0ot38e99vqg5afk366nvoq5ppc.apps.googleusercontent.com'
 const GOOGLE_CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET||'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'
console.log("eta xu hgai ",GOOGLE_CLIENT_SECRET)
// Google OAuth strategy configuration
passport.use(new GoogleStrategy({

  clientID:GOOGLE_CLIENT_ID,  
  clientSecret: GOOGLE_CLIENT_SECRET,  
  callbackURL: "/api/v1/users/auth/google/callback" 
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await userModel.findOne({ googleId: profile.id });
    
    if (!user) {
      user = await userModel.create({
        googleId: profile.id,
        email: profile.emails[0].value, 
        username: profile.displayName,  
        profilePicture: profile.photos[0] ? profile.photos[0].value : null, 
      });
    }

    return done(null, user); 
  } catch (err) {
    return done(err, null); 
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user); 
  } catch (err) {
    done(err, null); 
  }
});

export default passport; 