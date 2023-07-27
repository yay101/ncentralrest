import { load } from "https://deno.land/std/dotenv/mod.ts";
import { serve } from "https://deno.land/std@0.187.0/http/server.ts";
import soapRequest from 'https://deno.land/x/easy_soap_request/index.d.js';
import { parse } from "https://deno.land/x/xml/mod.ts"
const env = await load();
const handler = async (request) => {
    var data;
    var state = 200;
    if(request.headers.get("X-Api-Key") == env.ncentral_request_apikey){
        const requrl = request.url.split("/");
        switch(request.method){
            case "GET":
                switch('function'){
                    case typeof ncentral[requrl[requrl.length -1]]:
                        data = await ncentral[requrl[requrl.length -1]]()
                    break;
                    case typeof ncentral[requrl[requrl.length -2]]:
                        data = await ncentral[requrl[requrl.length -2]]([requrl[requrl.length -1]])
                    break;
                    default:
                        data = {error:"Endpoint Not Found"}
                        state = 404
                    break;
                }
                break
            case "POST":
                if(typeof ncentral[requrl[requrl.length -1]] == 'function'){
                    const json = request.body.json()
                    data = await ncentral[requrl[requrl.length -1]](json)
                }
            break;
            default:
                data = {error:"Endpoint Not Found"}
                state = 404
            break;
        }
    } else {
        state = 403;
        data = null;
    }
    return new Response(JSON.stringify(data),{status: state})
}
const ncentral = {
    header: {
        'Content-Type': 'text/xml;charset=UTF-8',
    },
    async Request(xml): Promise<any> {
        const body = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ei2="http://ei2.nobj.nable.com/">
        <soap:Header/>
        <soap:Body>
        ${xml}
        </soap:Body>
        </soap:Envelope>
        `
        const array = new Array;
        const { response } = await soapRequest({ url: env.ncentral_url, headers: this.header, xml: body });
        const respbody = parse(response.body)["soap:Envelope"]["soap:Body"]
        for(const key of Object.keys(respbody)){
            if(key.includes("Response")){
                try{
                    for(const item of respbody[key]["return"]){
                        array.push(item.items)
                    }
                } catch {
                    if(array.length == 0){
                        array.push(respbody[key]["return"])
                    }
                    console.log(respbody[key]["return"] + " not iterable.")
                }
            }
        }
        return this.processDetails(array)
    },
    async process(array){
        const returnarray = new Array;
        for(const item of await array){
            var data = {};
            for(const property of item){
                data[(property.key).split(".")[1]] = property.value;
            }
            returnarray.push(data)
        }
        return returnarray
    },
    async processDetails(array){
        var responsearray = new Array
        for(var items of await array){
            var data = {};
            if(!items["items"]){
                for(const property of items){
                    data[(property.key).split(".")[1]] = property.value || null;
                }
                responsearray.push(data)
                continue
            }
            for(const property of items["items"]){
                const parts = (property.key).split(".")
                if(Number(parts[parts.length - 1]) >= 0){
                    //is it a number
                    const int = Number(parts[parts.length - 1]);
                    //yes its an array
                    if(!Array.isArray(data[parts[1]])){
                        console.log("Its not an array")
                        data[parts[1]] = new Array;
                    }
                    if(!data[parts[1]][int]){
                        data[parts[1]].push({});
                    }
                    data[parts[1]][int][parts[2]] = property.value;
                } else {
                    if(!data[parts[1]]){
                        data[parts[1]] = {}
                    }
                    data[parts[1]][parts[2]] = property.value;
                }
            }
            responsearray.push(data)
        }
        return responsearray
    },
    accessgroupadd(){
        return this.Request(``)
    },
    accessgroupget(){
        return this.Request(``)
    },
    accessgrouplist(){

    },
    acknowledgenotification(){

    },
    activeissueslist(){

    },
    customeradd(){

    },
    customerdelete(){

    },
    customerlist(){
        return this.Request(`<ei2:customerList>
        <ei2:username></ei2:username>
        <ei2:password>${env.ncentral_apikey}</ei2:password>
        </ei2:customerList>`)
    },
    customerlistchildren(id: string){
        return this.Request(`<ei2:customerListChildren>
        <ei2:username>?</ei2:username>
        <ei2:password>${env.ncentral_apikey}</ei2:password>
        <ei2:settings>
            <ei2:key>customerID</ei2:key>
            <ei2:value>${id}</ei2:value>
        </ei2:settings>
        </ei2:customerListChildren>`)
    },
    customermodify(props){
        var keysets = ""
        for(const key of Object.keys(props)){
            keysets += `<ei2:key>${key}</ei2:key>
            <ei2:value>${props[key]}</ei2:value>`
        }
        return this.Request(`<ei2:customerModify>
        <ei2:username>?</ei2:username>
        <ei2:password>${env.ncentral_apikey}</ei2:password>
        <ei2:settings>
            ${keysets}
        </ei2:settings>
        </ei2:customerModify>
        `)
    },
    deviceassetinfoexportdevice(){
        //Please leave unimplemented.
    },
    deviceassetinfoexportdevicewithsettings(props){
        var keysets = ""
        //only use the first key/ filter option
        for(const key of Object.keys(props)[0]){
            for(const filter of props[key]){
                keysets += `<ei2:key>${key}</ei2:key>
            <ei2:value>${filter}</ei2:value>`
            }
        }
        return this.Request(`<ei2:deviceAssetInfoExportDeviceWithSettings>
        <ei2:version>0.0</ei2:version>
        <ei2:username>?</ei2:username>
        <ei2:password>${env.ncentral_apikey}</ei2:password>
        <ei2:settings>
            ${keysets}
        </ei2:settings>
        </ei2:deviceAssetInfoExportDeviceWithSettings>
        `)
    },
    deviceget(id: string) {
        return this.Request(`<ei2:deviceGet>
        <ei2:username></ei2:username>
        <ei2:password>${env.ncentral_apikey}</ei2:password>
        <ei2:settings>
            <ei2:key>deviceid</ei2:key>
            <ei2:value>${id}</ei2:value>
        </ei2:settings>
        </ei2:deviceGet>`)
    },
    devicegetstatus(id: string) {
        return this.Request(`<ei2:deviceGetStatus>
        <ei2:username></ei2:username>
        <ei2:password>${env.ncentral_apikey}</ei2:password>
        <ei2:settings>
            <ei2:key>deviceid</ei2:key>
            <ei2:value>${id}</ei2:value>
        </ei2:settings>
        </ei2:deviceGetStatus>`)
    },
    devicelist(id: string) {
        return this.Request(`<ei2:deviceList>
        <ei2:username></ei2:username>
        <ei2:password>${env.ncentral_apikey}</ei2:password>
        <ei2:settings>
            <ei2:key>CustomerID</ei2:key>
            <ei2:value>${id}</ei2:value>
        </ei2:settings>
        </ei2:deviceList>`)
    },
    devicepropertylist(){
        //cant see a use case not covered elsewhere.
    },
    devicepropertymodify(props){
        var keysets = ""
        //only use the first key/ filter option
        for(const key of Object.keys(props)){
            if(key == "id"){
                continue
            }
            keysets += `<ei2:key>${key}</ei2:key>
            <ei2:value>${props[key]}</ei2:value>`
        }
        return this.Request(`<ei2:devicePropertyModify>
        <ei2:username></ei2:username>
        <ei2:password>${env.ncentral_apikey}</ei2:password>
        <ei2:deviceProperties>
            <ei2:deviceID>${props.id}</ei2:deviceID>
            <ei2:deviceName>?</ei2:deviceName>
            <ei2:properties>
                <ei2:defaultValue>?</ei2:defaultValue>
                <ei2:devicePropertyID>?</ei2:devicePropertyID>
                <ei2:dropdownValues>?</ei2:dropdownValues>
                <ei2:label>?</ei2:label>
                <ei2:type>?</ei2:type>
                <ei2:value>?</ei2:value>
            </ei2:properties>
            <ei2:url>?</ei2:url>
        </ei2:deviceProperties>
        </ei2:devicePropertyModify>`)
    },
    jobstatuslist(id: string){
        return this.Request(`<ei2:jobStatusList>
        <ei2:username></ei2:username>
        <ei2:password>${env.ncentral_apikey}</ei2:password>
        <ei2:settings>
            <ei2:key>customerID</ei2:key>
            <ei2:value>${id}</ei2:value>
        </ei2:settings>
        </ei2:jobStatusList>
        `)
    },
    devicedetail(id: string){
        return this.Request(`<ei2:deviceAssetInfoExportDeviceWithSettings>
        <ei2:version>0.0</ei2:version>
        <ei2:username></ei2:username>
        <ei2:password>${env.ncentral_apikey}</ei2:password>
        <ei2:settings>
            <ei2:key>TargetByDeviceID</ei2:key>
            <ei2:value>${id}</ei2:value>
        </ei2:settings>
        </ei2:deviceAssetInfoExportDeviceWithSettings>`)
    },
}

await serve(handler, { port:env.ncentral_port });