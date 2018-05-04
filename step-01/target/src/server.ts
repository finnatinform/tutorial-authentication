import Express = require('express');
import Passport = require('passport');
import LocalStrategy = require('passport-local');
import BodyParser = require('body-parser');

class AuthenticationServer {

    private Application: Express.Application;

    constructor() {
        this.Application = Express();

        this.InitializeStrategies();
        this.InitializeMiddleware();
        this.InitializeRoutes();

        this.OnServerStart = this.OnServerStart.bind(this);
    }

    private get Port(): number {
        return 8080;
    }

    private InitializeStrategies():void{
        // Default for Options are "username" and "password"
        Passport.use( new LocalStrategy.Strategy( { usernameField:'User' , passwordField:'Password'} , this.LocalVerify ) );
    }

    private LocalVerify( _User: string, _Password: string, _Done: ( _Error: any, _User?: any, _Options?: LocalStrategy.IVerifyOptions) => void ): void {
        // Hier könnten Ihr Nutzerdaten stehen!
        if( _User == 'fzentgra' && _Password == '1234' ){
            return _Done( null , _User );
        } else {
            return _Done( null , false , { message : 'Incorrect data' } );
        }
    }

    private InitializeMiddleware() {
        this.Application.use(Express.static('public'));
        this.Application.use(BodyParser.urlencoded( { extended : false } ));
        this.Application.use(Passport.initialize());
    }

    private InitializeRoutes() {
        // Login
        this.Application.post('/login', Passport.authenticate('local' , { session : false }), this.OnLogin);

        // Logout
        this.Application.post( '/logout', this.OnLogout );
    }

    private OnLogin(_Request: Express.Request, _Response: Express.Response): void {
        console.log('login');
        _Response.end(_Request.user);
    }

    private OnLogout(_Request: Express.Request, _Response: Express.Response): void {
        // doesnt work. maybe because of sessions?
        console.log('logout ' + _Request.user);
        if( _Request.user ){
            _Request.logout();
            _Response.end('success');
        } else {
            _Response.end('error');
        }
    }
    
    private OnServerStart() {
        console.log(`AuthenticationServer has been started on Port ${this.Port}`);
    }

    public Start(): void {
        this.Application.listen(this.Port, this.OnServerStart);
    }
}


let Server = new AuthenticationServer();
Server.Start();