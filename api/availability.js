import {availabilityMiddleware} from '../server/availability.mjs';

export default (req,res)=>availabilityMiddleware(req,res,()=>{res.statusCode=404;res.end('Not found');});
