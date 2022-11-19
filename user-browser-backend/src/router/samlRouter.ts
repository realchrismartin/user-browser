import { Response } from "express";
const passport = require("../config/passport").default;
const { XMLParser} = require("fast-xml-parser");
const config = require("../config/config").default;

const express = require("express");
const router = express.Router();

//This endpoint is called when the front-end app context reloads (useEffect at the context level)
//It checks to determine if the user has a session or not
router.get("/me", async(req: any, res: Response) => {

    //If the user has no session, return a 403
    if(!req.user)
    {
        res.sendStatus(403);
        return;
    }

    //Send the user object back if the user is logged in
    let user = req.user;
    user.groups = ["somegroup"]; //TODO: add user's actual groups from the session state
    res.send(user);
});

//This endpoint is called when a user clicks login in the front-end
//It starts the SAML process, which calls the loopback
//and returns the IDP URL and SAML claim to the front-end for usage
router.get('/login', 

    passport.authenticate(config.passport.strategy,{}), //No redirect config specified because we override it in the frontend anyway

    //This will call /loopback due to the URI specified in config.passport.strategy
    //The result is that the front-end resolution of this request is the result of the loopback, below
    //The front-end can then forward the AuthNRequest to the IDP and continue the process without CORS issues
);

router.get('/loopback',(req:any,res:any)=>{
    
    //This request was redirected from ourselves, so it doesn't go directly to the idp
    //This is to avoid CORS issues with passport-saml (see above)
    res.send({url:config.idpLogInURL + "?SAMLRequest=" + encodeURIComponent(req.query.SAMLRequest)});
});

router.get('/logout',(req:any,res:any)=>{

    if(!req.user)
    {
        res.sendStatus(400); //User doesn't have a session
        return;
    }

    //Destroy the session
    req.logout(function(err:any) {
        //Send the idp logout URL back
        res.send({url:config.idpLogOutURL});
    });
});

//SAML Consumer endpoint
//Is called by the IDP after a user authenticates
//Goal: receive the SAML claim from the IDP, create a session, then redirect the user back to the front-end app
//We assume that this will be a foreground request due to the nature of SAML.
router.post('/consume', 

    passport.authenticate(config.passport.strategy,{}), //No redirect config specified because we unconditionally redirect immediately after this

    function (req : any, res : Response) {
        //Redirect the user back to the frontend
        res.redirect(config.frontEndURL);
    }
);

module.exports = router;