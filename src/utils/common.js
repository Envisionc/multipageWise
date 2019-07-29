module.exports = {
    createUUID() {
        return (this.tid() +"_" + this.rid() +"_"+ this.rid() +"_"+ this.rid() )
    },
    tid() {
        let mydate = new Date()
        let uuid = mydate.getDay()+ mydate.getHours()+ mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds()+ Math.round(Math.random() * 10000);
        return uuid
    },
    rid() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },
}