const corsLib = require("cors");

const options = {origin:"http://localhost:3000",credentials:true}

const cors = corsLib(options);

export default cors;