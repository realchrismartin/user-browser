const id : string | undefined = process.env.REACT_APP_SUB_APP_ID

const config = {
    appId: id!,
    redirectUri: 'http://localhost:3000',
    scopes: [
      'user.read.all'
    ]
  };
  
  export default config;