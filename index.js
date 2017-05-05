const _prepare = require('prepack')
exports.registerPlugin = (cli, options)=>{
    cli.registerHook('route:didRequest', (req, data, content, cb)=>{
        //如果不需要编译
        if(!/\.js$/.test(req.path)){
            return cb(null, content)
        }
        try{
            cli.log.info(req.path)
            let result = _prepare.prepack(content, {
                timeout: 500,
                compatibility: "browser",
                logStatistics:true
            })
            cb(null, result.code)
        }catch(e){
            cb(e)
        }
    }, 50)
    cli.registerHook('build:didCompile', (buildConfig, data, content, cb)=>{
        let inputFilePath = data.inputFilePath;
        let outFilePath = data.outputFilePath;
        if(!/(\.js)$/.test(outFilePath)){
            return cb(null, content)
        }
        if(!content){
            console.log("error: ",inputFilePath )
        }
        try{
            let result = _prepare.prepack(content, {
                timeout: 500,
                compatibility: "browser"
            })
            cb(null, result.code)
        }catch(e){
            cb(e)
        }
  }, 50)
}
