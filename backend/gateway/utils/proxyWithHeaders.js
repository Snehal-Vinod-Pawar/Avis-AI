import proxy from "express-http-proxy";

export const proxyWithHeaders = (serviceUrl, options = {}) => {
    const defaultOptions = {
        timeout: 120000, // 2 minutes timeout for agent requests
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if(srcReq.user) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
            }
            return proxyReqOpts
        }  
    }
    
    return proxy(serviceUrl, { ...defaultOptions, ...options })
}
